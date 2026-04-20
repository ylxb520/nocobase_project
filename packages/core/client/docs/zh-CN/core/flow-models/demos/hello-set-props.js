import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Input } from 'antd';
import React from 'react';
class HelloFlowModel extends FlowModel {
  render() {
    const { name } = this.props;
    return React.createElement(
      'div',
      null,
      React.createElement('div', { style: { margin: 10 } }, 'Hello ', React.createElement('strong', null, name)),
      React.createElement(Input, {
        defaultValue: name,
        onChange: (e) => {
          this.props.name = e.target.value;
        },
      }),
    );
  }
}
// 插件定义
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.registerModels({ HelloFlowModel });
    const model = this.flowEngine.createModel({
      use: 'HelloFlowModel',
      props: {
        name: 'NocoBase',
      },
    });
    this.router.add('root', { path: '/', element: React.createElement(FlowModelRenderer, { model: model }) });
  }
}
// 创建应用实例
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=hello-set-props.js.map
