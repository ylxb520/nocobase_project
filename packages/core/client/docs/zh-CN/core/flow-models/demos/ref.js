import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer, FlowsSettings } from '@nocobase/flow-engine';
import { Card } from 'antd';
import React, { createRef } from 'react';
function waitForRefCallback(ref, cb, timeout = 3000) {
  const start = Date.now();
  function check() {
    if (ref.current) return cb(ref.current);
    if (Date.now() - start > timeout) return;
    setTimeout(check, 30);
  }
  check();
}
class RefFlowModel extends FlowModel {
  ref = createRef();
  render() {
    return React.createElement(Card, null, React.createElement('div', { ref: this.ref }));
  }
}
RefFlowModel.registerFlow('defaultFlow', {
  steps: {
    step1: {
      uiSchema: {
        html: {
          type: 'string',
          title: 'HTML 内容',
          'x-component': 'Input.TextArea',
          'x-component-props': {
            autoSize: true,
          },
        },
      },
      async handler(ctx, params) {
        waitForRefCallback(ctx.model.ref, (el) => {
          el.innerHTML = params.html;
        });
      },
    },
  },
});
// 插件定义
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.registerModels({ RefFlowModel });
    const model = this.flowEngine.createModel({
      use: 'RefFlowModel',
      stepParams: {
        defaultFlow: {
          step1: {
            html: `<h1>Hello, NocoBase!</h1>
<p>This is a simple HTML content rendered by FlowModel.</p>`,
          },
        },
      },
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        'div',
        null,
        React.createElement(FlowModelRenderer, { model: model }),
        React.createElement('br', null),
        React.createElement(FlowsSettings, { model: model }),
      ),
    });
  }
}
// 创建应用实例
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=ref.js.map
