// uiSchema 通过字符串引用组件，示例无需直接导入控件
import { Application, Plugin } from '@nocobase/client';
import { defineFlow, FlowModel } from '@nocobase/flow-engine';
import { Button } from 'antd';
import React from 'react';
class MyModel extends FlowModel {}
const flowA = defineFlow({
  key: 'A',
  title: 'Flow A',
  steps: {
    s: {
      title: 'A 配置',
      uiSchema: { a: { type: 'string', title: 'A', 'x-decorator': 'FormItem', 'x-component': 'Input' } },
    },
  },
});
const flowB = defineFlow({
  key: 'B',
  title: 'Flow B',
  steps: {
    s: {
      title: 'B 配置',
      uiSchema: { b: { type: 'string', title: 'B', 'x-decorator': 'FormItem', 'x-component': 'Input' } },
    },
  },
});
MyModel.registerFlow(flowA);
MyModel.registerFlow(flowB);
function Page({ model }) {
  return React.createElement(
    Button,
    { onClick: () => model.openFlowSettings({ flowKey: 'A', flowKeys: ['A', 'B'] }) },
    '\u540C\u65F6\u4F20\u5165 flowKey \u4E0E flowKeys\uFF08\u4EE5 flowKey \u4E3A\u51C6\uFF09',
  );
}
class PluginHello extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ MyModel });
    const model = this.flowEngine.createModel({ uid: 'm5', use: 'MyModel' });
    this.router.add('root', { path: '/', element: React.createElement(Page, { model: model }) });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHello],
});
export default app.getRootComponent();
//# sourceMappingURL=priority-flowKey-over-flowKeys.js.map
