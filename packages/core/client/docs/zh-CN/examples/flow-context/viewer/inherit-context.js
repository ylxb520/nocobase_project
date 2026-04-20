import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer, useFlowContext, useFlowView } from '@nocobase/flow-engine';
import { Button, Space } from 'antd';
import React from 'react';
function DialogContent() {
  const ctx = useFlowContext();
  const currentView = useFlowView();
  return React.createElement(
    'div',
    null,
    React.createElement(currentView.Header, { title: ctx.model ? 'Has model' : 'No model' }),
    React.createElement('div', null, 'This is a view opened from the flow context.'),
    React.createElement(currentView.Footer, null, React.createElement(Button, { onClick: currentView.close }, 'Close')),
  );
}
class HelloBlockModel extends FlowModel {
  render() {
    return React.createElement(
      Space,
      null,
      React.createElement(
        Button,
        {
          onClick: () => {
            this.context.viewer.dialog({
              // width: 800,
              inheritContext: false,
              content: () => React.createElement(DialogContent, null),
              closeOnEsc: true,
            });
          },
        },
        'Open dialog',
      ),
    );
  }
}
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
//# sourceMappingURL=inherit-context.js.map
