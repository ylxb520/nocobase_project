import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import React from 'react';
class HelloModel extends FlowModel {
  onInit() {
    this.context.defineProperty('noCache', {
      get: () => uid(),
      cache: false, // 不缓存
    });
  }
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement('h4', null, '\u4E0D\u5E26\u7F13\u5B58\u7684\u5C5E\u6027\uFF08noCache\uFF09'),
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.noCache),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.noCache),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloModel });
    const model = this.flowEngine.createModel({ use: 'HelloModel' });
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
//# sourceMappingURL=no-cache.js.map
