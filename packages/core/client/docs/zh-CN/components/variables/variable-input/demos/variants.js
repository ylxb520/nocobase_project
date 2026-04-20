import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
import { Card, Space, Typography } from 'antd';
const { Text } = Typography;
class PluginVariableFormsExample extends Plugin {
  async load() {
    const VariableFormsExample = () => {
      const [withInputValue, setWithInputValue] = useState('');
      const [selectorOnlyValue, setSelectorOnlyValue] = useState('');
      const flowContext = new FlowContext();
      flowContext.defineProperty('user', {
        value: { name: 'John', email: 'john@example.com', age: 30 },
        meta: {
          title: 'User',
          type: 'object',
          properties: {
            name: { title: 'Name', type: 'string' },
            email: { title: 'Email', type: 'string' },
            age: { title: 'Age', type: 'number' },
          },
        },
      });
      flowContext.defineProperty('system', {
        value: { version: '1.0.0', mode: 'production' },
        meta: {
          title: 'System',
          type: 'object',
          properties: {
            version: { title: 'Version', type: 'string' },
            mode: { title: 'Mode', type: 'string' },
          },
        },
      });
      return React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Space,
          { direction: 'vertical', size: 'large', style: { width: '100%' } },
          React.createElement(
            Card,
            { title: '\u663E\u793AValue\u7EC4\u4EF6\u5F62\u6001', size: 'small' },
            React.createElement(
              Space,
              { direction: 'vertical', style: { width: '100%' } },
              React.createElement(
                Text,
                { type: 'secondary' },
                'showValueComponent=true - \u663E\u793A\u503C\u7EC4\u4EF6\u548C\u9009\u62E9\u5668',
              ),
              React.createElement(VariableInput, {
                value: withInputValue,
                onChange: setWithInputValue,
                metaTree: () => flowContext.getPropertyMetaTree(),
                showValueComponent: true,
                style: { width: 300 },
                placeholder: '\u8F93\u5165\u503C\u6216\u9009\u62E9\u53D8\u91CF',
              }),
              React.createElement(
                'div',
                null,
                React.createElement(Text, { strong: true }, '\u5F53\u524D\u503C\uFF1A'),
                React.createElement('code', null, JSON.stringify(withInputValue)),
              ),
            ),
          ),
          React.createElement(
            Card,
            { title: '\u4E0D\u663E\u793AValue\u7EC4\u4EF6\u5F62\u6001', size: 'small' },
            React.createElement(
              Space,
              { direction: 'vertical', style: { width: '100%' } },
              React.createElement(
                Text,
                { type: 'secondary' },
                'showValueComponent=false - \u53EA\u663E\u793A\u9009\u62E9\u5668',
              ),
              React.createElement(VariableInput, {
                value: selectorOnlyValue,
                onChange: setSelectorOnlyValue,
                metaTree: () => flowContext.getPropertyMetaTree(),
                showValueComponent: false,
                style: { width: 300 },
              }),
              React.createElement(
                'div',
                null,
                React.createElement(Text, { strong: true }, '\u5F53\u524D\u503C\uFF1A'),
                React.createElement('code', null, JSON.stringify(selectorOnlyValue)),
              ),
            ),
          ),
        ),
      );
    };
    this.router.add('root', {
      path: '/',
      element: React.createElement(VariableFormsExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginVariableFormsExample],
});
export default app.getRootComponent();
//# sourceMappingURL=variants.js.map
