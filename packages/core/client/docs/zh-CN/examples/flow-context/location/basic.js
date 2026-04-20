import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import React from 'react';
class HomeModel extends FlowModel {
  render() {
    const location = this.context.location;
    return React.createElement(
      'div',
      null,
      React.createElement('h1', null, 'HomeModel - ', location.pathname),
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
    );
  }
}
class PostModel extends FlowModel {
  render() {
    const location = this.context.location;
    return React.createElement(
      'div',
      null,
      React.createElement('h1', null, 'PostModel - ', location.pathname),
      React.createElement('p', null, 'This is the Post Page.'),
      React.createElement('p', null, 'Here you can find more information about this example.'),
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
    this.router.add('post', {
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
//# sourceMappingURL=basic.js.map
