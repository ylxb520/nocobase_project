import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button } from 'antd';
import React from 'react';
class HelloModel extends FlowModel {
  onInit() {
    this.context.defineProperty('cached', {
      get: () => uid(),
      // 默认 cache: true
    });
  }
  render() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    return React.createElement(
      'div',
      null,
      React.createElement('h4', null, '\u5E26\u7F13\u5B58\u7684\u5C5E\u6027\uFF08cached\uFF09'),
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.cached),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.cached),
      React.createElement(
        Button,
        {
          onClick: () => {
            this.context.removeCache('cached');
            forceUpdate();
          },
        },
        '\u6E05\u9664 cached \u7F13\u5B58\u5E76\u5237\u65B0',
      ),
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
//# sourceMappingURL=remove-cache.js.map
