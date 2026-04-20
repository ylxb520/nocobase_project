import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
import { Card, Space, Input } from 'antd';
class PluginSingleConstantExample extends Plugin {
  async load() {
    const SingleConstantExample = () => {
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
      const getMetaTree = () => {
        const baseMetaTree = flowContext.getPropertyMetaTree();
        baseMetaTree.splice(0, 0, {
          name: 'Constant',
          title: 'Constant',
          type: 'string',
          paths: ['Constant'],
          render: () => React.createElement(Input, null),
        });
        return baseMetaTree;
      };
      const converters = {
        resolveValueFromPath: (item) => (item?.paths[0] === 'Constant' ? '' : undefined),
      };
      return React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Card,
          { title: 'Single Constant', size: 'small' },
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
      element: React.createElement(SingleConstantExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginSingleConstantExample],
});
export default app.getRootComponent();
//# sourceMappingURL=single-constant.js.map
