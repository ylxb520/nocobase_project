import { Application, BlockModel, Plugin } from '@nocobase/client';
import { AddSubModelButton, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Form, Input, Space } from 'antd';
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
          showFlowSettings: { showBorder: false, showBackground: true },
        });
      }),
      React.createElement(
        AddSubModelButton,
        { model: this, subModelKey: 'items', subModelBaseClasses: ['BaseFieldModel'] },
        React.createElement(Button, null, 'Configure fields'),
      ),
    );
  }
}
class BaseFieldModel extends BlockModel {
  // 自定义分组
  static defineChildren(ctx) {
    // 以下仅为演示，实际使用时请根据需要调整
    const collection = ctx.dataSourceManager.getCollection('main', 'tests');
    return collection.getFields().map((field) => {
      return {
        key: field.name,
        label: field.title,
        createModelOptions: {
          use: 'FieldModel',
          props: {
            fieldName: field.name,
          },
        },
      };
    });
  }
}
BaseFieldModel.define({
  label: 'Fields',
});
class FieldModel extends FlowModel {
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        Form.Item,
        { layout: 'vertical', label: this.props.fieldName },
        React.createElement(Input, null),
      ),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    // 模拟数据
    const mainDataSource = this.flowEngine.context.dataSourceManager.getDataSource('main');
    mainDataSource.addCollection({
      name: 'tests',
      title: 'Tests',
      fields: [
        {
          name: 'name',
          type: 'string',
          title: 'Name',
          interface: 'input',
        },
        {
          name: 'title',
          type: 'string',
          title: 'Title',
          interface: 'input',
        },
      ],
    });
    this.flowEngine.registerModels({
      HelloBlockModel,
      BaseFieldModel,
      FieldModel,
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
//# sourceMappingURL=add-sub-model-group-children.js.map
