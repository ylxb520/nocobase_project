import { observable } from '@formily/reactive';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button } from 'antd';
import React from 'react';
class ObjectResource {
  meta = observable.shallow({
    filter: {},
    filterByTk: null,
    appends: [],
    data: {},
  });
  get data() {
    return this.meta.data;
  }
  set data(value) {
    this.meta.data = value;
  }
  getData() {
    return this.meta.data;
  }
  setData(data) {
    this.meta.data = data;
  }
  async refresh() {
    this.setData({
      id: Math.floor(Math.random() * 10000),
      name: `Item ${Math.floor(Math.random() * 100)}`,
    });
  }
}
class ObjectResourceFlowModel extends FlowModel {
  resource = new ObjectResource();
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement('pre', null, JSON.stringify(this.resource.getData(), null, 2)),
      React.createElement(
        Button,
        {
          onClick: () => {
            this.resource.refresh();
          },
        },
        'Refresh',
      ),
    );
  }
}
// 插件定义
class PluginTableBlockModel extends Plugin {
  async load() {
    this.flowEngine.registerModels({ ObjectResourceFlowModel });
    const model = this.flowEngine.createModel({
      use: 'ObjectResourceFlowModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement('div', null, React.createElement(FlowModelRenderer, { model: model })),
    });
  }
}
// 创建应用实例
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginTableBlockModel],
});
export default app.getRootComponent();
//# sourceMappingURL=object-resource.js.map
