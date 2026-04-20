import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Card, Space } from 'antd';
import React from 'react';
class HelloModel extends FlowModel {
  render() {
    const fork1 = this.subModels.sub1.createFork({}, 'fork1');
    const fork2 = this.subModels.sub1.createFork({}, 'fork2');
    return React.createElement(
      'div',
      null,
      React.createElement('h1', null, 'Hello, NocoBase!'),
      React.createElement('p', null, 'This is a simple block rendered by HelloModel.'),
      React.createElement(
        Space,
        { direction: 'vertical' },
        React.createElement(FlowModelRenderer, { model: fork1 }),
        React.createElement(FlowModelRenderer, { model: fork2 }),
      ),
    );
  }
}
class HelloSubModel extends FlowModel {
  render() {
    return React.createElement(
      Card,
      null,
      React.createElement('p', null, React.createElement('strong', null, 'Hello, SubModel - ', uid())),
      React.createElement('p', null, 'This is a sub-model rendered by HelloSubModel.'),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    // 注册 HelloModel 到 flowEngine
    this.flowEngine.registerModels({ HelloModel, HelloSubModel });
    // 创建 HelloModel 的实例（仅用于示例）
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      subModels: {
        sub1: {
          use: 'HelloSubModel',
        },
      },
    });
    // 添加路由，将模型渲染到根路径（仅用于示例）
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
// 创建应用实例，注册插件（仅用于示例）
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=index.js.map
