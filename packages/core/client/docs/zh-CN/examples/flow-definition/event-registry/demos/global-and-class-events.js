import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space, message } from 'antd';
import React from 'react';
// 父类模型
class BaseModel extends FlowModel {
  render() {
    const { globalEventCount = 0, classEventCount = 0 } = this.props;
    return React.createElement(
      Space,
      null,
      React.createElement(
        Button,
        { onClick: () => this.dispatchEvent('globalEvent') },
        '\u89E6\u53D1\u5168\u5C40\u4E8B\u4EF6',
      ),
      React.createElement(
        Button,
        { type: 'primary', onClick: () => this.dispatchEvent('classEvent') },
        '\u89E6\u53D1\u7C7B\u4E8B\u4EF6',
      ),
      React.createElement('div', null, '\u5168\u5C40\u4E8B\u4EF6\u89E6\u53D1: ', globalEventCount),
      React.createElement('div', null, '\u7C7B\u4E8B\u4EF6\u89E6\u53D1: ', classEventCount),
    );
  }
}
// 子类模型
class ChildModel extends BaseModel {
  render() {
    const { globalEventCount = 0, classEventCount = 0, childEventCount = 0 } = this.props;
    return React.createElement(
      Space,
      { direction: 'vertical' },
      React.createElement('div', null, '\u5B50\u7C7B\u6A21\u578B'),
      React.createElement(
        Space,
        null,
        React.createElement(Button, { onClick: () => this.dispatchEvent('globalEvent') }, '\u5168\u5C40\u4E8B\u4EF6'),
        React.createElement(
          Button,
          { onClick: () => this.dispatchEvent('classEvent') },
          '\u7EE7\u627F\u7684\u7C7B\u4E8B\u4EF6',
        ),
        React.createElement(
          Button,
          { type: 'primary', onClick: () => this.dispatchEvent('childEvent') },
          '\u5B50\u7C7B\u4E8B\u4EF6',
        ),
      ),
      React.createElement(
        Space,
        null,
        React.createElement('div', null, '\u5168\u5C40: ', globalEventCount),
        React.createElement('div', null, '\u7EE7\u627F: ', classEventCount),
        React.createElement('div', null, '\u5B50\u7C7B: ', childEventCount),
      ),
    );
  }
}
// 插件类
class PluginGlobalClassEventsDemo extends Plugin {
  async load() {
    // 1. 注册全局 Events（所有模型都可以使用）
    this.flowEngine.registerEvents({
      globalEvent: {
        name: 'globalEvent',
        title: '全局事件',
        handler: (ctx, params) => {
          // 全局事件处理逻辑由流定义中的 handler 处理
        },
      },
    });
    this.flowEngine.registerModels({ BaseModel, ChildModel });
    // 2. 注册父类级别的 Events（BaseModel 及其子类可用）
    BaseModel.registerEvents({
      classEvent: {
        name: 'classEvent',
        title: '基类事件',
        handler: (ctx, params) => {
          // 基类事件处理逻辑由流定义中的 handler 处理
        },
      },
    });
    // 3. 注册子类级别的 Events（仅 ChildModel 可用）
    ChildModel.registerEvents({
      childEvent: {
        name: 'childEvent',
        title: '子类事件',
        handler: (ctx, params) => {
          // 子类事件处理逻辑由流定义中的 handler 处理
        },
      },
      // 覆盖父类的同名事件
      classEvent: {
        name: 'classEvent',
        title: '子类覆盖的类事件',
        handler: (ctx, params) => {
          // 子类覆盖的事件处理逻辑由流定义中的 handler 处理
        },
      },
    });
    // 创建父类模型实例
    const baseModel = this.flowEngine.createModel({
      uid: 'base-model',
      use: 'BaseModel',
    });
    // 创建子类模型实例
    const childModel = this.flowEngine.createModel({
      uid: 'child-model',
      use: 'ChildModel',
    });
    // 父类模型监听全局事件
    baseModel.registerFlow('baseGlobalHandler', {
      title: '基类全局事件处理',
      on: 'globalEvent',
      steps: {
        step1: {
          handler(ctx) {
            const count = ctx.model.props.globalEventCount || 0;
            ctx.model.setProps('globalEventCount', count + 1);
            message.info('基类：全局事件被触发');
          },
        },
      },
    });
    // 父类模型监听类事件
    baseModel.registerFlow('baseClassHandler', {
      title: '基类事件处理',
      on: 'classEvent',
      steps: {
        step1: {
          handler(ctx) {
            const count = ctx.model.props.classEventCount || 0;
            ctx.model.setProps('classEventCount', count + 1);
            message.success('基类：类事件被触发');
          },
        },
      },
    });
    // 子类模型监听全局事件
    childModel.registerFlow('childGlobalHandler', {
      title: '子类全局事件处理',
      on: 'globalEvent',
      steps: {
        step1: {
          handler(ctx) {
            const count = ctx.model.props.globalEventCount || 0;
            ctx.model.setProps('globalEventCount', count + 1);
            message.info('子类：全局事件被触发');
          },
        },
      },
    });
    // 子类模型监听继承的类事件（已被覆盖）
    childModel.registerFlow('childClassHandler', {
      title: '子类事件处理',
      on: 'classEvent',
      steps: {
        step1: {
          handler(ctx) {
            const count = ctx.model.props.classEventCount || 0;
            ctx.model.setProps('classEventCount', count + 1);
            message.success('子类：覆盖的类事件被触发');
          },
        },
      },
    });
    // 子类模型监听自己的事件
    childModel.registerFlow('childOwnHandler', {
      title: '子类专有事件处理',
      on: 'childEvent',
      steps: {
        step1: {
          handler(ctx) {
            const count = ctx.model.props.childEventCount || 0;
            ctx.model.setProps('childEventCount', count + 1);
            message.warning('子类：专有事件被触发');
          },
        },
      },
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Space,
          { direction: 'vertical', size: 'large' },
          React.createElement(
            'div',
            null,
            React.createElement('h3', null, '\u5168\u5C40\u4E0E\u7C7B\u7EA7\u522B\u4E8B\u4EF6\u793A\u4F8B'),
            React.createElement(
              'p',
              null,
              '\u6F14\u793A\u4E8B\u4EF6\u7684\u7EE7\u627F\u673A\u5236\u548C\u8986\u76D6\u673A\u5236',
            ),
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h4', null, '\u7236\u7C7B\u6A21\u578B'),
            React.createElement(FlowModelRenderer, { model: baseModel }),
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h4', null, '\u5B50\u7C7B\u6A21\u578B'),
            React.createElement(FlowModelRenderer, { model: childModel }),
          ),
        ),
      ),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginGlobalClassEventsDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=global-and-class-events.js.map
