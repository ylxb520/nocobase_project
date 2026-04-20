import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer, reaction } from '@nocobase/flow-engine';
import React from 'react';
import { Outlet } from 'react-router-dom';
class HomeModel extends FlowModel {
  #disposer = null;
  onMount() {
    this.#disposer = reaction(
      () => this.context.route, // 观察的字段
      (route, oldRoute) => {
        if (route?.path === '/posts/:name') {
          this.context.modal.info({
            title: 'Route Changed',
            content: `Route changed from ${route?.pathname} to ${oldRoute?.pathname}`,
          });
        }
      },
    );
  }
  onUnmount() {
    if (this.#disposer) {
      this.#disposer(); // 取消 reaction 监听
      this.#disposer = null;
    }
  }
  render() {
    const { route } = this.context;
    return React.createElement(
      'div',
      null,
      React.createElement('h1', null, 'HomeModel - ', route.pathname),
      React.createElement('p', null, 'Welcome to the Home Page!'),
      React.createElement('p', null, 'This is a simple example of a FlowModel in NocoBase.'),
      React.createElement(
        'p',
        null,
        React.createElement(
          'a',
          {
            onClick: (e) => {
              e.preventDefault();
              this.context.router.navigate('/posts/slug-1');
            },
          },
          'Go to post-1',
        ),
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'a',
          {
            onClick: (e) => {
              e.preventDefault();
              this.context.router.navigate('/posts/slug-2');
            },
          },
          'Go to post-2',
        ),
      ),
      React.createElement(Outlet, null),
    );
  }
}
class PostModel extends FlowModel {
  render() {
    const { route } = this.context;
    return React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        React.createElement(
          'a',
          {
            onClick: (e) => {
              e.preventDefault();
              this.context.router.navigate('/');
            },
          },
          'Go back to Home Page',
        ),
      ),
      React.createElement('pre', null, JSON.stringify(route, null, 2)),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    // 注册 HelloModel 到 flowEngine
    this.flowEngine.registerModels({ HomeModel, PostModel });
    // 创建 HelloModel 的实例（仅用于示例）
    const homeModel = this.flowEngine.createModel({
      use: 'HomeModel',
    });
    const postModel = this.flowEngine.createModel({
      use: 'PostModel',
    });
    // 添加路由，将模型渲染到根路径（仅用于示例）
    this.router.add('home', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: homeModel }),
    });
    this.router.add('home.post', {
      path: '/posts/:name',
      element: React.createElement(FlowModelRenderer, { model: postModel }),
    });
  }
}
// 创建应用实例，注册插件（仅用于示例）
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=reaction.js.map
