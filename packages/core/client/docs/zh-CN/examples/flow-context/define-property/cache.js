import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Card, Space } from 'antd';
import React from 'react';
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
class CacheModel extends FlowModel {
  onInit() {
    this.context.defineProperty('cached', {
      get: () => uid(),
      // 默认 cache: true
    });
  }
  render() {
    return React.createElement(
      Card,
      { title: '\u5E26\u7F13\u5B58\u7684\u5C5E\u6027\uFF08cached\uFF09', style: { width: 340 } },
      React.createElement(
        'div',
        { style: { marginBottom: 8, color: '#888' } },
        '\u53EA\u4F1A\u6267\u884C\u4E00\u6B21 getter\uFF0C\u540E\u7EED\u8BFB\u53D6\u8FD4\u56DE\u7F13\u5B58\u503C',
      ),
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.cached),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.cached),
    );
  }
}
class NoCacheModel extends FlowModel {
  onInit() {
    this.context.defineProperty('noCache', {
      get: () => uid(),
      cache: false, // 不缓存
    });
  }
  render() {
    return React.createElement(
      Card,
      { title: '\u4E0D\u5E26\u7F13\u5B58\u7684\u5C5E\u6027\uFF08noCache\uFF09', style: { width: 340 } },
      React.createElement(
        'div',
        { style: { marginBottom: 8, color: '#888' } },
        '\u6BCF\u6B21\u8BFB\u53D6\u90FD\u4F1A\u6267\u884C getter\uFF0C\u503C\u4F1A\u53D8\u5316',
      ),
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.noCache),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.noCache),
    );
  }
}
class RemoveCacheModel extends FlowModel {
  onInit() {
    this.context.defineProperty('cached', {
      get: () => uid(),
      // 默认 cache: true
    });
  }
  render() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    return React.createElement(
      Card,
      { title: '\u624B\u52A8\u6E05\u9664\u7F13\u5B58', style: { width: 340 } },
      React.createElement(
        'div',
        { style: { marginBottom: 8, color: '#888' } },
        '\u70B9\u51FB\u6309\u94AE\u540E\u6E05\u9664\u7F13\u5B58\uFF0C\u518D\u6B21\u8BFB\u53D6\u4F1A\u91CD\u65B0\u751F\u6210',
      ),
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.cached),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.cached),
      React.createElement(
        Button,
        {
          style: { marginTop: 8 },
          onClick: () => {
            this.context.removeCache('cached');
            forceUpdate();
          },
        },
        '\u6E05\u9664 cached \u7F13\u5B58\u5E76\u5237\u65B0',
      ),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloModel, CacheModel, NoCacheModel, RemoveCacheModel });
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      subModels: {
        examples: [{ use: 'CacheModel' }, { use: 'NoCacheModel' }, { use: 'RemoveCacheModel' }],
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
//# sourceMappingURL=cache.js.map
