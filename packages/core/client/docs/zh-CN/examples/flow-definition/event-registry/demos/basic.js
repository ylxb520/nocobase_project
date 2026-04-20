import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space, message } from 'antd';
import React from 'react';
// 模型类
class MyModel extends FlowModel {
  render() {
    const eventCount = this.props.eventCount || 0;
    return React.createElement(
      Space,
      null,
      React.createElement(
        Button,
        { type: 'primary', onClick: () => this.dispatchEvent('testEvent') },
        '\u89E6\u53D1\u4E8B\u4EF6',
      ),
      React.createElement('div', null, '\u4E8B\u4EF6\u89E6\u53D1\u6B21\u6570: ', eventCount),
      React.createElement('div', null, '\u5DF2\u6CE8\u518C\u4E8B\u4EF6: ', this.getEvents().size),
    );
  }
}
// 插件类
class PluginEventRegistryDemo extends Plugin {
  async load() {
    // 注册全局 Events
    this.flowEngine.registerEvents({
      testEvent: {
        name: 'testEvent',
        title: '测试事件',
        handler: (ctx, params) => {
          // 事件处理逻辑由流定义中的 handler 处理
        },
      },
      logEvent: {
        name: 'logEvent',
        title: '日志事件',
        handler: (ctx, params) => {
          // 日志事件处理逻辑由流定义中的 handler 处理
        },
      },
    });
    this.flowEngine.registerModels({ MyModel });
    // 创建模型实例
    const model = this.flowEngine.createModel({
      uid: 'my-model',
      use: 'MyModel',
    });
    // 注册流来监听事件
    model.registerFlow('eventHandlerFlow', {
      title: '事件处理流',
      on: 'testEvent',
      steps: {
        step1: {
          title: '更新计数',
          handler(ctx) {
            const current = ctx.model.props.eventCount || 0;
            ctx.model.setProps('eventCount', current + 1);
            message.success(`事件已触发 ${current + 1} 次`);
            // 触发另一个事件
            ctx.model.dispatchEvent('logEvent');
          },
        },
      },
    });
    // 注册另一个流来监听日志事件
    model.registerFlow('logHandlerFlow', {
      title: '日志处理流',
      on: 'logEvent',
      steps: {
        step1: {
          title: '记录日志',
          handler(ctx) {
            console.log('日志事件被触发');
            message.info('查看控制台输出');
          },
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
            '\u57FA\u7840 Event \u793A\u4F8B\uFF1A\u5C55\u793A\u5168\u5C40\u4E8B\u4EF6\u7684\u6CE8\u518C\u548C\u89E6\u53D1',
          ),
          React.createElement(
            'div',
            null,
            '\u70B9\u51FB\u6309\u94AE\u89E6\u53D1\u4E8B\u4EF6\uFF0C\u67E5\u770B\u4E8B\u4EF6\u5904\u7406\u6548\u679C',
          ),
          React.createElement(FlowModelRenderer, { model: model }),
        ),
      ),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginEventRegistryDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=basic.js.map
