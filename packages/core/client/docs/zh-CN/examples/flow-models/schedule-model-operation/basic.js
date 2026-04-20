/**
 * defaultShowCode: true
 * title: scheduleModelOperation 基本用法
 */
import { Application, Plugin } from '@nocobase/client';
import { defineFlow, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space, Typography, notification } from 'antd';
import React from 'react';
const EVENT_NAME = 'go';
const notify = (title, description) => {
  notification.info({
    message: title,
    description,
  });
};
class ScheduleModelOperationDemoModel extends FlowModel {
  /**
   * 在指定 when 锚点插入一个回调：
   * - 弹出 notification
   * 然后触发一次事件（goFlow 会作为事件链的一部分执行）
   */
  async insertAndTrigger(label, when) {
    notify('scheduleModelOperation: registered', `${label} — ${when}`);
    const cancel = this.scheduleModelOperation(
      this.uid,
      async () => {
        notify('scheduleModelOperation: hit', `${label} — ${when}`);
      },
      { when: when },
    );
    try {
      await this.dispatchEvent(EVENT_NAME);
    } finally {
      // 若锚点没有命中（例如 flowKey/stepKey 不存在），避免调度残留到后续事件
      cancel();
    }
  }
  render() {
    const whenOptions = [
      { label: 'beforeAllFlows（event start）', when: `event:${EVENT_NAME}:start` },
      { label: 'afterAllFlows（event end）', when: `event:${EVENT_NAME}:end` },
      { label: `beforeFlow（goFlow start）`, when: `event:${EVENT_NAME}:flow:goFlow:start` },
      { label: `afterFlow（goFlow end）`, when: `event:${EVENT_NAME}:flow:goFlow:end` },
      {
        label: `beforeStep（goFlow.step1 start）`,
        when: `event:${EVENT_NAME}:flow:goFlow:step:step1:start`,
      },
      {
        label: `afterStep（goFlow.step1 end）`,
        when: `event:${EVENT_NAME}:flow:goFlow:step:step1:end`,
      },
    ];
    return React.createElement(
      'div',
      { style: { padding: 16 } },
      React.createElement(
        Typography.Title,
        { level: 4 },
        'scheduleModelOperation\uFF1A\u63D2\u5165\u56DE\u8C03 + \u89E6\u53D1 Flow',
      ),
      React.createElement(
        Typography.Paragraph,
        null,
        '\u70B9\u51FB\u4E0D\u540C\u6309\u94AE\uFF0C\u4F1A\u628A\u4E00\u4E2A\u56DE\u8C03\u63D2\u5165\u5230\u4E8B\u4EF6 ',
        React.createElement('code', null, EVENT_NAME),
        ' \u7684\u4E0D\u540C\u951A\u70B9\uFF08\u5BF9\u5E94\u4E8B\u4EF6\u6D41\u7F16\u8F91\u5668\u91CC\u7684',
        ' ',
        React.createElement('code', null, 'phase'),
        ' \u9009\u9879\uFF09\uFF1B\u7136\u540E\u89E6\u53D1\u4E00\u6B21 ',
        React.createElement('code', null, "dispatchEvent('", EVENT_NAME, "')"),
        '\uFF0C\u4F60\u4F1A\u770B\u5230\u56DE\u8C03\u5728\u4E0D\u540C\u4F4D\u7F6E\u547D\u4E2D\u3002',
      ),
      React.createElement(
        Space,
        { wrap: true },
        whenOptions.map(({ label, when }, index) =>
          React.createElement(Button, { key: when, onClick: () => void this.insertAndTrigger(label, when) }, label),
        ),
      ),
    );
  }
}
// 事件链上的一个 flow（作为锚点来源：flowKey=goFlow，stepKey=step1/step2）
ScheduleModelOperationDemoModel.registerFlow(
  defineFlow({
    key: 'goFlow',
    on: { eventName: EVENT_NAME },
    steps: {
      step1: {
        handler: async () => {
          notify('goFlow.step1');
        },
      },
      step2: {
        handler: async () => {
          notify('goFlow.step2');
        },
      },
    },
  }),
);
class PluginScheduleModelOperationDemo extends Plugin {
  async load() {
    this.flowEngine.registerModels({ ScheduleModelOperationDemoModel });
    const model = this.flowEngine.createModel({ use: 'ScheduleModelOperationDemoModel' });
    this.router.add('root', { path: '/', element: React.createElement(FlowModelRenderer, { model: model }) });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginScheduleModelOperationDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=basic.js.map
