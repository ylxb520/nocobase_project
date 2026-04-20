import {
  Application,
  DateOnlyFieldModel,
  DateOnlyPicker,
  DateTimeNoTzFieldModel,
  DateTimeTzFieldModel,
  FormComponent,
  FormItemModel,
  Plugin,
} from '@nocobase/client';
import { FieldModelRenderer, FlowModel, FlowModelRenderer, FormItem } from '@nocobase/flow-engine';
import { DatePicker, Form } from 'antd';
import React from 'react';
class HelloModel extends FlowModel {
  render() {
    return React.createElement(
      FormComponent,
      {
        model: this,
        layoutProps: { layout: 'vertical' },
        initialValues: {
          dateOnly: '2026-03-22',
          dateTimeTz: '2015-04-25T16:00:10.000Z',
          dateTimeNoTz: '2015-04-18 12:04:55',
          dateOnly1: '2025-03-19',
        },
      },
      React.createElement(
        FormItem,
        { label: 'DateOnly', name: 'dateOnly' },
        React.createElement(FieldModelRenderer, { model: this.subModels.dateOnly }),
      ),
      React.createElement(
        FormItem,
        { label: 'DateTimeTz', name: 'dateTimeTz' },
        React.createElement(FieldModelRenderer, { model: this.subModels.dateTimeTz, showTime: true }),
      ),
      React.createElement(
        FormItem,
        { label: 'DateTimeNoTz', name: 'dateTimeNoTz' },
        React.createElement(FieldModelRenderer, { model: this.subModels.dateTimeNoTz, showTime: true }),
      ),
      React.createElement(
        FormItem,
        { rules: [{ required: true }], label: 'DateOnly1', name: 'dateOnly1' },
        React.createElement(DateOnlyPicker, null),
      ),
      React.createElement(
        FormItem,
        { rules: [{ required: true }], label: 'Date', name: 'date' },
        React.createElement(DatePicker, { showTime: true }),
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
    this.flowEngine.registerModels({
      HelloModel,
      DateTimeNoTzFieldModel,
      DateOnlyFieldModel,
      DateTimeTzFieldModel,
      FormItemModel,
    });
    // 创建 HelloModel 的实例（仅用于示例）
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      subModels: {
        dateOnly: {
          use: 'DateOnlyFieldModel',
        },
        dateTimeTz: {
          use: 'DateTimeTzFieldModel',
        },
        dateTimeNoTz: {
          use: 'DateTimeNoTzFieldModel',
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
