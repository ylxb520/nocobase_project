import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
import { Card, Space, Input } from 'antd';
class PluginNullOptionExample extends Plugin {
  async load() {
    const NullOptionExample = () => {
      const [value, setValue] = useState(null);
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
      const getMetaTree = () => {
        const baseMetaTree = flowContext.getPropertyMetaTree();
        baseMetaTree.push({
          name: 'null',
          title: 'Null',
          type: 'null',
          paths: ['null'],
          render: () => React.createElement(Input, { readOnly: true, value: '<Null>' }),
        });
        return baseMetaTree;
      };
      const converters = {
        resolveValueFromPath: (item) => (item?.paths[0] === 'null' ? null : undefined),
      };
      return React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Card,
          { title: 'Null Option', size: 'small' },
          React.createElement(
            Space,
            { direction: 'vertical', style: { width: '100%' } },
            React.createElement(VariableInput, {
              value: value,
              onChange: setValue,
              metaTree: getMetaTree,
              converters: converters,
              style: { width: 300 },
            }),
            React.createElement('div', null, React.createElement('code', null, JSON.stringify(value))),
          ),
        ),
      );
    };
    this.router.add('root', {
      path: '/',
      element: React.createElement(NullOptionExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginNullOptionExample],
});
export default app.getRootComponent();
//# sourceMappingURL=null-option.js.map
