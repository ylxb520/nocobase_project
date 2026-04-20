/**
 * defaultShowCode: false
 * title: 字段赋值（支持不同类型的 Constant）
 */
import React, { useState } from 'react';
import { Application, Plugin } from '@nocobase/client';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
import { Card, Space, Input, InputNumber, DatePicker, Form } from 'antd';
class PluginAssignFieldsExample extends Plugin {
  async load() {
    const AssignFieldsExample = () => {
      const [formValues, setFormValues] = useState({
        name: '',
        age: 0,
        email: '',
        birthdate: '',
        salary: 0,
      });
      const flowContext = React.useMemo(() => {
        const ctx = new FlowContext();
        ctx.defineProperty('user', {
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
        ctx.defineProperty('org', {
          value: { title: 'Engineering', budget: 100000 },
          meta: {
            title: 'Organization',
            type: 'object',
            properties: {
              title: { title: 'Title', type: 'string' },
              budget: { title: 'Budget', type: 'number' },
            },
          },
        });
        return ctx;
      }, []);
      // 为不同类型的字段创建对应的 metaTree 和 converters
      const createFieldConfig = (fieldType) => {
        const getMetaTree = () => {
          const baseMetaTree = flowContext.getPropertyMetaTree();
          // 添加 Null 选项
          baseMetaTree.splice(0, 0, {
            name: 'Null',
            title: 'Null',
            type: 'null',
            paths: ['Null'],
            render: () =>
              React.createElement(Input, { readOnly: true, placeholder: '<Null>', style: { color: '#999' } }),
          });
          // 根据字段类型添加不同的 Constant 选项
          if (fieldType === 'string') {
            baseMetaTree.splice(0, 0, {
              name: 'Constant',
              title: 'Constant',
              type: 'string',
              paths: ['Constant'],
              render: () => React.createElement(Input, { placeholder: '\u8F93\u5165\u6587\u672C\u5E38\u91CF' }),
            });
          } else if (fieldType === 'number') {
            baseMetaTree.splice(0, 0, {
              name: 'Constant',
              title: 'Constant',
              type: 'number',
              paths: ['Constant'],
              render: () =>
                React.createElement(InputNumber, {
                  placeholder: '\u8F93\u5165\u6570\u5B57\u5E38\u91CF',
                  style: { width: '100%' },
                }),
            });
          } else if (fieldType === 'date') {
            baseMetaTree.splice(0, 0, {
              name: 'Constant',
              title: 'Constant',
              type: 'date',
              paths: ['Constant'],
              render: () =>
                React.createElement(DatePicker, {
                  placeholder: '\u9009\u62E9\u65E5\u671F\u5E38\u91CF',
                  style: { width: '100%' },
                }),
            });
          }
          return baseMetaTree;
        };
        const converters = {
          // 根据选中的节点类型动态渲染输入组件
          renderInputComponent: (metaTreeNode) => {
            if (metaTreeNode) {
              return metaTreeNode.render;
            }
            if (fieldType === 'number') {
              return InputNumber;
            }
            if (fieldType === 'date') {
              return DatePicker;
            }
            return Input;
          },
          resolveValueFromPath: (item) => {
            if (item?.paths[0] === 'Constant') {
              return fieldType === 'number' ? 0 : '';
            }
            if (item?.paths[0] === 'Null') {
              return null;
            }
            return undefined;
          },
        };
        return { getMetaTree, converters };
      };
      const stringFieldConfig = createFieldConfig('string');
      const numberFieldConfig = createFieldConfig('number');
      const dateFieldConfig = createFieldConfig('date');
      const handleFieldChange = (fieldName, value) => {
        setFormValues((prev) => ({ ...prev, [fieldName]: value }));
      };
      return React.createElement(
        'div',
        { style: { padding: 20 } },
        React.createElement(
          Card,
          { title: '\u5B57\u6BB5\u8D4B\u503C\u793A\u4F8B', size: 'small' },
          React.createElement(
            Space,
            { direction: 'vertical', style: { width: '100%' }, size: 'large' },
            React.createElement(
              Form,
              { layout: 'vertical', style: { maxWidth: 600 } },
              React.createElement(
                Form.Item,
                { label: '\u59D3\u540D\uFF08\u6587\u672C\u5B57\u6BB5\uFF09', required: true },
                React.createElement(VariableInput, {
                  value: formValues.name,
                  onChange: (value) => handleFieldChange('name', value),
                  metaTree: stringFieldConfig.getMetaTree,
                  converters: stringFieldConfig.converters,
                  style: { width: '100%' },
                  placeholder: '\u9009\u62E9\u53D8\u91CF\u6216\u8F93\u5165\u5E38\u91CF',
                }),
              ),
              React.createElement(
                Form.Item,
                { label: '\u5E74\u9F84\uFF08\u6570\u5B57\u5B57\u6BB5\uFF09', required: true },
                React.createElement(VariableInput, {
                  value: formValues.age,
                  onChange: (value) => handleFieldChange('age', value),
                  metaTree: numberFieldConfig.getMetaTree,
                  converters: numberFieldConfig.converters,
                  style: { width: '100%' },
                  placeholder: '\u9009\u62E9\u53D8\u91CF\u6216\u8F93\u5165\u6570\u5B57\u5E38\u91CF',
                }),
              ),
              React.createElement(
                Form.Item,
                { label: '\u90AE\u7BB1\uFF08\u6587\u672C\u5B57\u6BB5\uFF09' },
                React.createElement(VariableInput, {
                  value: formValues.email,
                  onChange: (value) => handleFieldChange('email', value),
                  metaTree: stringFieldConfig.getMetaTree,
                  converters: stringFieldConfig.converters,
                  style: { width: '100%' },
                  placeholder: '\u9009\u62E9\u53D8\u91CF\u6216\u8F93\u5165\u90AE\u7BB1\u5E38\u91CF',
                }),
              ),
              React.createElement(
                Form.Item,
                { label: '\u751F\u65E5\uFF08\u65E5\u671F\u5B57\u6BB5\uFF09' },
                React.createElement(VariableInput, {
                  value: formValues.birthdate,
                  onChange: (value) => handleFieldChange('birthdate', value),
                  metaTree: dateFieldConfig.getMetaTree,
                  converters: dateFieldConfig.converters,
                  style: { width: '100%' },
                  placeholder: '\u9009\u62E9\u53D8\u91CF\u6216\u9009\u62E9\u65E5\u671F\u5E38\u91CF',
                }),
              ),
              React.createElement(
                Form.Item,
                { label: '\u85AA\u8D44\uFF08\u6570\u5B57\u5B57\u6BB5\uFF09' },
                React.createElement(VariableInput, {
                  value: formValues.salary,
                  onChange: (value) => handleFieldChange('salary', value),
                  metaTree: numberFieldConfig.getMetaTree,
                  converters: numberFieldConfig.converters,
                  style: { width: '100%' },
                  placeholder: '\u9009\u62E9\u53D8\u91CF\u6216\u8F93\u5165\u85AA\u8D44\u5E38\u91CF',
                }),
              ),
            ),
            React.createElement(
              Card,
              { size: 'small', title: '\u5F53\u524D\u8868\u5355\u503C', style: { backgroundColor: '#fafafa' } },
              React.createElement(
                'pre',
                { style: { marginTop: 8, fontSize: '12px' } },
                JSON.stringify(formValues, null, 2),
              ),
            ),
          ),
        ),
      );
    };
    this.router.add('root', {
      path: '/',
      element: React.createElement(AssignFieldsExample, null),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginAssignFieldsExample],
});
export default app.getRootComponent();
//# sourceMappingURL=assign-fields.js.map
