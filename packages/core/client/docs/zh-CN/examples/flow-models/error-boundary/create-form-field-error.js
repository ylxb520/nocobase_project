/**
 * defaultShowCode: true
 * title: 错误回退 - CreateForm 字段渲染异常
 */
import {
  Application,
  CreateFormModel,
  FilterManager,
  FormFieldModel,
  FormGridModel,
  FormItemModel,
  Plugin,
} from '@nocobase/client';
import { FlowEngineProvider, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { APIClient } from '@nocobase/sdk';
import { Card } from 'antd';
import React from 'react';
// 一个会在渲染时抛出错误的自定义表单项
class ThrowFormItem extends FlowModel {
  render() {
    throw new Error('Demo: 字段渲染失败（ThrowFormItem）');
  }
}
class DemoPlugin extends Plugin {
  form;
  async load() {
    // 提供 api（用于 ErrorFallback 的“下载日志”按钮）
    const api = new APIClient({ baseURL: 'https://localhost:8000/api' });
    this.flowEngine.context.defineProperty('api', { value: api });
    // 强制开启配置模式（demo 场景下始终展示 FlowSettings）
    this.flowEngine.flowSettings.forceEnable();
    // 准备数据源与集合
    const dsm = this.flowEngine.context.dataSourceManager;
    dsm.getDataSource('main') || dsm.addDataSource({ key: 'main', displayName: 'Main' });
    dsm.getDataSource('main').addCollection({
      name: 'posts',
      title: 'Posts',
      filterTargetKey: 'id',
      fields: [
        { name: 'id', type: 'bigInt', title: 'ID' },
        { name: 'title', type: 'string', title: 'Title' },
      ],
    });
    // 注册需要的模型（以及抛错项）
    this.flowEngine.registerModels({
      CreateFormModel,
      FormGridModel,
      FormItemModel,
      FormFieldModel,
      ThrowFormItem,
    });
    // 创建 CreateFormModel，并配置到 posts 集合
    this.form = this.flowEngine.createModel({
      use: 'CreateFormModel',
      stepParams: { resourceSettings: { init: { dataSourceKey: 'main', collectionName: 'posts' } } },
      subModels: {
        grid: {
          use: 'FormGridModel',
          subModels: {
            items: [
              // 正常字段（title）
              {
                use: 'FormItemModel',
                stepParams: {
                  fieldSettings: { init: { dataSourceKey: 'main', collectionName: 'posts', fieldPath: 'title' } },
                },
                subModels: {
                  field: {
                    use: 'FormFieldModel',
                    stepParams: {
                      fieldSettings: { init: { dataSourceKey: 'main', collectionName: 'posts', fieldPath: 'title' } },
                    },
                  },
                },
              },
              // 故意抛错的自定义表单项
              { use: 'ThrowFormItem' },
            ],
          },
        },
      },
    });
    // 简单提供 filterManager，避免刷新流程绑定时报错
    this.form.context.defineProperty('filterManager', { value: new FilterManager(this.form) });
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        FlowEngineProvider,
        { engine: this.flowEngine },
        React.createElement(
          'div',
          { style: { padding: 16 } },
          React.createElement(
            Card,
            { title: 'CreateForm \u5B57\u6BB5\u6E32\u67D3\u5F02\u5E38\u6F14\u793A', style: { marginTop: 12 } },
            React.createElement(FlowModelRenderer, {
              model: this.form,
              showFlowSettings: true,
              showErrorFallback: true,
            }),
          ),
        ),
      ),
    });
  }
}
export default new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [DemoPlugin],
}).getRootComponent();
//# sourceMappingURL=create-form-field-error.js.map
