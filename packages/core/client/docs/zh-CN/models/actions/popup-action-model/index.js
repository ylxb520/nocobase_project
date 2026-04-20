import React from 'react';
import { Application, Plugin, PopupActionModel, PluginFlowEngine, MockFlowModelRepository } from '@nocobase/client';
import { FlowContextSelector, FlowModel, FlowModelRenderer, useFlowContext, useFlowView } from '@nocobase/flow-engine';
import MockAdapter from 'axios-mock-adapter';
import { Button, Space } from 'antd';
class OpenViewContentModel extends FlowModel {
  render() {
    return React.createElement(OpenViewContent, null);
  }
}
const OpenViewContent = () => {
  const ctx = useFlowContext();
  const view = useFlowView();
  const [value, setValue] = React.useState('');
  return React.createElement(
    'div',
    { style: { padding: 24 } },
    React.createElement(view.Header, { title: `新定义上下文` }),
    React.createElement(
      Space,
      { direction: 'vertical', style: { width: '100%' } },
      React.createElement(
        FlowContextSelector,
        {
          value: value,
          onChange: (val) => setValue(val),
          metaTree: () => ctx.getPropertyMetaTree(),
          style: { width: 360 },
          showSearch: true,
        },
        React.createElement(Button, { type: 'primary' }, '\u9009\u62E9\u4E0A\u4E0B\u6587\u53D8\u91CF'),
      ),
    ),
  );
};
// 继承 PopupActionModel：通过 getInputArgs 透传自定义上下文
class CustomCtxPopupActionModel extends PopupActionModel {
  defaultProps = {
    title: '打开带上下文的弹窗',
    type: 'primary',
  };
  getInputArgs() {
    const base = super.getInputArgs?.() || {};
    return {
      ...base,
      pageModelClass: 'OpenViewContentModel',
      defineProperties: {
        someContext: {
          value: { name: '演示数据', email: 'demo@example.com' },
          meta: {
            title: '新定义上下文',
            type: 'object',
            properties: {
              name: { title: '名称', type: 'string' },
              email: { title: '邮箱', type: 'string' },
            },
          },
        },
      },
      defineMethods: {
        greet: (_name) => {},
      },
    };
  }
}
// 根页面模型：渲染一个按钮，点击后打开弹窗
class DemoRootActionPageModel extends FlowModel {
  render() {
    const btn = this.subModels?.btn;
    return btn ? React.createElement(FlowModelRenderer, { model: btn }) : null;
  }
}
class DemoPlugin extends Plugin {
  async load() {
    // 注册模型
    this.flowEngine.registerModels({ CustomCtxPopupActionModel, DemoRootActionPageModel, OpenViewContentModel });
    // 使用本地 Mock
    const repo = new MockFlowModelRepository('demo-popup-action:');
    await repo.clear();
    this.flowEngine.setModelRepository(repo);
    // 创建根页面模型与子按钮模型
    const root = this.flowEngine.createModel({
      use: 'DemoRootActionPageModel',
      subModels: {
        btn: { use: 'CustomCtxPopupActionModel' },
      },
    });
    // 挂到路由（仅用于示例）
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: root }),
    });
  }
}
// 启动示例应用
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  // 提供 baseURL，避免 axios 解析诸如 'roles:check' 时出现 Unsupported protocol 错误
  apiClient: { baseURL: 'http://localhost:8000' },
  plugins: [PluginFlowEngine, DemoPlugin],
});
// Mock 必要接口，避免 ACL/角色等请求导致报错
const mock = new MockAdapter(app.apiClient.axios);
mock.onGet('roles:check').reply(200, { data: { allowAll: true } });
export default app.getRootComponent();
//# sourceMappingURL=index.js.map
