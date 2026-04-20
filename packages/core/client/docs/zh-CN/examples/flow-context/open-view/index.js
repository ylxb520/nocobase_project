/**
 * defaultShowCode: true
 * title: 最小示例
 */
import { Application, Plugin, PluginFlowEngine, MockFlowModelRepository } from '@nocobase/client';
import { FlowModel, FlowModelRenderer, FlowContextSelector, useFlowContext, useFlowView } from '@nocobase/flow-engine';
import { Button, Card, Space } from 'antd';
import React from 'react';
class OpenViewDemoModel extends FlowModel {
  render() {
    return React.createElement(
      Card,
      { title: 'ctx.openView\uFF1A\u6253\u5F00\u5B50\u9875\u9762' },
      React.createElement(
        Space,
        null,
        React.createElement(
          Button,
          {
            onClick: () =>
              this.context.openView('demo-open-view', {
                mode: 'drawer',
                size: 'medium',
                pageModelClass: 'OpenViewContentModel',
                navigation: false,
                defineProperties: {
                  someContext: {
                    value: { name: '演示数据', email: 'demo@example.com' },
                    meta: {
                      title: '新定义上下文',
                      type: 'object',
                      properties: {
                        name: { title: '名称', type: 'string' },
                        email: { title: '邮箱', type: 'string' },
                      },
                    },
                  },
                },
              }),
          },
          '\u6253\u5F00\u62BD\u5C49',
        ),
      ),
    );
  }
}
// 子页面内容模型：在弹窗/抽屉内展示 FlowContextSelector
class OpenViewContentModel extends FlowModel {
  render() {
    return React.createElement(OpenViewContent, null);
  }
}
const OpenViewContent = () => {
  const ctx = useFlowContext();
  const view = useFlowView();
  const [value, setValue] = React.useState('');
  return React.createElement(
    'div',
    { style: { padding: 24 } },
    React.createElement(view.Header, { title: `新定义上下文` }),
    React.createElement(
      Space,
      { direction: 'vertical', style: { width: '100%' } },
      React.createElement(
        FlowContextSelector,
        {
          value: value,
          onChange: (val) => setValue(val),
          metaTree: () => ctx.getPropertyMetaTree(),
          style: { width: 360 },
          showSearch: true,
        },
        React.createElement(Button, { type: 'primary' }, '\u9009\u62E9\u4E0A\u4E0B\u6587\u53D8\u91CF'),
      ),
    ),
  );
};
class PluginDemo extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ OpenViewDemoModel, OpenViewContentModel });
    // 使用本地 Mock 仓库，避免依赖后端接口，并清理旧数据避免历史配置干扰
    const repo = new MockFlowModelRepository('demo-open-view:');
    await repo.clear();
    this.flowEngine.setModelRepository(repo);
    const model = this.flowEngine.createModel({ use: 'OpenViewDemoModel' });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginFlowEngine, PluginDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=index.js.map
