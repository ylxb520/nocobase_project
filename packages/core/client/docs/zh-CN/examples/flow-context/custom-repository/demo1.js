import { Application, Plugin } from '@nocobase/client';
import { observable, observer, useFlowContext } from '@nocobase/flow-engine';
import { useRequest } from 'ahooks';
import { Button } from 'antd';
import React from 'react';
const HelloRepository = observer(() => {
  const ctx = useFlowContext();
  const { loading } = useRequest(async () => {
    await ctx.customRepository.refresh();
  });
  if (loading) {
    return React.createElement('div', null, 'Loading...');
  }
  return React.createElement(
    'div',
    null,
    React.createElement(
      Button,
      {
        onClick: async () => {
          await ctx.customRepository.refresh();
        },
      },
      'Refresh',
    ),
    React.createElement(
      'div',
      null,
      ctx.customRepository.getItems().map((item) => React.createElement('div', { key: item.id }, item.name)),
    ),
  );
});
class CustomRepository {
  context;
  items = observable.shallow([]);
  constructor(context) {
    this.context = context;
  }
  async create(item) {
    this.items.push(item);
  }
  async refresh() {
    // 清空旧数据
    this.items.splice(0, this.items.length);
    // 随机生成 5 个 item，方便观察变化
    const items = Array.from({ length: 5 }, () => ({
      id: Math.random().toString(36).substring(2, 15),
      name: `Item ${Math.random().toString(36).substring(2, 8)}`,
    }));
    this.items.push(...items);
  }
  getItems() {
    return this.items;
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.engine.flowSettings.forceEnable();
    this.engine.context.defineProperty('customRepository', {
      value: new CustomRepository(this.engine.context),
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(HelloRepository, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=demo1.js.map
