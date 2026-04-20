import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space, message } from 'antd';
import React from 'react';
// 模型类
class MyModel extends FlowModel {
  render() {
    return React.createElement(
      Space,
      null,
      React.createElement(
        Button,
        { type: 'primary', onClick: () => this.dispatchEvent('click') },
        '\u89E6\u53D1\u70B9\u51FB\u4E8B\u4EF6',
      ),
      React.createElement('div', null, '\u6D41\u6570\u91CF: ', this.getFlows().size),
    );
  }
}
// 注册一个类级（全局）流：key = shared
MyModel.registerFlow({
  key: 'shared',
  title: '类级点击流',
  on: 'click',
  steps: {
    s1: {
      title: '类级步骤',
      handler() {
        message.info('类级 shared 流被触发');
      },
    },
  },
});
// 插件：演示实例流覆盖同名类级流
class PluginInstanceOverridesGlobal extends Plugin {
  async load() {
    this.flowEngine.registerModels({ MyModel });
    const model = this.flowEngine.createModel({ use: 'MyModel', uid: 'override-demo' });
    // 注册一个实例级流，与类级流同 key = shared（实例优先）
    model.registerFlow('shared', {
      title: '实例点击流（覆盖）',
      on: 'click',
      steps: {
        s1: {
          title: '实例步骤',
          handler() {
            message.success('实例 shared 流被触发（覆盖类级）');
          },
        },
      },
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(FlowModelRenderer, { model: model }),
      ),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginInstanceOverridesGlobal],
});
export default app.getRootComponent();
//# sourceMappingURL=instance-overrides-global.js.map
