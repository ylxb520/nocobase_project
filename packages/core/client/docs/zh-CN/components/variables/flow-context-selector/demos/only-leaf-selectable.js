import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, FlowContextSelector } from '@nocobase/flow-engine';
import { Card, Space, Alert } from 'antd';
class PluginOnlyLeafSelectableExample extends Plugin {
  async load() {
    const OnlyLeafSelectableExample = () => {
      const [value1, setValue1] = useState('');
      const [value2, setValue2] = useState('');
      const flowContext = new FlowContext();
      flowContext.defineProperty('user', {
        value: {
          name: 'John',
          email: 'john@example.com',
          profile: {
            age: 30,
            department: 'Engineering',
          },
        },
        meta: {
          title: 'User',
          type: 'object',
          properties: {
            name: { title: 'Name', type: 'string' },
            email: { title: 'Email', type: 'string' },
            profile: {
              title: 'Profile',
              type: 'object',
              properties: {
                age: { title: 'Age', type: 'number' },
                department: { title: 'Department', type: 'string' },
              },
            },
          },
        },
      });
      flowContext.defineProperty('config', {
        value: 'production',
        meta: {
          title: 'Config',
          type: 'string',
        },
      });
      return React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Card,
          { title: 'Only Leaf Selectable', size: 'small' },
          React.createElement(
            Space,
            { direction: 'vertical', style: { width: '100%' } },
            React.createElement(Alert, {
              message: 'onlyLeafSelectable=false (default)',
              description:
                "\u5141\u8BB8\u9009\u62E9\u975E\u53F6\u5B50\u8282\u70B9\uFF08\u5982 'user' \u5BF9\u8C61\uFF09\uFF0C\u53EF\u4EE5\u901A\u8FC7\u53CC\u51FB\u9009\u62E9\u4E2D\u95F4\u8282\u70B9",
              type: 'info',
              showIcon: true,
            }),
            React.createElement(
              'div',
              null,
              React.createElement('label', null, 'Default behavior: '),
              React.createElement(FlowContextSelector, {
                value: value1,
                onChange: (val) => setValue1(val),
                metaTree: () => flowContext.getPropertyMetaTree(),
                onlyLeafSelectable: false,
                style: { width: 300 },
              }),
            ),
            React.createElement(
              'div',
              null,
              'Selected Value: ',
              React.createElement('code', null, JSON.stringify(value1)),
            ),
            React.createElement(Alert, {
              message: 'onlyLeafSelectable=true',
              description:
                "\u53EA\u5141\u8BB8\u9009\u62E9\u53F6\u5B50\u8282\u70B9\uFF08\u5982 'name', 'email' \u7B49\u5177\u4F53\u5B57\u6BB5\uFF09\uFF0C\u4E0D\u80FD\u9009\u62E9\u5BF9\u8C61\u8282\u70B9",
              type: 'warning',
              showIcon: true,
            }),
            React.createElement(
              'div',
              null,
              React.createElement('label', null, 'Only leaf selectable: '),
              React.createElement(FlowContextSelector, {
                value: value2,
                onChange: (val) => setValue2(val),
                metaTree: () => flowContext.getPropertyMetaTree(),
                onlyLeafSelectable: true,
                style: { width: 300 },
              }),
            ),
            React.createElement(
              'div',
              null,
              'Selected Value: ',
              React.createElement('code', null, JSON.stringify(value2)),
            ),
          ),
        ),
      );
    };
    this.router.add('root', {
      path: '/',
      element: React.createElement(OnlyLeafSelectableExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginOnlyLeafSelectableExample],
});
export default app.getRootComponent();
//# sourceMappingURL=only-leaf-selectable.js.map
