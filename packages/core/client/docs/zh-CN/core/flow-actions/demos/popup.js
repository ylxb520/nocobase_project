import { Plugin } from '@nocobase/client';
import { defineFlow, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, ConfigProvider, theme } from 'antd';
import React from 'react';
import { createApp } from './createApp';
class MyPopupModel extends FlowModel {
  render() {
    return React.createElement(
      Button,
      {
        ...this.props,
        onClick: (event) => {
          this.dispatchEvent('onClick', { event });
        },
      },
      '\u70B9\u51FB\u6211',
    );
  }
}
const myEventFlow = defineFlow({
  key: 'myEventFlow',
  on: {
    eventName: 'onClick',
  },
  steps: {
    step1: {
      handler(ctx, params) {
        ctx.drawer.open({
          title: '命令式 Drawer',
          content: React.createElement(
            'div',
            null,
            React.createElement('p', null, '\u8FD9\u662F\u547D\u4EE4\u5F0F\u6253\u5F00\u7684 Drawer1 \u5185\u5BB9'),
            React.createElement(
              Button,
              {
                onClick: () => {
                  ctx.drawer.open({
                    title: '命令式 Drawer',
                    content: React.createElement(
                      'div',
                      null,
                      React.createElement(
                        'p',
                        null,
                        '\u8FD9\u662F\u547D\u4EE4\u5F0F\u6253\u5F00\u7684 Drawer2 \u5185\u5BB9',
                      ),
                    ),
                  });
                },
              },
              'Show',
            ),
          ),
        });
      },
    },
  },
});
MyPopupModel.registerFlow(myEventFlow);
function CustomConfigProvider({ children }) {
  return React.createElement(
    ConfigProvider,
    {
      theme: {
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#52c41a',
        },
      },
    },
    children,
  );
}
class PluginDemo extends Plugin {
  async load() {
    this.flowEngine.registerModels({ MyPopupModel });
    const model = this.flowEngine.createModel({
      use: 'MyPopupModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model, showFlowSettings: true }),
    });
    this.app.providers.unshift([CustomConfigProvider, {}]);
  }
}
export default createApp({ plugins: [PluginDemo] });
//# sourceMappingURL=popup.js.map
