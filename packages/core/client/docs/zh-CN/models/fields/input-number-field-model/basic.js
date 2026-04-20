import { Application, FieldModelRenderer, FormComponent, NumberFieldModel, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer, FormItem } from '@nocobase/flow-engine';
import { Form, InputNumber } from 'antd';
import React from 'react';
class HelloModel extends FlowModel {
  render() {
    return React.createElement(
      FormComponent,
      { model: this, layoutProps: { layout: 'vertical' }, initialValues: { age: 18, obj: { number: 11 } } },
      React.createElement(
        FormItem,
        { label: 'Age', name: 'age' },
        React.createElement(FieldModelRenderer, { model: this.subModels.field }),
      ),
      React.createElement(
        FormItem,
        { rules: [{ required: true }], label: 'number', name: ['obj', 'number'] },
        React.createElement(InputNumber, null),
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
    this.flowEngine.registerModels({ HelloModel, NumberFieldModel });
    // 创建 HelloModel 的实例（仅用于示例）
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      subModels: {
        field: {
          use: 'NumberFieldModel',
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
