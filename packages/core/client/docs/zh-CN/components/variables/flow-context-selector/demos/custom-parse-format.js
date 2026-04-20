import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, FlowContextSelector } from '@nocobase/flow-engine';
import { Card, Space, Divider } from 'antd';
class PluginCustomParseFomatExample extends Plugin {
  async load() {
    const CustomParseFormatExample = () => {
      const [value1, setValue1] = useState('');
      const [value2, setValue2] = useState('');
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
      // Custom parse function: convert "user.name" -> ["user", "name"]
      const customParseValueToPath = (value) => {
        if (!value || typeof value !== 'string') return undefined;
        // Remove custom prefix and parse
        const cleaned = value.replace(/^CUSTOM_/, '');
        return cleaned.split('.');
      };
      // Custom format function: convert meta -> "CUSTOM_user.name"
      const customFormatPathToValue = (metaTreeNode) => {
        if (!metaTreeNode?.paths) return undefined;
        return `CUSTOM_${metaTreeNode.paths.join('.')}`;
      };
      return React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Card,
          { title: 'Custom Parse & Format Functions', size: 'small' },
          React.createElement(
            Space,
            { direction: 'vertical', style: { width: '100%' } },
            React.createElement(
              'div',
              null,
              React.createElement('label', null, 'Default formatting: '),
              React.createElement(FlowContextSelector, {
                value: value1,
                onChange: (val) => setValue1(val),
                metaTree: () => flowContext.getPropertyMetaTree(),
                style: { width: 300 },
              }),
            ),
            React.createElement(
              'div',
              null,
              'Default Value: ',
              React.createElement('code', null, JSON.stringify(value1)),
            ),
            React.createElement(Divider, null),
            React.createElement(
              'div',
              null,
              React.createElement('label', null, 'Custom formatting: '),
              React.createElement(FlowContextSelector, {
                value: value2,
                onChange: (val) => setValue2(val),
                metaTree: () => flowContext.getPropertyMetaTree(),
                parseValueToPath: customParseValueToPath,
                formatPathToValue: customFormatPathToValue,
                style: { width: 300 },
              }),
            ),
            React.createElement(
              'div',
              null,
              'Custom Value: ',
              React.createElement('code', null, JSON.stringify(value2)),
            ),
            React.createElement(
              'div',
              { style: { fontSize: '12px', color: '#666', marginTop: 16 } },
              React.createElement('strong', null, '\u8BF4\u660E\uFF1A'),
              React.createElement('br', null),
              '\u2022 parseValueToPath: \u5C06\u8F93\u5165\u503C\u89E3\u6790\u4E3A\u8DEF\u5F84\u6570\u7EC4\uFF08\u5982 "CUSTOM_user.name" \u2192 ["user", "name"]\uFF09',
              React.createElement('br', null),
              '\u2022 formatPathToValue: \u5C06\u9009\u4E2D\u7684\u8282\u70B9\u683C\u5F0F\u5316\u4E3A\u8F93\u51FA\u503C\uFF08\u5982 paths=["user","name"] \u2192 "CUSTOM_user.name"\uFF09',
            ),
          ),
        ),
      );
    };
    this.router.add('root', {
      path: '/',
      element: React.createElement(CustomParseFormatExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginCustomParseFomatExample],
});
export default app.getRootComponent();
//# sourceMappingURL=custom-parse-format.js.map
