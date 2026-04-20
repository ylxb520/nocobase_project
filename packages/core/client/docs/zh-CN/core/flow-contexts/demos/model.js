import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import React from 'react';
class HelloBlockModel extends FlowModel {
  text;
  render() {
    return React.createElement('div', null, React.createElement('h1', null, this.text));
  }
}
HelloBlockModel.registerFlow({
  key: 'default',
  steps: {
    step1: {
      handler: async (ctx) => {
        ctx.model.text = 'Hello, NocoBase!';
      },
    },
  },
});
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloBlockModel });
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
//# sourceMappingURL=model.js.map
