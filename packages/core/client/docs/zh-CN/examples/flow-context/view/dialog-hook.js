import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer, useFlowContext } from '@nocobase/flow-engine';
import { Button, Input, Space } from 'antd';
import React from 'react';
function DialogContent() {
  const ctx = useFlowContext();
  const [value, setValue] = React.useState('');
  const { Header, Footer } = ctx.view;
  return React.createElement(
    'div',
    null,
    React.createElement(Header, { title: `Dialog Header - #${ctx.model.uid}` }),
    React.createElement('div', null, 'This is a view opened from the flow context.'),
    React.createElement('div', null, value),
    React.createElement(Input, {
      defaultValue: value,
      onChange: (e) => {
        setValue(e.target.value);
      },
    }),
    React.createElement(Footer, null, React.createElement(Button, { onClick: () => ctx.view.close() }, 'Close')),
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
              content: React.createElement(DialogContent, null),
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
//# sourceMappingURL=dialog-hook.js.map
