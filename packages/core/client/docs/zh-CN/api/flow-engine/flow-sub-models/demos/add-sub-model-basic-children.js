import { Application, BlockModel, Plugin } from '@nocobase/client';
import { AddSubModelButton, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space } from 'antd';
import React from 'react';
class HelloBlockModel extends FlowModel {
  render() {
    return React.createElement(
      Space,
      { direction: 'vertical', style: { width: '100%' } },
      this.mapSubModels('items', (item) => {
        return React.createElement(FlowModelRenderer, {
          key: item.uid,
          model: item,
          showFlowSettings: { showBorder: true },
        });
      }),
      React.createElement(
        AddSubModelButton,
        {
          model: this,
          subModelKey: 'items',
          items: [
            {
              key: 'group1',
              label: 'Group1',
              type: 'group',
              children: [
                {
                  key: 'group1-sub1',
                  label: 'Block1',
                  createModelOptions: {
                    use: 'Sub1BlockModel',
                  },
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              key: 'submenu1',
              label: 'Sub Menu',
              children: [
                {
                  key: 'submenu1-sub1',
                  label: 'Block1',
                  createModelOptions: {
                    use: 'Sub1BlockModel',
                  },
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              key: 'sub1',
              label: 'Block1',
              createModelOptions: {
                use: 'Sub1BlockModel',
              },
            },
          ],
        },
        React.createElement(Button, null, 'Add block'),
      ),
    );
  }
}
class Sub1BlockModel extends BlockModel {
  renderComponent() {
    return React.createElement(
      'div',
      null,
      React.createElement('h2', null, 'Sub1 Block'),
      React.createElement('p', null, 'This is a sub block rendered by Sub1BlockModel.'),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloBlockModel, Sub1BlockModel });
    const model = this.flowEngine.createModel({
      uid: 'my-model',
      use: 'HelloBlockModel',
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
//# sourceMappingURL=add-sub-model-basic-children.js.map
