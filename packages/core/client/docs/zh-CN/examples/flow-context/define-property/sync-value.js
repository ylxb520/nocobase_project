import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Card } from 'antd';
import React from 'react';
class SyncValueModel extends FlowModel {
  onInit() {
    this.context.defineProperty('syncValue', {
      get() {
        return `同步结果-${uid()}`;
      },
    });
  }
  render() {
    return React.createElement(
      Card,
      { title: '\u540C\u6B65\u5C5E\u6027 syncValue \u793A\u4F8B', style: { width: 400 } },
      React.createElement(
        'div',
        { style: { marginTop: 8 } },
        React.createElement('div', null, 'syncValue: ', this.context.syncValue),
      ),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ SyncValueModel });
    const model = this.flowEngine.createModel({
      use: 'SyncValueModel',
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
//# sourceMappingURL=sync-value.js.map
