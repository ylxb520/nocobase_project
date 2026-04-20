import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space } from 'antd';
import React from 'react';
class HelloBlockModel extends FlowModel {
  buttonRef1 = React.createRef();
  buttonRef2 = React.createRef();
  render() {
    return React.createElement(
      Space,
      null,
      React.createElement(
        Button,
        {
          onClick: () => {
            this.context.viewer.open({
              type: 'drawer',
              // width: 800,
              content: 'This is a view opened from the flow context.',
              closeOnEsc: true,
            });
          },
        },
        'Open Drawer',
      ),
      React.createElement(
        Button,
        {
          onClick: () => {
            this.context.viewer.drawer({
              // width: 800,
              content: 'This is a view opened from the flow context.',
              closeOnEsc: true,
            });
          },
        },
        'Open Drawer',
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
//# sourceMappingURL=drawer.js.map
