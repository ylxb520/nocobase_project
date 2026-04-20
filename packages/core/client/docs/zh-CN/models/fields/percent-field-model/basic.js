import {
  Application,
  FieldModelRenderer,
  FormComponent,
  PercentFieldModel,
  PercentInput,
  Plugin,
} from '@nocobase/client';
import { FlowModel, FlowModelRenderer, FormItem } from '@nocobase/flow-engine';
import { Form } from 'antd';
import React from 'react';
class HelloModel extends FlowModel {
  render() {
    console.log(this);
    return React.createElement(
      FormComponent,
      { model: this, layoutProps: { layout: 'vertical' }, initialValues: { percent1: 0.01, percent2: 0.03 } },
      React.createElement(
        FormItem,
        { label: 'Percent field1', name: 'percent1' },
        React.createElement(FieldModelRenderer, { model: this.subModels.field }),
      ),
      React.createElement(
        FormItem,
        { label: 'Percent field2', name: 'percent2' },
        React.createElement(PercentInput, null),
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
    this.flowEngine.registerModels({ HelloModel, PercentFieldModel });
    // 创建 HelloModel 的实例（仅用于示例）
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      subModels: {
        field: {
          use: 'PercentFieldModel',
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
