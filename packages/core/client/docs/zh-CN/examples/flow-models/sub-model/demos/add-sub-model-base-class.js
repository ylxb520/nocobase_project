import { Application, BlockModel, Plugin } from '@nocobase/client';
import { AddSubModelButton, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space } from 'antd';
import React from 'react';
class HelloBlockModel extends FlowModel {
  get title() {
    return 'HelloBlockModel';
  }
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
        { model: this, subModelKey: 'items', subModelBaseClass: 'BlockModel' },
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
  renderComponent() {
    return React.createElement(
      'div',
      null,
      React.createElement('h2', null, 'Sub2 Block'),
      React.createElement('p', null, 'This is a sub block rendered by Sub2BlockModel.'),
    );
  }
}
class Sub3BlockModel extends BlockModel {
  renderComponent() {
    return React.createElement(
      'div',
      null,
      React.createElement('h2', null, 'Sub3 Block'),
      React.createElement('p', null, 'This is a sub block rendered by Sub3BlockModel.'),
    );
  }
}
class Sub4BlockModel extends BlockModel {
  renderComponent() {
    return React.createElement(
      'div',
      null,
      React.createElement('h2', null, 'Sub4 Block'),
      React.createElement('p', null, 'This is a sub block rendered by Sub4BlockModel.'),
    );
  }
}
Sub2BlockModel.define({
  label: 'Sub2 Block',
  hide: (ctx) => ctx.model.title !== 'HelloBlockModel',
});
Sub3BlockModel.define({
  hide: (ctx) => ctx.model.title === 'HelloBlockModel',
});
Sub4BlockModel.define({
  label: 'Sub4 Block',
  hide: true,
});
// 插件类，负责注册模型、仓库，并加载或创建模型实例
class PluginHelloModel extends Plugin {
  async load() {
    // 注册自定义模型
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({
      BlockModel,
      HelloBlockModel,
      Sub1BlockModel,
      Sub2BlockModel,
      Sub3BlockModel,
    });
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
//# sourceMappingURL=add-sub-model-base-class.js.map
