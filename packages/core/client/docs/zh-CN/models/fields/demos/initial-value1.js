import { Form, Input } from 'antd';
import React from 'react';
export default function App() {
  const [form] = Form.useForm();
  return React.createElement(
    Form,
    { form: form, layout: 'vertical', initialValues: { name: null } },
    React.createElement(
      Form.Item,
      { label: 'Name', name: 'name', initialValue: '默认值' },
      React.createElement(Input, null),
    ),
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
//# sourceMappingURL=initial-value1.js.map
