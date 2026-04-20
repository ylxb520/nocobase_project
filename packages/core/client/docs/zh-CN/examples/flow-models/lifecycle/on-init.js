import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import React from 'react';
class HelloModel extends FlowModel {
  onInit(options) {
    console.log('onInit');
  }
  onMount() {
    console.log('onMount');
  }
  onUnmount() {
    console.log('onUnmount');
  }
  async onDispatchEventStart(eventName) {
    if (eventName === 'beforeRender') {
      console.log('onDispatchEventStart(beforeRender)');
    }
  }
  async onDispatchEventEnd(eventName) {
    if (eventName === 'beforeRender') {
      console.log('onDispatchEventEnd(beforeRender)');
    }
  }
  render() {
    console.log('render');
    return React.createElement(
      'div',
      null,
      React.createElement('h1', null, 'Hello, NocoBase!'),
      React.createElement('p', null, 'This is a simple block rendered by HelloModel.'),
    );
  }
}
HelloModel.registerFlow({
  key: 'a',
  steps: {},
});
class PluginHelloModel extends Plugin {
  async load() {
    // 注册 HelloModel 到 flowEngine
    this.flowEngine.registerModels({ HelloModel });
    // 创建 HelloModel 的实例（仅用于示例）
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
    });
    // 添加路由，将模型渲染到根路径（仅用于示例）
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
// 创建应用实例，注册插件（仅用于示例）
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=on-init.js.map
