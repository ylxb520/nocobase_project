import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import React from 'react';
class HelloBlockModel extends FlowModel {
  render() {
    return React.createElement('div', { ref: this.context.ref });
  }
}
HelloBlockModel.registerFlow({
  key: 'ref-example',
  title: 'Ref Example',
  steps: {
    refReady: {
      handler: async (ctx) => {
        ctx.onRefReady(ctx.ref, (el) => {
          el.innerHTML = '<h1>Hello, NocoBase!</h1>';
        });
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
    const fork1 = model.createFork({}, 'fork1');
    const fork2 = model.createFork({}, 'fork2');
    // 注册路由，渲染模型
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        'div',
        null,
        React.createElement('h3', null, 'Fork1'),
        React.createElement(FlowModelRenderer, { model: fork1 }),
        React.createElement('h3', null, 'Fork2'),
        React.createElement(FlowModelRenderer, { model: fork2 }),
      ),
    });
  }
}
// 创建应用实例，注册插件
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=onRefReady.js.map
