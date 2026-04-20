/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DataBlockModel, DEFAULT_DATA_SOURCE_KEY } from '@nocobase/client';
import { createCollectionContextMeta, SQLResource, useFlowContext } from '@nocobase/flow-engine';
import React, { createRef } from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import { useT, tStr } from '../../locale';
import { convertDatasetFormats, normalizeEChartsOption, sleep, debugLog } from '../utils';
import { Chart } from './Chart';
import { ConfigPanel } from './ConfigPanel';
import { DaraButton } from '../components/DaraButton';
import { ChartResource } from '../resources/ChartResource';
import { genRawByBuilder } from './ChartOptionsBuilder.service';
import { configStore } from './config-store';
import { useChatBoxStore, useChatMessagesStore } from '@nocobase/plugin-ai/client';
const NO_PREVIEW_SNAPSHOT = Symbol('NO_PREVIEW_SNAPSHOT');
export class ChartBlockModel extends DataBlockModel {
  _previousStepParams = NO_PREVIEW_SNAPSHOT; // 上一次持久化的 stepParams，用于 preview 时回滚
  get resource() {
    return this.context.resource;
  }
  // 统一管理 refresh 监听引用，便于 off 解绑
  __onResourceRefresh = () => this.renderChart();
  onActive() {
    this.resource.refresh();
  }
  refresh() {
    return this.resource.refresh();
  }
  // 初始化注册 ChartResource | SQLResource
  initResource(mode = 'builder') {
    // 1) 先拿旧实例并解绑，防止旧实例残留监听
    const oldResource = this.resource;
    if (oldResource instanceof ChartResource || oldResource instanceof SQLResource) {
      oldResource.off('refresh', this.__onResourceRefresh);
      oldResource.off('loading', this.__onResourceRefresh);
    }
    // 2) 重定义 resource，创建并缓存新实例
    if (mode === 'sql') {
      this.context.defineProperty('resource', {
        get: () => {
          const resource = this.context.createResource(SQLResource);
          resource.setSQLType('selectRows');
          resource.setFilterByTk(this.uid);
          return resource;
        },
      });
    } else {
      this.context.defineProperty('resource', {
        get: () => {
          const resource = this.context.createResource(ChartResource);
          return resource;
        },
      });
    }
    // 3) 绑定新实例监听，确保仅绑定一次
    const newResource = this.resource;
    if (newResource instanceof ChartResource || newResource instanceof SQLResource) {
      newResource.on('refresh', this.__onResourceRefresh);
      newResource.on('loading', this.__onResourceRefresh);
    }
  }
  getResourceSettingsInitParams() {
    return this.getStepParams('chartSettings', 'configure');
  }
  async onInit(options) {
    super.onInit(options);
    this.context.defineProperty('chartRef', {
      get: () => createRef(),
    });
    // // 初始化注册 ChartResource | SQLResource
    this.initResource();
    this.context.defineProperty('data', {
      get: () => convertDatasetFormats(this.resource.getData()),
      cache: false,
    });
    this.context.defineProperty('collection', {
      get: () => {
        const stepParams = this.getResourceSettingsInitParams();
        const [dataSourceKey, collectionName] = stepParams?.query?.collectionPath || [];
        return this.context.dataSourceManager.getCollection(dataSourceKey, collectionName);
      },
      meta: createCollectionContextMeta(() => {
        const stepParams = this.getResourceSettingsInitParams();
        const [dataSourceKey, collectionName] = stepParams?.query?.collectionPath || [];
        return this.context.dataSourceManager.getCollection(dataSourceKey, collectionName);
      }, this.context.t('Current collection')),
    });
    // 初始加载：根据持久化的 stepParams 应用查询并触发一次数据刷新
    try {
      const initParams = this.getResourceSettingsInitParams();
      const initQuery = initParams?.query;
      if (initQuery) {
        this.applyQuery(initQuery);
        await this.resource.refresh();
      }
    } catch (e) {
      const message = e?.message || String(e);
      console.error('ChartBlockModel init error:', message, e);
    }
  }
  renderComponent() {
    // TODO onRefReady 的逻辑理清，内部的 onRefReady props是否已经没必要？
    return React.createElement(Chart, {
      ...this.props.chart,
      dataSource: this.resource.getData(),
      loading: this.resource.loading,
      ref: this.context.chartRef,
    });
  }
  // 给外部筛选表单调用，获取图表可筛选字段
  async getFilterFields() {
    const stepParams = this.getResourceSettingsInitParams();
    const query = stepParams?.query;
    if (!query) {
      return [];
    }
    if (query?.mode === 'sql') {
      // sql 模式：从查询数据结果解析 fields
      const data = this.resource.getData();
      if (!data) {
        return [];
      }
      const fields = Object.keys(data[0] || {}).map((field) => {
        const fieldType = typeof data[0][field] === 'number' ? 'number' : 'string';
        return {
          name: field,
          title: field,
          type: fieldType,
          interface: fieldType === 'number' ? 'number' : 'input',
        };
      });
      return fields;
    } else {
      // builder 模式：从 collection 表解析 fields
      const fields = this.context.collection?.getFields().filter((field) => field.filterable) || [];
      return fields;
    }
  }
  // 检查当前资源与查询模式是否匹配，不匹配则重新初始化
  checkResource(query) {
    const mode = query?.mode || 'builder';
    if (mode === 'sql') {
      if (!(this.resource instanceof SQLResource)) {
        this.initResource('sql');
      }
    } else {
      if (!(this.resource instanceof ChartResource)) {
        this.initResource('builder');
      }
    }
  }
  // 应用数据查询配置（仅设置，不负责渲染）
  applyQuery(query) {
    this.checkResource(query);
    if (query?.mode === 'sql') {
      // SQL 模式下设置数据源 key（默认 main）
      const dsKey = query?.sqlDatasource || DEFAULT_DATA_SOURCE_KEY;
      this.resource.setDataSourceKey(dsKey);
      this.resource.setSQL(query.sql);
    } else {
      this.resource.setQueryParams(query);
    }
  }
  // 写入结果，用于展示数据，并联动更新 column 配置
  setDataResult() {
    const uid = this.uid;
    try {
      const data = this.resource.getData();
      configStore.setResult(uid, data);
    } catch (error) {
      const message = error?.response?.data?.errors?.map?.((e) => e.message).join('\n') || error?.message;
      configStore.setError(uid, message);
    }
  }
  // 应用图表配置（仅设置，不负责渲染）
  async applyChartOptions(payload) {
    const optionRaw = payload.mode === 'basic' ? genRawByBuilder(payload.builder) : payload.raw;
    const { success, value, error, timeout } = await this.context.runjs(optionRaw);
    if (!success && error) {
      console.error('applyChartOptions runjs error:', error);
      return;
    }
    normalizeEChartsOption(value);
    this.setProps({
      chart: {
        ...this.props.chart,
        optionRaw,
        option: value, // js对象
      },
    });
  }
  // 应用事件配置（仅设置，不负责渲染）
  async applyEvents(raw) {
    if (!raw) return;
    this.context.onRefReady(this.context.chartRef, async () => {
      const { success, value, error, timeout } = await this.context.runjs(raw, {
        chart: this.context.chartRef.current,
      });
      if (!success && error) {
        console.error('applyEvents runjs error:', error);
        return;
      }
    });
  }
  // 显式渲染（必要时可直接调用）
  renderChart() {
    this.rerender(); // 会继续触发 handler
  }
  // 预览，暂存预览前的 stepParams，并刷新图表
  async onPreview(params, needQueryData) {
    debugLog('---onPreview', params.query);
    const values = _.cloneDeep(params);
    if (!values) return;
    // 仅在首次预览时记录，以便 cancelPreview 回滚
    if (this._previousStepParams === NO_PREVIEW_SNAPSHOT) {
      this._previousStepParams = _.cloneDeep(this.getResourceSettingsInitParams());
    }
    // 应用最新 stepParams，随后触发 flow handler
    this.setStepParams('chartSettings', 'configure', values);
    if (needQueryData) {
      this.applyQuery(values.query);
      const isSQL = values?.query?.mode === 'sql';
      // 预览场景：SQL 模式开启 debug（调用 run）
      if (isSQL) {
        this.resource.setDebug(true);
      }
      try {
        // 等待确保 stepParams 已更新
        await sleep(200);
        await this.resource.refresh();
        this.setDataResult();
      } finally {
        if (isSQL) {
          // 预览完成后，确保 debug 关闭（后续调用 runById）
          this.resource.setDebug(false);
        }
      }
    }
  }
  // 取消预览，回滚stepParams，并刷新图表
  async cancelPreview() {
    if (this._previousStepParams !== NO_PREVIEW_SNAPSHOT) {
      const previous = this._previousStepParams;
      this.setStepParams('chartSettings', { configure: previous });
      this._previousStepParams = NO_PREVIEW_SNAPSHOT;
      // 等待确保 stepParams 已更新
      await sleep(100);
      // 重新请求数据，并刷新图表
      await this.resource.refresh();
    }
  }
}
const PreviewButton = ({ style }) => {
  const t = useT();
  const ctx = useFlowContext();
  return React.createElement(
    Button,
    {
      color: 'primary',
      variant: 'outlined',
      style: style,
      onClick: async () => {
        // 这里通过普通的 form.values 拿不到数据
        const formValues = ctx.getStepFormValues('chartSettings', 'configure');
        // 写入配置参数，统一走 onPreview 方便回滚
        await ctx.model.onPreview(formValues, true);
      },
    },
    t('Preview'),
  );
};
const CancelButton = ({ style }) => {
  const t = useT();
  const ctx = useFlowContext();
  return React.createElement(
    Button,
    {
      type: 'default',
      style: style,
      onClick: () => {
        // 回滚 未保存的 stepParams 并刷新图表
        ctx.model.cancelPreview();
        const aiOpen = useChatBoxStore.getState().open;
        const associatedUid = useChatMessagesStore.getState().currentEditorRefUid;
        if (aiOpen && associatedUid === ctx.model.uid) {
          useChatBoxStore.getState().setOpen(false);
        }
        ctx.view.close();
      },
    },
    t('Cancel'),
  );
};
ChartBlockModel.define({
  label: tStr('Charts'),
});
ChartBlockModel.registerFlow({
  key: 'chartSettings',
  title: tStr('Chart settings'),
  steps: {
    configure: {
      title: tStr('Configure chart'),
      uiMode: (ctx) => ({
        type: 'embed',
        props: {
          minWidth: '400px',
          onClose: () => {
            const aiOpen = useChatBoxStore.getState().open;
            const associatedUid = useChatMessagesStore.getState().currentEditorRefUid;
            if (aiOpen && associatedUid === ctx.model.uid) {
              useChatBoxStore.getState().setOpen(false);
            }
          },
          header: { extra: React.createElement(DaraButton, { ctx: ctx }) },
          footer: (originNode, { OkBtn }) =>
            React.createElement(
              'div',
              { style: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' } },
              React.createElement(CancelButton, { style: { marginRight: 6 } }),
              React.createElement(PreviewButton, { style: { marginRight: 6 } }),
              React.createElement(OkBtn, null),
            ),
        },
      }),
      uiSchema: {
        configuration: {
          type: 'void',
          'x-component': ConfigPanel,
        },
      },
      async beforeParamsSave(ctx, params) {
        const mode = params.query?.mode || 'builder';
        if (mode === 'sql') {
          return ctx.sql.save({
            uid: ctx.model.uid,
            sql: params.query.sql,
            dataSourceKey: params.query.sqlDatasource,
          });
        }
      },
      async afterParamsSave(ctx, params) {
        ctx.model._previousStepParams = NO_PREVIEW_SNAPSHOT;
      },
      defaultParams(ctx) {
        // 数据查询默认 builder 模式；图表配置默认 basic 模式
        return {
          query: {
            mode: 'builder',
          },
          chart: {
            option: {
              mode: 'basic',
            },
          },
        };
      },
      useRawParams: true,
      async handler(ctx, params) {
        debugLog('---setting flow handler', params);
        let { query } = params;
        const { chart } = params;
        if (!query || !chart) {
          return;
        }
        try {
          // 数据部分
          if (query.mode !== 'sql') {
            // builder 模式下变量解析；sql 模式下交给 sqlResource 处理解析
            query = await ctx.resolveJsonTemplate(query);
          }
          ctx.model.applyQuery(query);
          // 图表部分
          await ctx.model.applyChartOptions({
            mode: chart.option?.mode || 'basic',
            builder: chart.option?.builder,
            raw: chart.option?.raw,
          });
          // 事件部分
          if (chart.events?.raw) {
            await ctx.model.applyEvents(chart.events?.raw);
          }
        } catch (error) {
          console.error('ChartBlockModel chartSettings configure flow handler() error:', error);
        }
      },
    },
  },
});
//# sourceMappingURL=ChartBlockModel.js.map
