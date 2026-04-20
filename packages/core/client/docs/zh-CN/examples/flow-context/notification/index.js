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
          onClick: () => {
            this.context.notification.info({
              message: 'Info',
              description: '这是 info 通知。',
              onClick: () => {
                console.log('点击了 info 通知');
              },
            });
          },
        },
        'notification.info',
      ),
      React.createElement(
        Button,
        {
          onClick: () => {
            this.context.notification.success({
              message: 'Success',
              description: '这是 success 通知。',
              duration: 2,
            });
          },
        },
        'notification.success',
      ),
      React.createElement(
        Button,
        {
          onClick: () => {
            this.context.notification.error({
              message: 'Error',
              description: '这是 error 通知。',
              placement: 'top',
            });
          },
        },
        'notification.error',
      ),
      React.createElement(
        Button,
        {
          onClick: () => {
            this.context.notification.warning({
              message: 'Warning',
              description: '这是 warning 通知。',
              key: 'warning-key',
              onClose: () => {
                console.log('warning 通知关闭');
              },
            });
          },
        },
        'notification.warning',
      ),
      React.createElement(
        Button,
        {
          onClick: () => {
            this.context.notification.open({
              message: 'Open',
              description: '这是 open 自定义通知。',
              type: 'info',
              actions: React.createElement(
                Button,
                { size: 'small', onClick: () => alert('自定义操作') },
                '\u64CD\u4F5C',
              ),
            });
          },
        },
        'notification.open',
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
