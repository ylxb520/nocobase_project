/**
 * defaultShowCode: true
 * title: 错误回退 - CreateForm 自动流异常
 */
import { Application, CreateFormModel, FilterManager, FormGridModel, FormItemModel, Plugin } from '@nocobase/client';
import { FlowEngineProvider, FlowModelRenderer } from '@nocobase/flow-engine';
import { APIClient } from '@nocobase/sdk';
import { Card } from 'antd';
import React from 'react';
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
    this.flowEngine.registerModels({
      CreateFormModel,
      FormGridModel,
      FormItemModel,
    });
    this.form = this.flowEngine.createModel({
      use: 'CreateFormModel',
      stepParams: { resourceSettings: { init: { dataSourceKey: 'main', collectionName: 'posts' } } },
      subModels: {
        grid: {
          use: 'FormGridModel',
          subModels: {
            items: [
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
            ],
          },
        },
      },
    });
    // 在该表单实例上注册一个会在自动流阶段抛错的流程
    this.form.registerFlow({
      key: 'throwOnInit',
      sort: 1,
      steps: {
        init: {
          async handler() {
            throw new Error('Demo: 自动流执行失败（throwOnInit）');
          },
        },
      },
    });
    // 避免某些内部流程依赖缺失
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
            { title: 'CreateForm beforeRender\u4E8B\u4EF6\u6D41\u5F02\u5E38\u6F14\u793A', style: { marginTop: 12 } },
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
//# sourceMappingURL=create-form-auto-flows-error.js.map
