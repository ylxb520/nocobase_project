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
      React.createElement(
        Button,
        { type: 'primary', onClick: () => this.dispatchEvent('click') },
        this.constructor.name,
      ),
      React.createElement('div', null, '\u70B9\u51FB: ', count),
      React.createElement('div', null, '\u6D41\u6570\u91CF: ', this.getFlows().size),
    );
  }
}
class MyModel1 extends MyModel {}
class MyModel2 extends MyModel {}
// 注册全局流
MyModel.registerFlow('globalInit', {
  title: '全局初始化',
  steps: {
    init: {
      use: 'initAction',
    },
  },
});
// 插件类
class PluginFlowRegistryDemo extends Plugin {
  async load() {
    // 注册 Actions
    this.flowEngine.registerActions({
      initAction: {
        title: 'Init Action',
        name: 'initAction',
        handler(ctx) {
          ctx.model.setProps('count', 0);
        },
      },
      incrementAction: {
        title: 'Increment Action',
        name: 'incrementAction',
        handler(ctx) {
          const current = ctx.model.props.count || 0;
          ctx.model.setProps('count', current + 1);
          message.success(`+1，当前: ${current + 1}`);
        },
      },
      doubleAction: {
        title: 'Double Action',
        name: 'doubleAction',
        handler(ctx) {
          const current = ctx.model.props.count || 0;
          ctx.model.setProps('count', current + 2);
          message.info(`+2，当前: ${current + 2}`);
        },
      },
    });
    this.flowEngine.registerModels({ MyModel, MyModel1, MyModel2 });
    // Model1 - 点击 +1
    const model1 = this.flowEngine.createModel({
      uid: 'model1',
      use: 'MyModel1',
    });
    model1.registerFlow('clickFlow', {
      title: '点击流',
      on: 'click',
      steps: {
        increment: { use: 'incrementAction' },
      },
    });
    // model2 - 点击 +2
    const model2 = this.flowEngine.createModel({
      uid: 'model2',
      use: 'MyModel2',
    });
    model2.registerFlow('clickFlow', {
      title: '点击流',
      on: 'click',
      steps: {
        double: { use: 'doubleAction' },
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
            '\u5168\u5C40\u6D41\uFF1A\u6240\u6709\u6A21\u578B\u5171\u4EAB\u521D\u59CB\u5316\u6D41\u7A0B',
          ),
          React.createElement(
            'div',
            null,
            '\u5B9E\u4F8B\u6D41\uFF1A\u4E0D\u540C\u6A21\u578B\u6709\u4E0D\u540C\u7684\u70B9\u51FB\u884C\u4E3A',
          ),
          React.createElement(
            Space,
            null,
            React.createElement(FlowModelRenderer, { model: model1 }),
            React.createElement(FlowModelRenderer, { model: model2 }),
          ),
        ),
      ),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginFlowRegistryDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=global-and-instance-flows.js.map
