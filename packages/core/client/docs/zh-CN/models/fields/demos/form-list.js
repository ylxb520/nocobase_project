import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import React from 'react';
const App = () => {
  const [form] = Form.useForm();
  return React.createElement(
    Form,
    { form: form, autoComplete: 'off' },
    React.createElement(Form.List, { name: 'users' }, (fields, { add, remove }, errors) =>
      React.createElement(
        React.Fragment,
        null,
        fields.map(({ key, name, ...restField }) =>
          React.createElement(
            Space,
            { key: key, align: 'baseline' },
            React.createElement(
              Form.Item,
              // {...restField}
              {
                // {...restField}
                name: [name, 'first'],
                rules: [{ required: true, message: 'Missing first name' }],
              },
              React.createElement(Input, { placeholder: 'First Name' }),
            ),
            React.createElement(
              Form.Item,
              // {...restField}
              {
                // {...restField}
                name: [name, 'last'],
                rules: [{ required: true, message: 'Missing last name' }],
              },
              React.createElement(Input, { placeholder: 'Last Name' }),
            ),
            React.createElement(MinusCircleOutlined, { onClick: () => remove(name) }),
          ),
        ),
        React.createElement(
          Form.Item,
          null,
          React.createElement(
            Button,
            { type: 'dashed', onClick: () => add(), block: true, icon: React.createElement(PlusOutlined, null) },
            'Add field',
          ),
        ),
      ),
    ),
    React.createElement(Form.Item, { shouldUpdate: true }, () =>
      React.createElement(
        'div',
        null,
        '\u5F53\u524D\u8868\u5355\u503C\uFF1A',
        React.createElement('pre', null, JSON.stringify(form.getFieldsValue(), null, 2)),
      ),
    ),
    React.createElement(
      Form.Item,
      null,
      React.createElement(Button, { type: 'primary', htmlType: 'submit' }, 'Submit'),
    ),
  );
};
export default App;
//# sourceMappingURL=form-list.js.map
