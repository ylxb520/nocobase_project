import { Application, Plugin } from '@nocobase/client';
import { defineFlow, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space, Typography } from 'antd';
import React from 'react';
class DemoModel extends FlowModel {
  render() {
    const title = this.props.title || 'Hover me';
    const lastAction = this.props.lastAction || '-';
    return React.createElement(
      'div',
      { style: { padding: 16 } },
      React.createElement(
        Space,
        { direction: 'vertical' },
        React.createElement(
          Typography.Text,
          { type: 'secondary' },
          '\u60AC\u6D6E\u672C\u533A\u57DF\u53F3\u4E0A\u89D2 Flow Settings \u56FE\u6807\uFF0C\u6253\u5F00\u83DC\u5355\uFF0C\u5728 \u201CCommon actions\u201D \u4E2D\u53EF\u770B\u5230\u63D2\u4EF6\u6269\u5C55\u9879\u3002',
        ),
        React.createElement(Button, { type: 'primary' }, title),
        React.createElement(Typography.Text, null, 'lastAction: ', lastAction),
      ),
    );
  }
}
const flow = defineFlow({
  key: 'demo',
  title: 'Demo settings',
  steps: {
    basic: {
      title: 'Basic',
      uiSchema: {
        title: {
          type: 'string',
          title: '按钮标题',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
      handler(ctx, params) {
        ctx.model.setProps('title', params.title);
      },
    },
  },
});
DemoModel.registerFlow(flow);
// 模拟“插件注入”：为指定 Model 类扩展 settings 菜单项
DemoModel.registerExtraMenuItems({
  group: 'common-actions',
  sort: -10,
  items: (model) => [
    {
      key: 'extra-set-last-action',
      label: 'Extra: 记录一次点击',
      onClick: () => {
        model.setProps('lastAction', `clicked at ${new Date().toLocaleTimeString()}`);
      },
    },
    {
      key: 'extra-reset',
      label: 'Extra: 重置标题',
      onClick: () => {
        model.setProps({
          title: 'Hover me',
          lastAction: `reset at ${new Date().toLocaleTimeString()}`,
        });
      },
    },
  ],
});
class PluginDemo extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ DemoModel });
    const model = this.flowEngine.createModel({
      uid: 'demo',
      use: 'DemoModel',
      stepParams: { demo: { basic: { title: 'Hover me' } } },
      props: { title: 'Hover me' },
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, {
        model: model,
        showFlowSettings: { showBorder: true, showBackground: true },
      }),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=index.js.map
