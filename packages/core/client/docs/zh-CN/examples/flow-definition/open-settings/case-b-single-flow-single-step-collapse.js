// uiSchema 中通过字符串引用组件，示例无需直接导入控件
import { Application, Plugin } from '@nocobase/client';
import { defineFlow, FlowModel } from '@nocobase/flow-engine';
import { Button } from 'antd';
import React from 'react';
class MyModel extends FlowModel {
  render() {
    return React.createElement(Button, { ...this.props });
  }
}
const flow = defineFlow({
  key: 'button',
  title: '按钮设置',
  steps: {
    only: {
      title: '唯一步骤',
      uiSchema: {
        title: {
          type: 'string',
          title: '按钮标题',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
      handler(ctx, params) {
        ctx.model.setProps('children', params.title);
      },
    },
  },
});
MyModel.registerFlow(flow);
class PluginHello extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ MyModel });
    const model = this.flowEngine.createModel({ uid: 'm2', use: 'MyModel' });
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        Button,
        { onClick: () => model.openFlowSettings({ flowKey: 'button' }) },
        '\u6253\u5F00\u5355 Flow',
      ),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHello],
});
export default app.getRootComponent();
//# sourceMappingURL=case-b-single-flow-single-step-collapse.js.map
