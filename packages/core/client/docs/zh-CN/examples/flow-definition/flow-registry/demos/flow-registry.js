import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Card, Space } from 'antd';
import React from 'react';
// 自定义模型类，继承自 FlowModel
class MyModel extends FlowModel {
  getInstanceFlows() {
    return [...this.flowRegistry.getFlows().values()];
  }
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        Space,
        { direction: 'vertical', style: { width: '100%' } },
        React.createElement('div', null, 'Flow count: ', this.flowRegistry.getFlows().size),
        this.getInstanceFlows().map((flow) =>
          React.createElement(
            Card,
            {
              key: flow.key,
              title: `Flow: ${flow.title}`,
              actions: [
                React.createElement(
                  Button,
                  {
                    key: 'edit',
                    onClick: () => {
                      flow.title = `Edited ${flow.title}`;
                      flow.on = `click:${flow.key}`;
                      flow.save();
                    },
                  },
                  'Edit',
                ),
                React.createElement(
                  Button,
                  {
                    key: 'remove',
                    onClick: () => {
                      flow.remove();
                    },
                  },
                  'Remove(local)',
                ),
                React.createElement(
                  Button,
                  {
                    key: 'delete',
                    onClick: () => {
                      flow.destroy();
                    },
                  },
                  'Destroy(remote)',
                ),
                React.createElement(
                  Button,
                  {
                    key: 'add-step',
                    onClick: () => {
                      const step = flow.addStep(`step_${uid()}`, {
                        title: `New Step ${uid()}`,
                      });
                      step.save();
                    },
                  },
                  'Add step',
                ),
              ],
            },
            React.createElement('pre', null, JSON.stringify(flow.serialize(), null, 2)),
            React.createElement('div', null, 'Steps:'),
            React.createElement(
              'ul',
              null,
              flow.mapSteps((step) =>
                React.createElement(
                  'li',
                  { key: step.key },
                  step.title,
                  ' ',
                  React.createElement(
                    Space,
                    null,
                    React.createElement(
                      'a',
                      {
                        onClick: () => {
                          step.title = `Edited ${step.title}`;
                          step.save();
                        },
                      },
                      'Edit',
                    ),
                    React.createElement(
                      'a',
                      {
                        onClick: () => {
                          step.remove();
                        },
                      },
                      'Remove',
                    ),
                    React.createElement(
                      'a',
                      {
                        onClick: () => {
                          step.destroy();
                        },
                      },
                      'Destroy',
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        React.createElement(
          Button,
          {
            onClick: () => {
              const key = `f_${uid()}`;
              const flow = this.flowRegistry.addFlow(key, {
                title: key,
                steps: {},
              });
              flow.save();
            },
          },
          'Add Flow',
        ),
      ),
    );
  }
}
// 插件类，负责注册模型、仓库，并加载或创建模型实例
class PluginHelloModel extends Plugin {
  async load() {
    // 启用 Flow Settings
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ MyModel });
    const model = this.flowEngine.createModel({
      uid: 'my-model',
      use: 'MyModel',
      flowRegistry: {
        flow1: {
          title: 'Flow 1',
          steps: {
            step1: { title: 'Step 1' },
            step2: { title: 'Step 2' },
            step3: { title: 'Step 3' },
          },
        },
      },
    });
    // 注册路由，渲染模型
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
// 创建应用实例，注册插件
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=flow-registry.js.map
