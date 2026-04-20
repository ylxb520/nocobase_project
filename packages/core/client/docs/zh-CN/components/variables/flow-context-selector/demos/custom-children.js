import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, FlowContextSelector } from '@nocobase/flow-engine';
import { Button, Card, Space, Tag } from 'antd';
class PluginCustomChildrenExample extends Plugin {
  async load() {
    const CustomChildrenExample = () => {
      const [value, setValue] = useState('');
      const flowContext = new FlowContext();
      flowContext.defineProperty('user', {
        value: { name: 'John', email: 'john@example.com' },
        meta: {
          title: 'User',
          type: 'object',
          properties: {
            name: { title: 'Name', type: 'string' },
            email: { title: 'Email', type: 'string' },
          },
        },
      });
      return React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Card,
          { title: 'Custom Children', size: 'small' },
          React.createElement(
            Space,
            { direction: 'vertical', style: { width: '100%' } },
            React.createElement(
              'div',
              null,
              React.createElement('label', null, 'Custom Button: '),
              React.createElement(
                FlowContextSelector,
                { value: value, onChange: (val) => setValue(val), metaTree: () => flowContext.getPropertyMetaTree() },
                React.createElement(Button, { type: 'primary' }, 'Select Variable'),
              ),
            ),
            React.createElement(
              'div',
              null,
              React.createElement('label', null, 'Custom Tag: '),
              React.createElement(
                FlowContextSelector,
                { value: value, onChange: (val) => setValue(val), metaTree: () => flowContext.getPropertyMetaTree() },
                React.createElement(Tag, { color: 'blue', style: { cursor: 'pointer' } }, value || 'Click to select'),
              ),
            ),
            React.createElement(
              'div',
              null,
              'Selected Value: ',
              React.createElement('code', null, JSON.stringify(value)),
            ),
          ),
        ),
      );
    };
    this.router.add('root', {
      path: '/',
      element: React.createElement(CustomChildrenExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginCustomChildrenExample],
});
export default app.getRootComponent();
//# sourceMappingURL=custom-children.js.map
