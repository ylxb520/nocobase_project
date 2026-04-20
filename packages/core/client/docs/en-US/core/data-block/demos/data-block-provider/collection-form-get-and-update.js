import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Select, notification } from 'antd';
import {
  SchemaComponent,
  useDataBlockResource,
  useCollectionRecordData,
  withDynamicSchemaProps,
} from '@nocobase/client';
import useUrlState from '@ahooksjs/use-url-state';
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
  const data = useCollectionRecordData();
  const resource = useDataBlockResource();
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);
  const onFinish = async (values) => {
    console.log('values', values);
    await resource.update({
      filterByTk: data.id,
      values,
    });
    notification.success({
      message: 'Save successfully!',
    });
  };
  return {
    initialValues: data,
    preserve: true,
    onFinish,
    form,
  };
}
const useBlockDecoratorProps = () => {
  const [state] = useUrlState({ id: '1' });
  return {
    filterByTk: state.id,
  };
};
const collection = 'users';
const action = 'get';
const schema = {
  type: 'void',
  name: 'root',
  'x-decorator': 'DataBlockProvider',
  'x-use-decorator-props': 'useBlockDecoratorProps',
  'x-decorator-props': {
    collection: collection,
    action: action,
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
  const [state, setState] = useUrlState({ id: '1' });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Select, {
      defaultValue: state.id,
      options: [
        { key: 1, value: '1', label: 'Bamboo' },
        { key: 2, value: '2', label: 'Mary' },
      ],
      onChange: (v) => {
        setState({ id: v });
      },
    }),
    React.createElement(SchemaComponent, { schema: schema }),
  );
};
const mocks = {
  [`${collection}:${action}`]: function (config) {
    const { filterByTk } = config.params;
    return {
      data:
        Number(filterByTk) === 1
          ? {
              id: 1,
              username: 'Bamboo',
              age: 18,
            }
          : {
              id: 2,
              username: 'Mary',
              age: 25,
            },
    };
  },
  [`${collection}:update`]: function (config) {
    console.log('config.data', config.data);
    return {
      data: 'ok',
    };
  },
};
const Root = createApp(
  Demo,
  {
    components: { DemoForm },
    scopes: { useDemoFormProps, useBlockDecoratorProps },
  },
  mocks,
);
export default Root;
//# sourceMappingURL=collection-form-get-and-update.js.map
