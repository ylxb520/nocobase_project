import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, SlateVariableEditor } from '@nocobase/flow-engine';
import { Card, Space, Typography, Alert, Tag } from 'antd';
const { Title, Paragraph, Text } = Typography;
class PluginSlateVariableEditorExample extends Plugin {
  async load() {
    const SlateVariableEditorExample = () => {
      const [basicValue, setBasicValue] = useState(
        'Hello {{ctx.user.profile.personal.firstName}}, welcome to {{ctx.system.config.app.name}}!',
      );
      const [multilineValue, setMultilineValue] = useState(`Dear {{ctx.user.name}},

Your account {{ctx.user.email}} has been activated on {{ctx.system.date}}.
You are using version {{ctx.system.version}} of our platform.

Best regards,
The Team`);
      const flowContext = new FlowContext();
      // 添加用户信息变量
      flowContext.defineProperty('user', {
        value: {
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Admin',
          profile: {
            personal: {
              firstName: 'John',
              lastName: 'Doe',
              age: 28,
              avatar: 'https://example.com/avatar.jpg',
            },
            contact: {
              phone: '+1-555-0123',
              address: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
              },
            },
            preferences: {
              language: 'en',
              timezone: 'America/New_York',
              notifications: {
                email: true,
                sms: false,
                push: true,
              },
            },
          },
        },
        meta: {
          title: 'User',
          type: 'object',
          properties: {
            name: { title: 'Name', type: 'string' },
            email: { title: 'Email', type: 'string' },
            role: { title: 'Role', type: 'string' },
            profile: {
              title: 'Profile',
              type: 'object',
              properties: {
                personal: {
                  title: 'Personal Info',
                  type: 'object',
                  properties: {
                    firstName: { title: 'First Name', type: 'string' },
                    lastName: { title: 'Last Name', type: 'string' },
                    age: { title: 'Age', type: 'number' },
                    avatar: { title: 'Avatar URL', type: 'string' },
                  },
                },
                contact: {
                  title: 'Contact Info',
                  type: 'object',
                  properties: {
                    phone: { title: 'Phone', type: 'string' },
                    address: {
                      title: 'Address',
                      type: 'object',
                      properties: {
                        street: { title: 'Street', type: 'string' },
                        city: { title: 'City', type: 'string' },
                        state: { title: 'State', type: 'string' },
                        zipCode: { title: 'Zip Code', type: 'string' },
                        country: { title: 'Country', type: 'string' },
                      },
                    },
                  },
                },
                preferences: {
                  title: 'Preferences',
                  type: 'object',
                  properties: {
                    language: { title: 'Language', type: 'string' },
                    timezone: { title: 'Timezone', type: 'string' },
                    notifications: {
                      title: 'Notifications',
                      type: 'object',
                      properties: {
                        email: { title: 'Email Notifications', type: 'boolean' },
                        sms: { title: 'SMS Notifications', type: 'boolean' },
                        push: { title: 'Push Notifications', type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      // 添加系统变量 (2层嵌套)
      flowContext.defineProperty('system', {
        value: {
          date: new Date().toLocaleDateString(),
          version: '2.0.0',
          platform: 'NocoBase',
          config: {
            name: 'NocoBase App',
            env: 'production',
            debug: false,
          },
        },
        meta: {
          title: 'System',
          type: 'object',
          properties: {
            date: { title: 'Current Date', type: 'string' },
            version: { title: 'Version', type: 'string' },
            platform: { title: 'Platform', type: 'string' },
            config: {
              title: 'Configuration',
              type: 'object',
              properties: {
                name: { title: 'App Name', type: 'string' },
                env: { title: 'Environment', type: 'string' },
                debug: { title: 'Debug Mode', type: 'boolean' },
              },
            },
          },
        },
      });
      // 添加订单信息变量 (2层嵌套)
      flowContext.defineProperty('order', {
        value: {
          id: 'ORD-2024-001',
          amount: 299.99,
          status: 'Completed',
          customer: {
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
          payment: {
            method: 'credit_card',
            status: 'completed',
          },
        },
        meta: {
          title: 'Order',
          type: 'object',
          properties: {
            id: { title: 'Order ID', type: 'string' },
            amount: { title: 'Amount', type: 'number' },
            status: { title: 'Status', type: 'string' },
            customer: {
              title: 'Customer',
              type: 'object',
              properties: {
                name: { title: 'Customer Name', type: 'string' },
                email: { title: 'Email', type: 'string' },
              },
            },
            payment: {
              title: 'Payment',
              type: 'object',
              properties: {
                method: { title: 'Payment Method', type: 'string' },
                status: { title: 'Payment Status', type: 'string' },
              },
            },
          },
        },
      });
      return React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Card,
          { title: 'SlateVariableEditor - \u57FA\u4E8E Slate.js \u7684\u4E13\u4E1A\u7F16\u8F91\u5668', size: 'small' },
          React.createElement(Alert, {
            message: '\uD83C\uDFAF \u63A8\u8350\u4F7F\u7528\u7684\u89E3\u51B3\u65B9\u6848',
            description: React.createElement(
              'span',
              null,
              'SlateVariableEditor \u57FA\u4E8E Slate.js\uFF088.7k+ stars\uFF09\u6784\u5EFA\uFF0C\u5B8C\u7F8E\u96C6\u6210\u4E86 NocoBase \u7684\u7EC4\u4EF6\u751F\u6001\uFF1A',
              React.createElement(
                'ul',
                { style: { marginTop: 8, paddingLeft: 20 } },
                React.createElement(
                  'li',
                  null,
                  '\u4F7F\u7528 ',
                  React.createElement(Tag, { color: 'blue' }, 'FlowContextSelector'),
                  ' \u4F5C\u4E3A\u53D8\u91CF\u9009\u62E9\u5668',
                ),
                React.createElement(
                  'li',
                  null,
                  '\u4F7F\u7528 ',
                  React.createElement(Tag, { color: 'green' }, 'InlineVariableTag'),
                  ' \u4F5C\u4E3A\u53D8\u91CF\u663E\u793A\u7EC4\u4EF6',
                ),
                React.createElement(
                  'li',
                  null,
                  '\u652F\u6301 inline void \u5143\u7D20\uFF0C\u53D8\u91CF\u4F5C\u4E3A\u539F\u5B50\u5355\u4F4D\u4E0D\u53EF\u7F16\u8F91',
                ),
                React.createElement(
                  'li',
                  null,
                  '\u7CBE\u786E\u7684\u5149\u6807\u63A7\u5236\uFF0C\u4E13\u4E1A\u7684\u7F16\u8F91\u4F53\u9A8C',
                ),
                React.createElement(
                  'li',
                  null,
                  '\u5185\u7F6E\u64A4\u9500/\u91CD\u505A\u3001\u952E\u76D8\u5BFC\u822A\u7B49\u9AD8\u7EA7\u529F\u80FD',
                ),
              ),
            ),
            type: 'success',
            showIcon: true,
            style: { marginBottom: 24 },
          }),
          React.createElement(
            Space,
            { direction: 'vertical', style: { width: '100%' }, size: 'large' },
            React.createElement(
              'div',
              null,
              React.createElement(Title, { level: 4 }, '\u57FA\u7840\u793A\u4F8B - \u5355\u884C\u7F16\u8F91'),
              React.createElement(
                Paragraph,
                { type: 'secondary' },
                '\u8F93\u5165 ',
                React.createElement(Text, { code: true }, '{{'),
                ' \u89E6\u53D1\u53D8\u91CF\u9009\u62E9\u5668\uFF0C\u9009\u62E9\u7684\u53D8\u91CF\u5C06\u4EE5\u6807\u7B7E\u5F62\u5F0F\u663E\u793A',
              ),
              React.createElement(SlateVariableEditor, {
                value: basicValue,
                onChange: setBasicValue,
                metaTree: () => flowContext.getPropertyMetaTree(),
                placeholder: '\u8F93\u5165\u6587\u672C\uFF0C\u4F7F\u7528 {{ \u63D2\u5165\u53D8\u91CF',
                style: { width: '100%' },
              }),
              React.createElement(
                'div',
                { style: { marginTop: 12, padding: 12, background: '#f5f5f5', borderRadius: 4 } },
                React.createElement(Text, { type: 'secondary' }, '\u8F93\u51FA\u503C\uFF1A'),
                React.createElement(
                  'pre',
                  { style: { margin: '8px 0 0 0', fontFamily: 'monospace', fontSize: 13 } },
                  basicValue,
                ),
              ),
            ),
            React.createElement(
              'div',
              null,
              React.createElement(Title, { level: 4 }, '\u591A\u884C\u7F16\u8F91\u6A21\u5F0F'),
              React.createElement(
                Paragraph,
                { type: 'secondary' },
                '\u652F\u6301\u591A\u884C\u6587\u672C\u7F16\u8F91\uFF0C\u9002\u5408\u90AE\u4EF6\u6A21\u677F\u3001\u901A\u77E5\u6A21\u677F\u7B49\u573A\u666F',
              ),
              React.createElement(SlateVariableEditor, {
                value: multilineValue,
                onChange: setMultilineValue,
                metaTree: () => flowContext.getPropertyMetaTree(),
                placeholder: '\u7F16\u5199\u90AE\u4EF6\u6A21\u677F\uFF0C\u4F7F\u7528 {{ \u63D2\u5165\u53D8\u91CF',
                multiline: true,
                style: { width: '100%', minHeight: 150 },
              }),
              React.createElement(
                'div',
                { style: { marginTop: 12, padding: 12, background: '#f5f5f5', borderRadius: 4 } },
                React.createElement(Text, { type: 'secondary' }, '\u8F93\u51FA\u503C\uFF1A'),
                React.createElement(
                  'pre',
                  { style: { margin: '8px 0 0 0', fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap' } },
                  multilineValue,
                ),
              ),
            ),
            React.createElement(
              'div',
              null,
              React.createElement(Title, { level: 4 }, '\u6838\u5FC3\u7279\u6027'),
              React.createElement(
                Space,
                { direction: 'vertical', style: { width: '100%' } },
                React.createElement(Alert, {
                  message: '\u53D8\u91CF\u4F5C\u4E3A\u539F\u5B50\u5355\u4F4D',
                  description:
                    '\u53D8\u91CF\u5728\u7F16\u8F91\u5668\u4E2D\u4F5C\u4E3A inline void \u5143\u7D20\uFF0C\u4E0D\u53EF\u76F4\u63A5\u7F16\u8F91\u5185\u5BB9\uFF0C\u53EA\u80FD\u6574\u4F53\u5220\u9664\u6216\u79FB\u52A8',
                  type: 'info',
                }),
                React.createElement(Alert, {
                  message: '\u667A\u80FD\u952E\u76D8\u5BFC\u822A',
                  description:
                    '\u4F7F\u7528\u65B9\u5411\u952E\u5728\u53D8\u91CF\u95F4\u8DF3\u8F6C\uFF0CBackspace \u5220\u9664\u6574\u4E2A\u53D8\u91CF\uFF0CESC \u5173\u95ED\u9009\u62E9\u5668',
                  type: 'info',
                }),
                React.createElement(Alert, {
                  message: '\u5B8C\u6574\u7684\u7F16\u8F91\u529F\u80FD',
                  description:
                    '\u652F\u6301\u64A4\u9500/\u91CD\u505A\uFF08Ctrl+Z/Ctrl+Y\uFF09\u3001\u6587\u672C\u9009\u62E9\u3001\u590D\u5236\u7C98\u8D34\u7B49\u6807\u51C6\u7F16\u8F91\u64CD\u4F5C',
                  type: 'info',
                }),
              ),
            ),
          ),
        ),
      );
    };
    this.router.add('root', {
      path: '/',
      element: React.createElement(SlateVariableEditorExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginSlateVariableEditorExample],
});
export default app.getRootComponent();
//# sourceMappingURL=index.js.map
