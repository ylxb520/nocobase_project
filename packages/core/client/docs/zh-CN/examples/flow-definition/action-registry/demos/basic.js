import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space, message } from 'antd';
import React from 'react';
// 模型类
class MyModel extends FlowModel {
  render() {
    const count = this.props.count || 0;
    return React.createElement(
      Space,
      null,
      React.createElement(Button, { type: 'primary', onClick: () => this.applyFlow('testFlow') }, '\u6267\u884C\u6D41'),
      React.createElement('div', null, '\u8BA1\u6570: ', count),
      React.createElement('div', null, 'Actions: ', this.getActions().size),
    );
  }
}
// 插件类
class PluginActionRegistryDemo extends Plugin {
  async load() {
    // 注册全局 Actions
    this.flowEngine.registerActions({
      incrementAction: {
        name: 'incrementAction',
        title: '递增动作',
        handler(ctx) {
          const current = ctx.model.props.count || 0;
          ctx.model.setProps('count', current + 1);
          message.success(`计数已递增: ${current + 1}`);
        },
      },
      logAction: {
        name: 'logAction',
        title: '日志动作',
        handler(ctx) {
          console.log('Action executed!');
          message.info('查看控制台输出');
        },
      },
    });
    this.flowEngine.registerModels({ MyModel });
    // 创建模型实例
    const model = this.flowEngine.createModel({
      uid: 'my-model',
      use: 'MyModel',
    });
    // 注册流，使用全局 actions
    model.registerFlow('testFlow', {
      title: '测试流',
      steps: {
        step1: {
          title: '步骤1: 递增',
          use: 'incrementAction', // 使用全局 action
        },
        step2: {
          title: '步骤2: 日志',
          use: 'logAction', // 使用全局 action
        },
      },
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Space,
          { direction: 'vertical' },
          React.createElement(
            'div',
            null,
            '\u57FA\u7840 Action \u793A\u4F8B\uFF1A\u6D41\u4F7F\u7528\u5168\u5C40\u6CE8\u518C\u7684 actions',
          ),
          React.createElement(
            'div',
            null,
            '\u70B9\u51FB\u6309\u94AE\u6267\u884C\u5305\u542B\u4E24\u4E2A\u6B65\u9AA4\u7684\u6D41\u7A0B',
          ),
          React.createElement(FlowModelRenderer, { model: model }),
        ),
      ),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginActionRegistryDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=basic.js.map
