import { Form, Input } from 'antd';
import Joi from 'joi';
import React from 'react';
const schema = Joi.string().min(3).required();
export default function App() {
  const [form] = Form.useForm();
  return React.createElement(
    Form,
    { form: form, layout: 'vertical', initialValues: {} },
    React.createElement(Form.Item, { name: 'Name', initialValue: '默认值' }, React.createElement(Input, null)),
    React.createElement(Form.Item, { shouldUpdate: true }, () =>
      React.createElement(
        'div',
        null,
        '\u5F53\u524D\u8868\u5355\u503C\uFF1A',
        React.createElement('pre', null, JSON.stringify(form.getFieldsValue(), null, 2)),
      ),
    ),
  );
}
//# sourceMappingURL=initial-value2.js.map
