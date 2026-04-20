import { Input, Select, Switch } from '@formily/antd-v5';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Card, Space, Button } from 'antd';
import React from 'react';
class SimpleFormModel extends FlowModel {
  render() {
    const { formType = 'user', advancedMode = false, config = {} } = this.props;
    return React.createElement(
      Card,
      { title: `${formType}表单 ${advancedMode ? '(高级)' : '(基础)'}`, style: { width: 250, margin: 8 } },
      React.createElement('p', null, React.createElement('strong', null, '\u7C7B\u578B:'), ' ', formType),
      React.createElement(
        'p',
        null,
        React.createElement('strong', null, '\u6A21\u5F0F:'),
        ' ',
        advancedMode ? '高级' : '基础',
      ),
      React.createElement(
        'p',
        null,
        React.createElement('strong', null, '\u914D\u7F6E:'),
        ' ',
        Object.keys(config).length,
        '\u9879',
      ),
    );
  }
}
// 注册动态表单配置流程
SimpleFormModel.registerFlow('configFlow', {
  title: '表单配置',
  steps: {
    // 第一步：基础设置
    basicSettings: {
      title: '基础设置',
      paramsRequired: true,
      uiSchema: {
        formType: {
          type: 'string',
          title: '表单类型',
          'x-component': Select,
          'x-decorator': 'FormItem',
          enum: [
            { label: '用户', value: 'user' },
            { label: '产品', value: 'product' },
          ],
        },
        advancedMode: {
          type: 'boolean',
          title: '高级模式',
          'x-component': Switch,
          'x-decorator': 'FormItem',
        },
      },
      defaultParams: {
        formType: 'user',
        advancedMode: false,
      },
      handler(ctx, params) {
        ctx.model.setProps({
          formType: params.formType,
          advancedMode: params.advancedMode,
        });
      },
    },
    // 第二步：详细配置 - 🔥 关键：动态 uiSchema
    detailConfig: {
      title: '详细配置',
      paramsRequired: true,
      // 🔥 动态 uiSchema - 简单测试
      uiSchema: (ctx) => {
        const { formType, advancedMode } = ctx.model.getProps();
        return {
          name: {
            type: 'string',
            title: `${formType} 名称`,
            'x-component': Input,
            'x-decorator': 'FormItem',
          },
          ...(advancedMode && {
            extra: {
              type: 'string',
              title: '额外信息',
              'x-component': Input,
              'x-decorator': 'FormItem',
            },
          }),
        };
      },
      // 动态默认值
      defaultParams: (ctx) => {
        const { formType } = ctx.model.getProps();
        return formType === 'user' ? { name: '新用户', role: 'user' } : { name: '新产品', price: 100 };
      },
      handler(ctx, params) {
        ctx.model.setProps('config', params);
      },
    },
  },
});
class PluginDynamicUiSchema extends Plugin {
  async load() {
    this.flowEngine.registerModels({ SimpleFormModel });
    // 创建简单表单模型
    const model = this.flowEngine.createModel({
      uid: 'simple-form',
      use: 'SimpleFormModel',
      props: { formType: 'user', advancedMode: false },
    });
    await model.dispatchEvent('beforeRender');
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement('h2', null, '\u52A8\u6001 uiSchema \u6F14\u793A'),
        React.createElement(
          'p',
          null,
          '\u8FD9\u4E2A\u793A\u4F8B\u5C55\u793A\u4E86 uiSchema \u7684\u52A8\u6001\u529F\u80FD\uFF1A',
          React.createElement('br', null),
          '1. \u5148\u8BBE\u7F6E\u8868\u5355\u7C7B\u578B\u548C\u9AD8\u7EA7\u6A21\u5F0F',
          React.createElement('br', null),
          '2. \u518D\u914D\u7F6E\u8BE6\u7EC6\u4FE1\u606F\u65F6\uFF0C\u754C\u9762\u6839\u636E\u7C7B\u578B\u548C\u6A21\u5F0F\u52A8\u6001\u53D8\u5316',
        ),
        React.createElement(
          'div',
          { style: { marginTop: 20 } },
          React.createElement(FlowModelRenderer, { model: model, showFlowSettings: true }),
        ),
        React.createElement(
          Card,
          null,
          React.createElement(
            Space,
            { direction: 'vertical' },
            React.createElement(
              Button,
              {
                onClick: () => {
                  model.setStepParams('configFlow', 'basicSettings', {
                    formType: 'user',
                    advancedMode: false,
                  });
                  model.applyFlow('configFlow');
                },
              },
              '\u7528\u6237\u8868\u5355\uFF08\u57FA\u7840\uFF09',
            ),
            React.createElement(
              Button,
              {
                onClick: () => {
                  model.setStepParams('configFlow', 'basicSettings', {
                    formType: 'user',
                    advancedMode: true,
                  });
                  model.applyFlow('configFlow');
                },
              },
              '\u7528\u6237\u8868\u5355\uFF08\u9AD8\u7EA7\uFF09',
            ),
            React.createElement(
              Button,
              {
                onClick: () => {
                  model.setStepParams('configFlow', 'basicSettings', {
                    formType: 'product',
                    advancedMode: true,
                  });
                  model.applyFlow('configFlow');
                },
              },
              '\u4EA7\u54C1\u8868\u5355\uFF08\u9AD8\u7EA7\uFF09',
            ),
          ),
        ),
      ),
    });
  }
}
// 创建应用实例
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginDynamicUiSchema],
});
export default app.getRootComponent();
//# sourceMappingURL=dynamic-ui-schema.js.map
