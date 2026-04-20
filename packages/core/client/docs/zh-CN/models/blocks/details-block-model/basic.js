import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Form } from 'antd';
import React from 'react';
function DisplayField(props) {
  const { value } = props;
  return React.createElement('span', null, value);
}
class DetailsBlockModel extends FlowModel {
  render() {
    return React.createElement(
      Form,
      { layout: 'vertical', initialValues: { name: 'NocoBase' } },
      React.createElement(Form.Item, { label: '\u59D3\u540D', name: 'name' }, React.createElement(DisplayField, null)),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    // 注册 HelloModel 到 flowEngine
    this.flowEngine.registerModels({ DetailsBlockModel });
    // 创建 HelloModel 的实例（仅用于示例）
    const model = this.flowEngine.createModel({
      use: 'DetailsBlockModel',
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
