import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer, useFlowModelContext } from '@nocobase/flow-engine';
import { Form, Input } from 'antd';
import React from 'react';
function FormComponent(props) {
  const [form] = Form.useForm();
  const ctx = useFlowModelContext();
  ctx.defineProperty('form', {
    get: () => form,
    cache: true,
  });
  return React.createElement(Form, { layout: 'vertical', ...ctx.model.props }, props.children);
}
class FormBlockModel extends FlowModel {
  onMount() {
    this.context.form?.setFieldsValue({ name: 'NocoBase' });
  }
  render() {
    return React.createElement(FormComponent, null, this.renderChildren());
  }
  renderChildren() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Form.Item, { label: 'Name', name: 'name' }, React.createElement(Input, null)),
      React.createElement(Form.Item, { label: 'Name', name: 'name' }, React.createElement(Input, null)),
      '\u8868\u5355\u503C\uFF1A',
      React.createElement('pre', null, JSON.stringify(this.context.form?.getFieldsValue(), null, 2)),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    // 注册 HelloModel 到 flowEngine
    this.flowEngine.registerModels({ FormBlockModel });
    // 创建 HelloModel 的实例（仅用于示例）
    const model = this.flowEngine.createModel({
      use: 'FormBlockModel',
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
//# sourceMappingURL=form.js.map
