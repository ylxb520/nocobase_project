import { Application, FieldModelRenderer, FormComponent, Plugin, SelectFieldModel } from '@nocobase/client';
import { FlowModel, FlowModelRenderer, FormItem } from '@nocobase/flow-engine';
import { Form, Select } from 'antd';
import React from 'react';
class HelloModel extends FlowModel {
  render() {
    return React.createElement(
      FormComponent,
      {
        model: this,
        layoutProps: { layout: 'vertical' },
        initialValues: {
          singleSelect: 'NocoBase',
          singleSelect1: 'lowCode',
          multipleSelect: ['apple', 'banana'],
          multipleSelect1: ['apple'],
        },
      },
      React.createElement(
        FormItem,
        { label: 'SingleSelect', name: 'singleSelect' },
        React.createElement(FieldModelRenderer, {
          model: this.subModels.field1,
          options: [
            {
              value: 'nocoBase',
              label: 'NocoBase',
            },
            {
              value: 'lowCode',
              label: 'LowCode',
            },
          ],
        }),
      ),
      React.createElement(
        FormItem,
        { rules: [{ required: true }], label: 'SingleSelect1', name: 'singleSelect1' },
        React.createElement(Select, {
          options: [
            {
              value: 'nocoBase',
              label: 'NocoBase',
            },
            {
              value: 'lowCode',
              label: 'LowCode',
            },
          ],
        }),
      ),
      React.createElement(
        FormItem,
        { label: 'MultipleSelect', name: 'multipleSelect' },
        React.createElement(FieldModelRenderer, {
          model: this.subModels.field2,
          mode: 'multiple',
          options: [
            {
              value: 'apple',
              label: 'Apple',
            },
            {
              value: 'banana',
              label: 'Banana',
            },
            {
              value: 'orange',
              label: 'Orange',
            },
          ],
        }),
      ),
      React.createElement(
        FormItem,
        { rules: [{ required: true }], label: 'MultipleSelect1', name: 'multipleSelect1' },
        React.createElement(Select, {
          mode: 'multiple',
          options: [
            {
              value: 'apple',
              label: 'Apple',
            },
            {
              value: 'banana',
              label: 'Banana',
            },
            {
              value: 'orange',
              label: 'Orange',
            },
          ],
        }),
      ),
      React.createElement(Form.Item, { noStyle: true, shouldUpdate: true }, () =>
        React.createElement(
          'div',
          null,
          '\u5F53\u524D\u8868\u5355\u503C\uFF1A',
          React.createElement('pre', null, JSON.stringify(this.context.form?.getFieldsValue(), null, 2)),
        ),
      ),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    // 注册 HelloModel 到 flowEngine
    this.flowEngine.registerModels({ HelloModel, SelectFieldModel });
    // 创建 HelloModel 的实例（仅用于示例）
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      subModels: {
        field1: {
          use: 'SelectFieldModel',
        },
        field2: {
          use: 'SelectFieldModel',
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
//# sourceMappingURL=basic.js.map
