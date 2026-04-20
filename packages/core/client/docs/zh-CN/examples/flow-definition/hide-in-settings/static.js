import { Application, Plugin } from '@nocobase/client';
import { AddSubModelButton, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Card, Space } from 'antd';
import React from 'react';
class StaticModel extends FlowModel {
  render() {
    return React.createElement(
      Space,
      { direction: 'vertical' },
      this.mapSubModels('subs', (subModel) =>
        React.createElement(FlowModelRenderer, { key: subModel.uid, model: subModel, showFlowSettings: true }),
      ),
      React.createElement(
        AddSubModelButton,
        {
          model: this,
          subModelKey: 'subs',
          items: [
            { key: 'sub1', useModel: 'StaticSubModel', label: 'Sub Model 1' },
            { key: 'sub2', useModel: 'StaticSubModel', label: 'Sub Model 2' },
          ],
        },
        React.createElement(Button, { type: 'primary' }, 'Add Sub Model'),
      ),
    );
  }
}
class StaticSubModel extends FlowModel {
  render() {
    const descriptionParams = this.getStepParams?.('staticFlow', 'description') || {};
    return React.createElement(
      Card,
      { title: `Static SubModel - ${this.props.name || '未命名'}` },
      React.createElement(
        'p',
        null,
        '\u63CF\u8FF0\uFF08\u9759\u6001\u663E\u793A\u6B65\u9AA4\uFF09\uFF1A',
        descriptionParams.description || '（点击设置按钮输入描述）',
      ),
      React.createElement(
        'p',
        null,
        '\u540D\u79F0\u6B65\u9AA4\u4F7F\u7528 hideInSettings: true\uFF0C\u4EC5\u521B\u5EFA\u65F6\u663E\u793A\u3002',
      ),
    );
  }
}
StaticSubModel.registerFlow({
  key: 'staticFlow',
  steps: {
    name: {
      title: '名称',
      hideInSettings: true,
      preset: true,
      uiSchema: {
        name: {
          type: 'string',
          title: '名称',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
      handler(ctx, params) {
        ctx.model.setProps({ name: params.name });
      },
    },
    description: {
      title: '描述',
      hideInSettings: false,
      uiSchema: {
        description: {
          type: 'string',
          title: '描述',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
      handler(ctx, params) {
        ctx.model.setStepParams?.('staticFlow', 'description', params);
      },
    },
  },
});
class PluginStaticModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ StaticModel, StaticSubModel });
    const model = this.flowEngine.createModel({
      use: 'StaticModel',
      uid: 'static-model',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginStaticModel],
});
export default app.getRootComponent();
//# sourceMappingURL=static.js.map
