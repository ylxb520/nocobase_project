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
              key: 'sub1',
              label: 'Sub1 Block',
              toggleable: true,
              useModel: 'Sub1BlockModel',
            },
            {
              key: 'sub2',
              label: 'Sub2 Block',
              children: [
                {
                  key: 'sub2-1',
                  label: 'Sub2-1 Block',
                  toggleable: Sub2BlockModel.customToggleable('foo'),
                  useModel: 'Sub2BlockModel',
                  createModelOptions: {
                    props: {
                      name: 'foo',
                    },
                  },
                },
                {
                  key: 'sub2-1',
                  label: 'Sub2-1 Block',
                  toggleable: Sub2BlockModel.customToggleable('bar'),
                  useModel: 'Sub2BlockModel',
                  createModelOptions: {
                    props: {
                      name: 'bar',
                    },
                  },
                },
              ],
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
class Sub2BlockModel extends BlockModel {
  static customToggleable(name) {
    return (model) => {
      // Custom toggle logic, e.g., based on a specific prop
      return model.props.name === name;
    };
  }
  renderComponent() {
    return React.createElement(
      'div',
      null,
      React.createElement('h2', null, 'Sub2 Block - ', this.props.name),
      React.createElement('p', null, 'This is a sub block rendered by Sub2BlockModel.'),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloBlockModel, Sub1BlockModel, Sub2BlockModel });
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
//# sourceMappingURL=add-sub-model-toggleable.js.map
