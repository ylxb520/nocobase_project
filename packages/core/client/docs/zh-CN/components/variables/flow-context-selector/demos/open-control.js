import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, FlowContextSelector } from '@nocobase/flow-engine';
import { Button, Card, Space, Switch } from 'antd';
class PluginOpenControlExample extends Plugin {
  async load() {
    const OpenControlExample = () => {
      const [value, setValue] = useState('');
      const [isOpen, setIsOpen] = useState(false);
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
          { title: 'Open State Control', size: 'small' },
          React.createElement(
            Space,
            { direction: 'vertical', style: { width: '100%' } },
            React.createElement(
              'div',
              null,
              React.createElement(
                Space,
                null,
                React.createElement('label', null, 'Controlled Open State: '),
                React.createElement(Switch, {
                  checked: isOpen,
                  onChange: setIsOpen,
                  checkedChildren: 'Open',
                  unCheckedChildren: 'Closed',
                }),
                React.createElement(
                  Button,
                  { type: 'primary', size: 'small', onClick: () => setIsOpen(!isOpen) },
                  'Toggle',
                ),
              ),
            ),
            React.createElement(
              'div',
              null,
              React.createElement(FlowContextSelector, {
                value: value,
                onChange: (val) => setValue(val),
                metaTree: () => flowContext.getPropertyMetaTree(),
                open: isOpen,
                style: { width: 300 },
              }),
            ),
            React.createElement(
              'div',
              null,
              React.createElement('label', null, 'Auto Open/Close (normal behavior): '),
              React.createElement(FlowContextSelector, {
                value: value,
                onChange: (val) => setValue(val),
                metaTree: () => flowContext.getPropertyMetaTree(),
                style: { width: 300 },
              }),
            ),
            React.createElement(
              'div',
              null,
              'Selected Value: ',
              React.createElement('code', null, JSON.stringify(value)),
            ),
            React.createElement('div', null, 'Open State: ', React.createElement('code', null, isOpen.toString())),
          ),
        ),
      );
    };
    this.router.add('root', {
      path: '/',
      element: React.createElement(OpenControlExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginOpenControlExample],
});
export default app.getRootComponent();
//# sourceMappingURL=open-control.js.map
