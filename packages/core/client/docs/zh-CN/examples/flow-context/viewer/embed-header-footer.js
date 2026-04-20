import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Card, Space } from 'antd';
import React from 'react';
class HelloBlockModel extends FlowModel {
  targetRef = React.createRef();
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        Space,
        null,
        React.createElement(
          Button,
          {
            onClick: () => {
              this.context.viewer.open({
                type: 'embed',
                // width: 800,
                content: (currentView) => {
                  console.log('currentView', currentView);
                  return React.createElement(
                    'div',
                    null,
                    React.createElement(currentView.Header, { title: 'Drawer Header' }),
                    React.createElement('div', null, 'This is a view opened from the flow context.'),
                    React.createElement(
                      currentView.Footer,
                      null,
                      React.createElement(Button, { onClick: currentView.close }, 'Close'),
                    ),
                  );
                },
                target: this.targetRef.current,
              });
            },
          },
          'Open embed1',
        ),
        React.createElement(
          Button,
          {
            onClick: () => {
              this.context.viewer.embed({
                content: 'This is a embed view2.',
                target: this.targetRef.current,
              });
            },
          },
          'Open embed2',
        ),
      ),
      React.createElement(Card, { style: { marginTop: 16 } }, React.createElement('div', { ref: this.targetRef })),
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
//# sourceMappingURL=embed-header-footer.js.map
