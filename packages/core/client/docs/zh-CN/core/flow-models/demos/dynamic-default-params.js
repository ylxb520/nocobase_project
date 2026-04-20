import { Input, Select } from '@formily/antd-v5';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Card, Space, Button } from 'antd';
import React from 'react';
class SimpleProductModel extends FlowModel {
  render() {
    const { name = '新产品', category = 'electronics', price = 0 } = this.props;
    return React.createElement(
      Card,
      { title: name, style: { width: 250, margin: 8 } },
      React.createElement('p', null, React.createElement('strong', null, '\u5206\u7C7B:'), ' ', category),
      React.createElement('p', null, React.createElement('strong', null, '\u4EF7\u683C:'), ' \u00A5', price),
    );
  }
}
// 注册简单的配置流程
SimpleProductModel.registerFlow('configFlow', {
  title: '产品配置',
  steps: {
    // 第一步：设置产品名称和分类
    basicInfo: {
      title: '基础信息',
      uiSchema: {
        name: {
          type: 'string',
          title: '产品名称',
          'x-component': Input,
          'x-decorator': 'FormItem',
        },
        category: {
          type: 'string',
          title: '分类',
          'x-component': Select,
          'x-decorator': 'FormItem',
          enum: [
            { label: '电子产品', value: 'electronics' },
            { label: '服装', value: 'fashion' },
            { label: '图书', value: 'books' },
          ],
        },
      },
      defaultParams: {
        name: '新产品',
        category: 'electronics',
      },
      handler(ctx, params) {
        ctx.model.setProps({
          name: params.name,
          category: params.category,
        });
      },
    },
    // 第二步：设置价格 - 使用动态 defaultParams
    priceConfig: {
      title: '价格设置',
      uiSchema: {
        price: {
          type: 'number',
          title: '价格',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          'x-component-props': {
            min: 0,
          },
        },
      },
      // 🔥 关键：动态 defaultParams - 根据分类自动设置默认价格
      defaultParams: (ctx) => {
        const category = ctx.model.getProps().category || 'electronics';
        const priceMap = {
          electronics: 999,
          fashion: 299,
          books: 49, // 图书默认49元
        };
        return {
          price: priceMap[category] || 199,
        };
      },
      handler(ctx, params) {
        ctx.model.setProps('price', params.price);
      },
    },
  },
});
class PluginDynamicDefaultParams extends Plugin {
  async load() {
    this.flowEngine.registerModels({ SimpleProductModel });
    // 创建一个简单的产品模型
    const model = this.flowEngine.createModel({
      uid: 'simple-product',
      use: 'SimpleProductModel',
      props: { name: '示例产品', category: 'electronics', price: 0 },
    });
    await model.dispatchEvent('beforeRender');
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement('h2', null, '\u52A8\u6001 defaultParams \u6F14\u793A'),
        React.createElement(
          'p',
          null,
          '\u8FD9\u4E2A\u793A\u4F8B\u5C55\u793A\u4E86 defaultParams \u7684\u52A8\u6001\u529F\u80FD\uFF1A',
          React.createElement('br', null),
          '1. \u5148\u8BBE\u7F6E\u4EA7\u54C1\u5206\u7C7B',
          React.createElement('br', null),
          '2. \u518D\u914D\u7F6E\u4EF7\u683C\u65F6\uFF0C\u4F1A\u6839\u636E\u5206\u7C7B\u81EA\u52A8\u8BBE\u7F6E\u4E0D\u540C\u7684\u9ED8\u8BA4\u4EF7\u683C',
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
                  model.setStepParams('configFlow', 'basicInfo', {
                    name: '智能手机',
                    category: 'electronics',
                  });
                  model.applyFlow('configFlow');
                },
              },
              '\u8BBE\u7F6E\u4E3A\u7535\u5B50\u4EA7\u54C1 (\u9ED8\u8BA4\u4EF7\u683C999\u5143)',
            ),
            React.createElement(
              Button,
              {
                onClick: () => {
                  model.setStepParams('configFlow', 'basicInfo', {
                    name: '时尚T恤',
                    category: 'fashion',
                  });
                  model.applyFlow('configFlow');
                },
              },
              '\u8BBE\u7F6E\u4E3A\u670D\u88C5 (\u9ED8\u8BA4\u4EF7\u683C299\u5143)',
            ),
            React.createElement(
              Button,
              {
                onClick: () => {
                  model.setStepParams('configFlow', 'basicInfo', {
                    name: '编程指南',
                    category: 'books',
                  });
                  model.applyFlow('configFlow');
                },
              },
              '\u8BBE\u7F6E\u4E3A\u56FE\u4E66 (\u9ED8\u8BA4\u4EF7\u683C49\u5143)',
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
  plugins: [PluginDynamicDefaultParams],
});
export default app.getRootComponent();
//# sourceMappingURL=dynamic-default-params.js.map
