/**
 * defaultShowCode: true
 * title: 静态流的 on.phase（事件流顺序）
 */
import { Button, Space, Typography } from 'antd';
import { define, observable } from '@formily/reactive';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import React from 'react';
const stepLog = (label) => ({
  handler: async (ctx) => {
    ctx.model.appendLog(label);
  },
});
class PhaseDemoModel extends FlowModel {
  logs = [];
  constructor(options) {
    super(options);
    define(this, {
      logs: observable.shallow,
    });
  }
  clearLogs() {
    this.logs.splice(0, this.logs.length);
  }
  appendLog(line) {
    this.logs.push(line);
  }
  render() {
    return React.createElement(
      'div',
      { style: { padding: 16 } },
      React.createElement(
        Typography.Title,
        { level: 4 },
        '\u9759\u6001\u6D41\u4E5F\u652F\u6301 on.phase \u987A\u5E8F\u6307\u5B9A',
      ),
      React.createElement(
        Typography.Paragraph,
        null,
        '\u8BE5\u793A\u4F8B\u5168\u90E8\u4F7F\u7528 ',
        React.createElement('code', null, 'Model.registerFlow'),
        ' \u6CE8\u518C\u5185\u7F6E\u9759\u6001\u6D41\uFF0C\u5E76\u901A\u8FC7 ',
        React.createElement('code', null, 'on.phase'),
        ' \u5C55\u793A\u4E8B\u4EF6\u6D41\u7F16\u8F91\u5668\u91CC\u7684 \u300C\u6267\u884C\u65F6\u673A\u300D\u9009\u9879\uFF08before/after flow\u3001before/after step\u3001after all flows\uFF09\u3002',
      ),
      React.createElement(
        Space,
        null,
        React.createElement(
          Button,
          {
            type: 'primary',
            onClick: async () => {
              this.clearLogs();
              await this.dispatchEvent('go');
            },
          },
          '\u89E6\u53D1 go',
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
// 作为“锚点”的内置静态流（没有 phase，按 sort 顺序正常执行）
PhaseDemoModel.registerFlow({
  key: 'staticBase',
  sort: 10,
  on: { eventName: 'go' },
  steps: {
    step1: stepLog('staticBase.step1'),
    step2: stepLog('staticBase.step2'),
  },
});
PhaseDemoModel.registerFlow({
  key: 'staticOther',
  sort: 20,
  on: { eventName: 'go' },
  steps: {
    step: stepLog('staticOther.step'),
  },
});
// 默认（phase 未配置）：保持原有顺序（按 sort）执行
PhaseDemoModel.registerFlow({
  key: 'phaseDefault',
  sort: 5,
  on: { eventName: 'go' },
  steps: {
    p: stepLog('phaseDefault (phase undefined / default)'),
  },
});
// phase = beforeFlow：在指定静态流开始前执行
PhaseDemoModel.registerFlow({
  key: 'phaseBeforeFlow',
  sort: 0,
  on: { eventName: 'go', phase: 'beforeFlow', flowKey: 'staticBase' },
  steps: {
    p: stepLog('phaseBeforeFlow (before staticBase)'),
  },
});
// phase = afterFlow：在指定静态流结束后执行
PhaseDemoModel.registerFlow({
  key: 'phaseAfterFlow',
  sort: 0,
  on: { eventName: 'go', phase: 'afterFlow', flowKey: 'staticBase' },
  steps: {
    p: stepLog('phaseAfterFlow (after staticBase)'),
  },
});
// phase = afterStep：在指定 step 结束后执行
PhaseDemoModel.registerFlow({
  key: 'phaseAfterStep',
  sort: 0,
  on: { eventName: 'go', phase: 'afterStep', flowKey: 'staticBase', stepKey: 'step1' },
  steps: {
    p: stepLog('phaseAfterStep (after staticBase.step1)'),
  },
});
// phase = beforeStep：在指定 step 开始前执行
PhaseDemoModel.registerFlow({
  key: 'phaseBeforeStep',
  sort: 0,
  on: { eventName: 'go', phase: 'beforeStep', flowKey: 'staticBase', stepKey: 'step2' },
  steps: {
    p: stepLog('phaseBeforeStep (before staticBase.step2)'),
  },
});
// phase = afterAllFlows：在事件结束后执行
PhaseDemoModel.registerFlow({
  key: 'phaseAfterAllFlows',
  sort: 0,
  on: { eventName: 'go', phase: 'afterAllFlows' },
  steps: {
    p: stepLog('phaseAfterAllFlows (after event end)'),
  },
});
class PluginPhaseDemo extends Plugin {
  async load() {
    this.flowEngine.registerModels({ PhaseDemoModel });
    const model = this.flowEngine.createModel({
      use: 'PhaseDemoModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginPhaseDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=static-flow-phase.js.map
