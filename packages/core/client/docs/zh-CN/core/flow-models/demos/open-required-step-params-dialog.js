import { Application, Plugin } from '@nocobase/client';
import { FlowModel } from '@nocobase/flow-engine';
import { Button, Card, Space, message } from 'antd';
import React, { useState } from 'react';
class DemoFlowModel extends FlowModel {}
// 注册包含必填参数的流程
DemoFlowModel.registerFlow('configFlow', {
  title: '配置流程',
  steps: {
    // 数据源配置 - 必填参数
    setDataSource: {
      title: '数据源配置',
      paramsRequired: true,
      uiSchema: {
        dataSource: {
          type: 'string',
          title: '数据源',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: [
            { label: '主数据源', value: 'main' },
            { label: '用户数据源', value: 'users' },
            { label: '订单数据源', value: 'orders' },
            { label: '产品数据源', value: 'products' },
          ],
          required: true,
        },
      },
      defaultParams: {
        dataSource: 'main',
      },
      handler(ctx, params) {
        console.log('设置数据源:', params);
        ctx.model.setProps('dataSource', params.dataSource);
      },
    },
    // 数据表配置 - 必填参数
    setCollection: {
      title: '数据表配置',
      paramsRequired: true,
      uiSchema: {
        collection: {
          type: 'string',
          title: '数据表',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: [
            { label: '用户表', value: 'users' },
            { label: '角色表', value: 'roles' },
            { label: '权限表', value: 'permissions' },
            { label: '部门表', value: 'departments' },
          ],
          required: true,
        },
      },
      defaultParams: {
        collection: 'users',
      },
      handler(ctx, params) {
        console.log('设置数据表:', params);
        ctx.model.setProps('collection', params.collection);
      },
    },
    // 标题配置 - 必填参数
    setTitle: {
      title: '标题配置',
      paramsRequired: true,
      uiSchema: {
        title: {
          type: 'string',
          title: '区块标题',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          required: true,
        },
        subtitle: {
          type: 'string',
          title: '副标题',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
      defaultParams: {
        title: '数据区块',
        subtitle: '',
      },
      handler(ctx, params) {
        console.log('设置标题:', params);
        ctx.model.setProps('title', params.title);
        ctx.model.setProps('subtitle', params.subtitle);
      },
    },
    // 可选配置 - 不是必填参数
    setOptionalConfig: {
      title: '可选配置',
      paramsRequired: false,
      uiSchema: {
        showBorder: {
          type: 'boolean',
          title: '显示边框',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
        },
        extraInfo: {
          type: 'string',
          title: '额外信息',
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
        },
      },
      defaultParams: {
        showBorder: true,
        extraInfo: '可选信息',
      },
      handler(ctx, params) {
        console.log('设置可选配置:', params);
        ctx.model.setProps('showBorder', params.showBorder);
        ctx.model.setProps('extraInfo', params.extraInfo);
      },
    },
  },
});
// 演示组件
const Demo = () => {
  const [model, setModel] = useState(null);
  const handleCreateModel = async () => {
    try {
      // 创建一个新的模型实例
      const model = app.flowEngine.createModel({
        use: 'DemoFlowModel',
        uid: `configurable-model-${Date.now()}`,
      });
      const result = await model.configureRequiredSteps();
      message.success('参数配置完成！');
      console.log('configuration:', model.stepParams);
      setModel(model);
    } catch (error) {
      console.error('配置过程中出现错误:', error);
      message.error('配置过程中出现错误');
    }
  };
  return React.createElement(
    'div',
    { style: { padding: 24, background: '#f5f5f5', borderRadius: 8 } },
    React.createElement(
      Card,
      { title: '\u5206\u6B65\u8868\u5355\u53C2\u6570\u914D\u7F6E\u6F14\u793A' },
      React.createElement(
        'p',
        null,
        '\u8FD9\u4E2A\u6F14\u793A\u5C55\u793A\u4E86 ',
        React.createElement('code', null, 'configureRequiredSteps'),
        ' \u65B9\u6CD5\u7684\u4F7F\u7528\u3002 \u8BE5\u65B9\u6CD5\u4F1A\u5728\u4E00\u4E2A\u5206\u6B65\u8868\u5355\u5BF9\u8BDD\u6846\u4E2D\u663E\u793A\u6240\u6709\u6807\u8BB0\u4E3A',
        ' ',
        React.createElement('code', null, 'paramsRequired: true'),
        ' \u7684\u6B65\u9AA4\u3002',
      ),
      React.createElement(
        Space,
        { direction: 'vertical', style: { width: '100%' } },
        React.createElement(
          Button,
          { type: 'primary', onClick: handleCreateModel },
          '\u521B\u5EFA\u6A21\u578B\u5E76\u914D\u7F6E\u5FC5\u586B\u53C2\u6570',
        ),
        React.createElement(
          'div',
          { style: { marginTop: 16 } },
          React.createElement('h4', null, '\u6D41\u7A0B\u8BF4\u660E\uFF1A'),
          React.createElement(
            'ul',
            null,
            React.createElement(
              'li',
              null,
              React.createElement('strong', null, 'setDataSource'),
              ': \u6570\u636E\u6E90\u914D\u7F6E (\u5FC5\u586B)',
            ),
            React.createElement(
              'li',
              null,
              React.createElement('strong', null, 'setCollection'),
              ': \u6570\u636E\u8868\u914D\u7F6E (\u5FC5\u586B)',
            ),
            React.createElement(
              'li',
              null,
              React.createElement('strong', null, 'setTitle'),
              ': \u6807\u9898\u914D\u7F6E (\u5FC5\u586B)',
            ),
            React.createElement(
              'li',
              null,
              React.createElement('strong', null, 'setOptionalConfig'),
              ': \u53EF\u9009\u914D\u7F6E (\u8DF3\u8FC7)',
            ),
          ),
          React.createElement(
            'p',
            null,
            '\u70B9\u51FB\u201C\u521B\u5EFA\u6A21\u578B\u5E76\u914D\u7F6E\u5FC5\u586B\u53C2\u6570\u201D\u6309\u94AE\u540E\uFF0C\u7CFB\u7EDF\u4F1A\u5728\u4E00\u4E2A\u5206\u6B65\u8868\u5355\u5BF9\u8BDD\u6846\u4E2D \u663E\u793A\u524D\u4E09\u4E2A\u5FC5\u586B\u6B65\u9AA4\uFF0C\u914D\u7F6E\u5B8C\u6210\u540E\u4F1A\u5728\u5361\u7247\u4E2D\u663E\u793A\u5F53\u524D\u7684\u6B65\u9AA4\u53C2\u6570\u3002',
          ),
          model && JSON.stringify(model.stepParams || {}),
        ),
      ),
    ),
  );
};
// 插件定义
class DemoPlugin extends Plugin {
  async load() {
    // 注册模型
    this.app.flowEngine.registerModels({ DemoFlowModel });
    // 注册路由
    this.app.router.add('root', { path: '/', Component: Demo });
  }
}
// 创建应用实例
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [DemoPlugin],
});
export default app.getRootComponent();
//# sourceMappingURL=open-required-step-params-dialog.js.map
