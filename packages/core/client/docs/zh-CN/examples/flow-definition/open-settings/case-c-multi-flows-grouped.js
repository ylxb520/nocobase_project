// uiSchema 通过字符串引用组件，示例无需直接导入控件
import { Application, Plugin } from '@nocobase/client';
import { defineFlow, FlowModel } from '@nocobase/flow-engine';
import { Button, Space } from 'antd';
import React from 'react';
class MyModel extends FlowModel {
  render() {
    return React.createElement(Space, null);
  }
}
const flowA = defineFlow({
  key: 'flowA',
  title: 'Flow A',
  steps: {
    s1: {
      title: 'A-配置',
      uiSchema: {
        a: { type: 'string', title: 'A 值', 'x-decorator': 'FormItem', 'x-component': 'Input' },
      },
      handler(ctx, p) {
        ctx.model.setProps('a', p.a);
      },
    },
    s2: {
      title: 'B-配置',
      uiSchema: {
        b: { type: 'string', title: 'B 值', 'x-decorator': 'FormItem', 'x-component': 'Input' },
      },
      handler(ctx, p) {
        ctx.model.setProps('b', p.b);
      },
    },
  },
});
const flowB = defineFlow({
  key: 'flowB',
  title: 'Flow B（只有一个 step）',
  steps: {
    s1: {
      title: 'B-配置',
      uiSchema: {
        b: { type: 'string', title: 'B 值', 'x-decorator': 'FormItem', 'x-component': 'Input' },
      },
      handler(ctx, p) {
        ctx.model.setProps('b', p.b);
      },
    },
  },
});
MyModel.registerFlow(flowA);
MyModel.registerFlow(flowB);
function Page({ model }) {
  return React.createElement(
    Button,
    { onClick: () => model.openFlowSettings({ flowKeys: ['flowA', 'flowB'] }) },
    '\u6253\u5F00\u591A\u4E2A Flow \u5206\u7EC4',
  );
}
class PluginHello extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ MyModel });
    const model = this.flowEngine.createModel({ uid: 'm3', use: 'MyModel' });
    this.router.add('root', { path: '/', element: React.createElement(Page, { model: model }) });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHello],
});
export default app.getRootComponent();
//# sourceMappingURL=case-c-multi-flows-grouped.js.map
