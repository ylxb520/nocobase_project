import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space } from 'antd';
import React from 'react';
class HelloBlockModel extends FlowModel {
  render() {
    return React.createElement(
      Space,
      { direction: 'vertical' },
      React.createElement(
        Button,
        {
          onClick: async () => {
            await this.context.message.info({
              content: '这是 info 消息。',
            });
          },
        },
        'message.info',
      ),
      React.createElement(
        Button,
        {
          onClick: async () => {
            await this.context.message.success({
              content: '这是 success 消消息。',
            });
          },
        },
        'message.success',
      ),
      React.createElement(
        Button,
        {
          onClick: async () => {
            await this.context.message.error({
              content: '这是 error 消息。',
            });
          },
        },
        'message.error',
      ),
      React.createElement(
        Button,
        {
          onClick: async () => {
            await this.context.message.warning({
              content: '这是 warning 消息。',
            });
          },
        },
        'message.warning',
      ),
      React.createElement(
        Button,
        {
          onClick: async () => {
            await this.context.message.loading({
              content: '这是 loading 消息。',
              duration: 2,
            });
          },
        },
        'message.loading',
      ),
      React.createElement(
        Button,
        {
          onClick: async () => {
            await this.context.message.open({
              type: 'info',
              content: '这是 open 自定义消息。',
            });
          },
        },
        'message.open',
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
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=index.js.map
