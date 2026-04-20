/**
 * defaultShowCode: true
 * title: scheduleModelOperation({ when })（锚点字符串）
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
class WhenDemoModel extends FlowModel {
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
  async runOnce() {
    this.clearLogs();
    // 这些 when 锚点字符串和「事件流编辑器」里的选项是一一对应的
    const cancels = [
      this.scheduleModelOperation(this.uid, (m) => m.appendLog('when=event:go:flow:staticBase:start'), {
        when: 'event:go:flow:staticBase:start',
      }),
      this.scheduleModelOperation(this.uid, (m) => m.appendLog('when=event:go:flow:staticBase:step:step1:end'), {
        when: 'event:go:flow:staticBase:step:step1:end',
      }),
      this.scheduleModelOperation(this.uid, (m) => m.appendLog('when=event:go:flow:staticBase:step:step2:start'), {
        when: 'event:go:flow:staticBase:step:step2:start',
      }),
      this.scheduleModelOperation(this.uid, (m) => m.appendLog('when=event:go:flow:staticBase:end'), {
        when: 'event:go:flow:staticBase:end',
      }),
      this.scheduleModelOperation(this.uid, (m) => m.appendLog('when=event:go:end'), {
        when: 'event:go:end',
      }),
    ];
    try {
      await this.dispatchEvent('go');
    } finally {
      // 避免锚点不存在时，调度残留到后续事件
      cancels.forEach((cancel) => cancel());
    }
  }
  render() {
    return React.createElement(
      'div',
      { style: { padding: 16 } },
      React.createElement(
        Typography.Title,
        { level: 4 },
        '\u76F4\u63A5\u7528 scheduleModelOperation \u6307\u5B9A\u951A\u70B9',
      ),
      React.createElement(
        Typography.Paragraph,
        null,
        React.createElement('code', null, 'scheduleModelOperation(toUid, fn, ', '{ when }', ')'),
        ' \u7684 ',
        React.createElement('code', null, 'when'),
        ' \u652F\u6301\u4E8B\u4EF6\u5F00\u59CB/\u7ED3\u675F\u3001\u4EE5\u53CA\u9759\u6001\u6D41\u4E0E\u6B65\u9AA4\u7684 start/end/error \u951A\u70B9\u3002\u672C\u793A\u4F8B\u5C55\u793A\u4E86\u4E0E\u4E8B\u4EF6\u6D41\u7F16\u8F91\u5668\u9009\u9879\u5BF9\u5E94\u7684\u51E0\u79CD\u5E38\u7528\u951A\u70B9\u3002',
      ),
      React.createElement(
        Space,
        null,
        React.createElement(
          Button,
          { type: 'primary', onClick: () => void this.runOnce() },
          '\u89E6\u53D1 go\uFF08\u5E76\u6CE8\u518C\u8C03\u5EA6\uFF09',
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
// 内置静态流（锚点来源）
WhenDemoModel.registerFlow({
  key: 'staticBase',
  sort: 10,
  on: { eventName: 'go' },
  steps: {
    step1: stepLog('staticBase.step1'),
    step2: stepLog('staticBase.step2'),
  },
});
WhenDemoModel.registerFlow({
  key: 'staticOther',
  sort: 20,
  on: { eventName: 'go' },
  steps: {
    step: stepLog('staticOther.step'),
  },
});
class PluginWhenDemo extends Plugin {
  async load() {
    this.flowEngine.registerModels({ WhenDemoModel });
    const model = this.flowEngine.createModel({
      use: 'WhenDemoModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginWhenDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=schedule-when.js.map
