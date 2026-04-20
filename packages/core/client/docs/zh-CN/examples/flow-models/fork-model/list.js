import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Avatar, List } from 'antd';
import React from 'react';
const data = [
  {
    id: 1,
    title: 'Ant Design Title 1',
    description: 'Ant Design 1, a design language for background applications, is refined by Ant UED Team',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
  },
  {
    id: 2,
    title: 'Ant Design Title 2',
    description: 'Ant Design 2, a design language for background applications, is refined by Ant UED Team',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
  },
  {
    id: 3,
    title: 'Ant Design Title 3',
    description: 'Ant Design 3, a design language for background applications, is refined by Ant UED Team',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
  },
  {
    id: 4,
    title: 'Ant Design Title 4',
    description: 'Ant Design 4, a design language for background applications, is refined by Ant UED Team',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
  },
];
class HelloModel extends FlowModel {
  render() {
    return React.createElement(List, {
      itemLayout: 'horizontal',
      dataSource: data,
      renderItem: (item, index) => {
        const fork = this.subModels.sub1.createFork({}, item.id.toString());
        fork.setItem(item); // 将当前项传递给子模型
        return React.createElement(FlowModelRenderer, { key: item.id, model: fork, showFlowSettings: true });
      },
    });
  }
}
class HelloSubModel extends FlowModel {
  item;
  setItem(item) {
    this.item = item;
  }
  render() {
    return React.createElement(
      List.Item,
      null,
      React.createElement(List.Item.Meta, {
        avatar: React.createElement(Avatar, { src: this.item.avatar }),
        title: React.createElement('a', { href: 'https://ant.design' }, this.item.title),
        description: this.item.description,
      }),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    // 注册 HelloModel 到 flowEngine
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloModel, HelloSubModel });
    // 创建 HelloModel 的实例（仅用于示例）
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      subModels: {
        sub1: {
          use: 'HelloSubModel',
        },
      },
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
//# sourceMappingURL=list.js.map
