import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
import { Card, Space } from 'antd';
class PluginBasicExample extends Plugin {
  async load() {
    const BasicExample = () => {
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
          { title: 'Basic Usage', size: 'small' },
          React.createElement(
            Space,
            { direction: 'vertical', style: { width: '100%' } },
            React.createElement(VariableInput, {
              value: value,
              onChange: setValue,
              metaTree: () => flowContext.getPropertyMetaTree(),
              style: { width: 300 },
            }),
            React.createElement('div', null, React.createElement('code', null, JSON.stringify(value))),
          ),
        ),
      );
    };
    this.router.add('root', {
      path: '/',
      element: React.createElement(BasicExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginBasicExample],
});
export default app.getRootComponent();
//# sourceMappingURL=basic.js.map
