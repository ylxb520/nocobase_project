import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
import { Card, Space, Input, InputNumber, DatePicker } from 'antd';
class PluginMultiConstantExample extends Plugin {
  async load() {
    const MultiConstantExample = () => {
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
          paths: ['Constant'],
          type: 'object',
          children: [
            {
              name: 'string',
              title: 'String',
              type: 'string',
              paths: ['Constant', 'string'],
              render: () => React.createElement(Input, null),
            },
            { name: 'number', title: 'Number', type: 'number', paths: ['Constant', 'number'], render: InputNumber },
            { name: 'date', title: 'Date', type: 'string', paths: ['Constant', 'date'], render: DatePicker },
          ],
        });
        return baseMetaTree;
      };
      const converters = {
        resolveValueFromPath: (item) => {
          const path = item?.paths;
          if (!path || path[0] !== 'Constant') return undefined;
          switch (path[1]) {
            case 'string':
              return '';
            case 'number':
              return 0;
            case 'date':
              return null;
            default:
              return null;
          }
        },
      };
      return React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Card,
          { title: 'Multi-Type Constants', size: 'small' },
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
      element: React.createElement(MultiConstantExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginMultiConstantExample],
});
export default app.getRootComponent();
//# sourceMappingURL=multi-constant.js.map
