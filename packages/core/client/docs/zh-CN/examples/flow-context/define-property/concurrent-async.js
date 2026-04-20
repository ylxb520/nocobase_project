import { observable } from '@formily/reactive';
import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Card } from 'antd';
import React from 'react';
class AsyncValueModel extends FlowModel {
  concurrent;
  callCount = observable.ref(0);
  onInit() {
    this.context.defineProperty('concurrent', {
      get: async () => {
        this.callCount.value++;
        await new Promise((resolve) => setTimeout(resolve, 500));
        return `异步结果-${uid()}`;
      },
    });
  }
  async onDispatchEventStart(eventName) {
    if (eventName === 'beforeRender') {
      await Promise.all([this.context.concurrent, this.context.concurrent, this.context.concurrent]);
      this.concurrent = await this.context.concurrent;
    }
  }
  render() {
    return React.createElement(
      Card,
      { title: '\u5F02\u6B65\u5C5E\u6027 concurrent \u793A\u4F8B', style: { width: 400 } },
      React.createElement(
        'div',
        { style: { marginTop: 8 } },
        React.createElement('div', null, 'concurrent: ', this.concurrent),
        React.createElement('div', null, '\u8C03\u7528\u6B21\u6570: ', this.callCount.value),
      ),
    );
  }
}
AsyncValueModel.registerFlow({
  key: 'examples',
  steps: {},
});
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ AsyncValueModel });
    const model = this.flowEngine.createModel({
      use: 'AsyncValueModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=concurrent-async.js.map
