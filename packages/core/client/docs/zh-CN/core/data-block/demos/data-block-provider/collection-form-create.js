import React from 'react';
import { Button, Form, Input, InputNumber, notification } from 'antd';
import { SchemaComponent, useDataBlockResource, withDynamicSchemaProps } from '@nocobase/client';
import { createApp } from '../../../data-source/demos/createApp';
const DemoForm = withDynamicSchemaProps((props) => {
  return React.createElement(
    Form,
    { labelCol: { span: 8 }, wrapperCol: { span: 16 }, style: { maxWidth: 600 }, autoComplete: 'off', ...props },
    React.createElement(
      Form.Item,
      { label: 'Username', name: 'username', rules: [{ required: true, message: 'Please input your username!' }] },
      React.createElement(Input, null),
    ),
    React.createElement(
      Form.Item,
      { label: 'Age', name: 'age', rules: [{ required: true, message: 'Please input your age!' }] },
      React.createElement(InputNumber, null),
    ),
    React.createElement(
      Form.Item,
      { wrapperCol: { offset: 8, span: 16 } },
      React.createElement(Button, { type: 'primary', htmlType: 'submit' }, 'Submit'),
    ),
  );
});
function useDemoFormProps() {
  const resource = useDataBlockResource();
  const onFinish = async (values) => {
    console.log('values', values);
    await resource.create({
      values,
    });
    notification.success({
      message: 'Save successfully!',
    });
  };
  return {
    onFinish,
  };
}
const collection = 'users';
const schema = {
  type: 'void',
  name: 'root',
  'x-decorator': 'DataBlockProvider',
  'x-decorator-props': {
    collection: collection,
  },
  'x-component': 'CardItem',
  properties: {
    demo: {
      type: 'object',
      'x-component': 'DemoForm',
      'x-use-component-props': 'useDemoFormProps',
    },
  },
};
const Demo = () => {
  return React.createElement(SchemaComponent, { schema: schema });
};
const mocks = {
  [`${collection}:create`]: (config) => {
    console.log('config.data', config.data);
    return [200, { msg: 'ok' }];
  },
};
const Root = createApp(
  Demo,
  {
    components: { DemoForm },
    scopes: { useDemoFormProps },
  },
  mocks,
);
export default Root;
//# sourceMappingURL=collection-form-create.js.map
