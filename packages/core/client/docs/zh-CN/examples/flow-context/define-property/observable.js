import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Card, Space } from 'antd';
import React from 'react';
class HelloModel extends FlowModel {
  onInit() {
    this.context.defineProperty('cached', {
      get: () => uid(),
      observable: true, // 可选，默认为 false
    });
  }
  render() {
    return React.createElement(
      Space,
      { direction: 'vertical' },
      React.createElement(
        Button,
        {
          onClick: () => {
            this.context.removeCache('cached');
          },
        },
        '\u5237\u65B0\u5C5E\u6027\u503C',
      ),
      this.mapSubModels('examples', (model) =>
        React.createElement(FlowModelRenderer, { key: model.uid, model: model }),
      ),
    );
  }
}
class Cache1Model extends FlowModel {
  render() {
    return React.createElement(
      Card,
      { title: '\u5E26\u7F13\u5B58\u7684\u5C5E\u6027\uFF08cached\uFF09', style: { width: 340 } },
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.cached),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.cached),
    );
  }
}
class Cache2Model extends FlowModel {
  render() {
    return React.createElement(
      Card,
      { title: '\u5E26\u7F13\u5B58\u7684\u5C5E\u6027\uFF08cached\uFF09', style: { width: 340 } },
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.cached),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.cached),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloModel, Cache1Model, Cache2Model });
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      subModels: {
        examples: [{ use: 'Cache1Model' }, { use: 'Cache2Model' }],
      },
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=observable.js.map
