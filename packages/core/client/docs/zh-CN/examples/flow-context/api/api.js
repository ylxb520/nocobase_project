import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Descriptions } from 'antd';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
class HelloBlockModel extends FlowModel {
  render() {
    return React.createElement(Descriptions, { title: 'User Info', items: this.props.items });
  }
}
HelloBlockModel.registerFlow({
  key: 'api-example',
  title: 'API Example',
  steps: {
    fetchData: {
      handler: async (ctx) => {
        // 使用 ctx.api.request 发起 GET 请求
        const response = await ctx.api.request({
          method: 'get',
          url: '/users:get',
        });
        // 假设接口返回原始数据
        const user = response.data.data;
        // 转换为 Descriptions 需要的 items 结构
        ctx.model.setProps({
          items: [
            { key: '1', label: 'UserName', children: React.createElement('p', null, user.name) },
            { key: '2', label: 'Telephone', children: React.createElement('p', null, user.telephone) },
            { key: '3', label: 'Live', children: React.createElement('p', null, user.live) },
            { key: '4', label: 'Remark', children: React.createElement('p', null, user.remark) },
            { key: '5', label: 'Address', children: React.createElement('p', null, user.address) },
          ],
        });
      },
    },
  },
});
class PluginHelloModel extends Plugin {
  async load() {
    const mock = new MockAdapter(this.app.apiClient.axios);
    mock.onGet('/users:get').reply(200, {
      data: {
        name: 'Zhou Maomao',
        telephone: '1810000000',
        live: 'Hangzhou, Zhejiang',
        remark: 'empty',
        address: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
      },
    });
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloBlockModel });
    const model = this.flowEngine.createModel({
      uid: 'my-model',
      use: 'HelloBlockModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
// 创建应用实例，注册插件
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=api.js.map
