import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
import { Card, Space } from 'antd';
class PluginOnlyLeafSelectableExample extends Plugin {
  async load() {
    const OnlyLeafSelectableExample = () => {
      const [value1, setValue1] = useState('');
      const [value2, setValue2] = useState('');
      const flowContext = new FlowContext();
      flowContext.defineProperty('user', {
        value: { profile: { name: 'John', age: 30 }, settings: { theme: 'dark' } },
        meta: {
          title: 'User',
          type: 'object',
          properties: {
            profile: {
              title: 'Profile',
              type: 'object',
              properties: {
                name: { title: 'Name', type: 'string' },
                age: { title: 'Age', type: 'number' },
              },
            },
            settings: {
              title: 'Settings',
              type: 'object',
              properties: {
                theme: { title: 'Theme', type: 'string' },
              },
            },
          },
        },
      });
      return React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Space,
          { direction: 'vertical', style: { width: '100%' }, size: 'large' },
          React.createElement(
            Card,
            { title: '\u5141\u8BB8\u9009\u62E9\u6240\u6709\u8282\u70B9 (\u9ED8\u8BA4)', size: 'small' },
            React.createElement(
              Space,
              { direction: 'vertical', style: { width: '100%' } },
              React.createElement(VariableInput, {
                value: value1,
                onChange: setValue1,
                metaTree: () => flowContext.getPropertyMetaTree(),
                onlyLeafSelectable: false,
                style: { width: 300 },
              }),
              React.createElement('div', null, React.createElement('code', null, JSON.stringify(value1))),
            ),
          ),
          React.createElement(
            Card,
            { title: '\u4EC5\u5141\u8BB8\u9009\u62E9\u53F6\u5B50\u8282\u70B9', size: 'small' },
            React.createElement(
              Space,
              { direction: 'vertical', style: { width: '100%' } },
              React.createElement(VariableInput, {
                value: value2,
                onChange: setValue2,
                metaTree: () => flowContext.getPropertyMetaTree(),
                onlyLeafSelectable: true,
                style: { width: 300 },
              }),
              React.createElement('div', null, React.createElement('code', null, JSON.stringify(value2))),
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
