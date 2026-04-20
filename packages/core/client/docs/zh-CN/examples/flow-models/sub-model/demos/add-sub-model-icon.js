import { PlusOutlined } from '@ant-design/icons';
import { Application, BlockModel, Plugin } from '@nocobase/client';
import { AddSubModelButton, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Card, Space } from 'antd';
import React from 'react';
function AddBlock(props) {
  const { model, children } = props;
  return React.createElement(
    AddSubModelButton,
    {
      model: model,
      subModelKey: 'items',
      items: [
        {
          key: 'sub1',
          label: 'Sub1 Block',
          createModelOptions: {
            use: 'Sub1BlockModel',
          },
        },
      ],
    },
    children,
  );
}
class HelloBlockModel extends FlowModel {
  render() {
    return React.createElement(
      Card,
      null,
      React.createElement(
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
          Space,
          null,
          React.createElement(AddBlock, { model: this }, React.createElement(Button, null, 'Add block')),
          React.createElement(
            AddBlock,
            { model: this },
            React.createElement('a', null, React.createElement(PlusOutlined, null), ' Add block'),
          ),
        ),
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
      element: React.createElement(FlowModelRenderer, {
        model: model,
        showFlowSettings: { showBorder: true },
        hideRemoveInSettings: true,
        extraToolbarItems: [
          {
            key: 'add-block',
            component: () => {
              return React.createElement(AddBlock, { model: model }, React.createElement(PlusOutlined, null));
            },
            sort: 1,
          },
        ],
      }),
    });
  }
}
// 创建应用实例，注册插件
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=add-sub-model-icon.js.map
