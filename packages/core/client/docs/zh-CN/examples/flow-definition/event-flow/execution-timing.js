/**
 * defaultShowCode: true
 * title: on.phase（执行时机）
 */
import { Application, Plugin } from '@nocobase/client';
import { defineFlow, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space, Typography } from 'antd';
import React from 'react';
const EVENT_NAME = 'go';
const stepLog = (label) => ({
  handler: async (ctx) => {
    ctx.model.appendLog(label);
  },
});
class ExecutionTimingDemoModel extends FlowModel {
  get logs() {
    const v = this.props?.logs;
    return Array.isArray(v) ? v : [];
  }
  clearLogs() {
    this.setProps({ logs: [] });
  }
  appendLog(line) {
    this.setProps({ logs: [...this.logs, line] });
  }
  async runOnce() {
    this.clearLogs();
    await this.dispatchEvent(EVENT_NAME);
  }
  render() {
    return React.createElement(
      'div',
      { style: { padding: 16 } },
      React.createElement(
        Typography.Title,
        { level: 4 },
        '\u4E8B\u4EF6\u6D41\u6267\u884C\u65F6\u673A\uFF1Aon.phase / flowKey / stepKey',
      ),
      React.createElement(
        Typography.Paragraph,
        null,
        React.createElement('code', null, 'flow.on'),
        ' \u9664\u4E86\u58F0\u660E ',
        React.createElement('code', null, 'eventName'),
        ' \u5916\uFF0C\u8FD8\u652F\u6301\u7528 ',
        React.createElement('code', null, 'phase'),
        ' \u628A\u67D0\u4E2A flow \u63D2\u5165\u5230 \u5176\u5B83 flow \u7684\u6307\u5B9A\u9636\u6BB5\u6267\u884C\u3002',
      ),
      React.createElement(
        Space,
        null,
        React.createElement(
          Button,
          { type: 'primary', onClick: () => void this.runOnce() },
          '\u89E6\u53D1 ',
          EVENT_NAME,
        ),
        React.createElement(Button, { onClick: () => this.clearLogs() }, '\u6E05\u7A7A'),
      ),
      React.createElement(
        'pre',
        {
          style: {
            marginTop: 12,
            padding: 12,
            borderRadius: 6,
            background: '#111',
            color: '#0f0',
            minHeight: 180,
            whiteSpace: 'pre-wrap',
          },
        },
        this.logs.length ? this.logs.join('\n') : '（暂无日志）',
      ),
    );
  }
}
// 作为“锚点”的内置静态流
ExecutionTimingDemoModel.registerFlow(
  defineFlow({
    key: 'staticBase',
    sort: 10,
    on: { eventName: EVENT_NAME },
    steps: {
      step1: stepLog('staticBase.step1'),
      step2: stepLog('staticBase.step2'),
    },
  }),
);
ExecutionTimingDemoModel.registerFlow(
  defineFlow({
    key: 'staticOther',
    sort: 20,
    on: { eventName: EVENT_NAME },
    steps: {
      step: stepLog('staticOther.step'),
    },
  }),
);
// 默认（phase 未配置）：保持原有顺序（按 sort）执行
ExecutionTimingDemoModel.registerFlow(
  defineFlow({
    key: 'phaseDefault',
    sort: 5,
    on: { eventName: EVENT_NAME },
    steps: {
      p: stepLog('phaseDefault (phase undefined / default)'),
    },
  }),
);
// phase = beforeFlow：在指定静态流开始前执行
ExecutionTimingDemoModel.registerFlow(
  defineFlow({
    key: 'phaseBeforeFlow',
    sort: 0,
    on: { eventName: EVENT_NAME, phase: 'beforeFlow', flowKey: 'staticBase' },
    steps: {
      p: stepLog('phaseBeforeFlow (before staticBase)'),
    },
  }),
);
// phase = afterFlow：在指定静态流结束后执行
ExecutionTimingDemoModel.registerFlow(
  defineFlow({
    key: 'phaseAfterFlow',
    sort: 0,
    on: { eventName: EVENT_NAME, phase: 'afterFlow', flowKey: 'staticBase' },
    steps: {
      p: stepLog('phaseAfterFlow (after staticBase)'),
    },
  }),
);
// phase = afterStep：在指定 step 结束后执行
ExecutionTimingDemoModel.registerFlow(
  defineFlow({
    key: 'phaseAfterStep',
    sort: 0,
    on: { eventName: EVENT_NAME, phase: 'afterStep', flowKey: 'staticBase', stepKey: 'step1' },
    steps: {
      p: stepLog('phaseAfterStep (after staticBase.step1)'),
    },
  }),
);
// phase = beforeStep：在指定 step 开始前执行
ExecutionTimingDemoModel.registerFlow(
  defineFlow({
    key: 'phaseBeforeStep',
    sort: 0,
    on: { eventName: EVENT_NAME, phase: 'beforeStep', flowKey: 'staticBase', stepKey: 'step2' },
    steps: {
      p: stepLog('phaseBeforeStep (before staticBase.step2)'),
    },
  }),
);
// phase = afterAllFlows：在事件结束后执行
ExecutionTimingDemoModel.registerFlow(
  defineFlow({
    key: 'phaseAfterAllFlows',
    sort: 0,
    on: { eventName: EVENT_NAME, phase: 'afterAllFlows' },
    steps: {
      p: stepLog('phaseAfterAllFlows (after event end)'),
    },
  }),
);
class PluginExecutionTimingDemo extends Plugin {
  async load() {
    this.flowEngine.registerModels({ ExecutionTimingDemoModel });
    const model = this.flowEngine.createModel({ use: 'ExecutionTimingDemoModel' });
    this.router.add('root', { path: '/', element: React.createElement(FlowModelRenderer, { model: model }) });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginExecutionTimingDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=execution-timing.js.map
