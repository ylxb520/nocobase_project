import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Card, Space } from 'antd';
import React from 'react';
// 带 once 的属性
class OnceModel extends FlowModel {
  onInit() {
    this.context.defineProperty('once', {
      get: () => `1-${uid()}`,
      once: true,
    });
    // 这次不会生效
    this.context.defineProperty('once', {
      get: () => `2-${uid()}`,
    });
  }
  render() {
    return React.createElement(
      Card,
      { title: '\u5E26 once \u7684\u5C5E\u6027\uFF08\u4EC5\u9996\u6B21\u5B9A\u4E49\u751F\u6548\uFF09' },
      React.createElement(
        'div',
        { style: { marginBottom: 8, color: '#888' } },
        '\u53EA\u4F1A\u91C7\u7528\u7B2C\u4E00\u6B21 defineProperty \u7684\u5B9A\u4E49\uFF0C\u540E\u7EED\u4E0D\u4F1A\u8986\u76D6',
      ),
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.once),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.once),
    );
  }
}
// 不带 once 的属性
class NoOnceModel extends FlowModel {
  onInit() {
    this.context.defineProperty('noonce', {
      get: () => `3-${uid()}`,
    });
    // 这次会生效，覆盖上面的定义
    this.context.defineProperty('noonce', {
      get: () => `4-${uid()}`,
    });
  }
  render() {
    return React.createElement(
      Card,
      { title: '\u4E0D\u5E26 once \u7684\u5C5E\u6027\uFF08\u6BCF\u6B21\u5B9A\u4E49\u90FD\u4F1A\u8986\u76D6\uFF09' },
      React.createElement(
        'div',
        { style: { marginBottom: 8, color: '#888' } },
        '\u540E\u5B9A\u4E49\u4F1A\u8986\u76D6\u524D\u9762\u7684\u5B9A\u4E49\uFF0C\u59CB\u7EC8\u4EE5\u6700\u540E\u4E00\u6B21\u4E3A\u51C6',
      ),
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.noonce),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.noonce),
    );
  }
}
class HelloModel extends FlowModel {
  render() {
    return React.createElement(
      Space,
      { direction: 'vertical' },
      this.mapSubModels('examples', (model) =>
        React.createElement(FlowModelRenderer, { key: model.uid, model: model }),
      ),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloModel, OnceModel, NoOnceModel });
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      subModels: {
        examples: [{ use: 'OnceModel' }, { use: 'NoOnceModel' }],
      },
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
//# sourceMappingURL=once.js.map
