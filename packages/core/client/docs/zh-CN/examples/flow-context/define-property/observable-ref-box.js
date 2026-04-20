import { observable } from '@formily/reactive';
import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Card, Space } from 'antd';
import React from 'react';
class HelloModel extends FlowModel {
  onInit() {
    this.context.defineProperty('refValue', {
      get: () => observable.ref(uid()),
    });
    this.context.defineProperty('boxValue', {
      get: () => observable.box(uid()),
    });
  }
  render() {
    return React.createElement(
      Space,
      { direction: 'vertical' },
      React.createElement(
        Space,
        null,
        React.createElement(
          Button,
          {
            onClick: () => {
              this.context.refValue.value = uid();
            },
          },
          '\u5237\u65B0 observable.ref \u5C5E\u6027\u503C',
        ),
        React.createElement(
          Button,
          {
            onClick: () => {
              this.context.boxValue.set(uid());
            },
          },
          '\u5237\u65B0 observable.box \u5C5E\u6027\u503C',
        ),
      ),
      this.mapSubModels('examples', (model) =>
        React.createElement(FlowModelRenderer, { key: model.uid, model: model }),
      ),
    );
  }
}
class Cache1Model extends FlowModel {
  render() {
    return React.createElement(
      Card,
      { title: 'refValue', style: { width: 340 } },
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.refValue.value),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.refValue.value),
    );
  }
}
class Cache2Model extends FlowModel {
  render() {
    return React.createElement(
      Card,
      { title: 'boxValue', style: { width: 340 } },
      React.createElement('div', null, '\u7B2C\u4E00\u6B21\u8BFB\u53D6: ', this.context.boxValue.get()),
      React.createElement('div', null, '\u7B2C\u4E8C\u6B21\u8BFB\u53D6: ', this.context.boxValue.get()),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloModel, Cache1Model, Cache2Model });
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      subModels: {
        examples: [{ use: 'Cache1Model' }, { use: 'Cache2Model' }],
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
//# sourceMappingURL=observable-ref-box.js.map
