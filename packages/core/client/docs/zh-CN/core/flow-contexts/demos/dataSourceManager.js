import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import React from 'react';
class HelloBlockModel extends FlowModel {
  collection;
  get dataSource() {
    return this.context.dataSourceManager.getDataSource('main');
  }
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement('h3', null, 'Data source'),
      React.createElement('div', null, this.dataSource.displayName),
      React.createElement('h3', null, 'Collection'),
      React.createElement('div', null, this.collection.title),
    );
  }
}
HelloBlockModel.registerFlow({
  key: 'ref-example',
  title: 'Ref Example',
  steps: {
    step1: {
      handler: async (ctx) => {
        const dataSource = ctx.dataSourceManager.getDataSource('main');
        ctx.model.collection = dataSource.getCollection('collection1');
      },
    },
  },
});
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloBlockModel });
    // 全局注册
    const dataSource = this.flowEngine.context.dataSourceManager.getDataSource('main');
    dataSource.addCollection({
      name: 'collection1',
      title: 'Collection 1',
    });
    const model = this.flowEngine.createModel({
      uid: 'my-model',
      use: 'HelloBlockModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
// 创建应用实例，注册插件
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=dataSourceManager.js.map
