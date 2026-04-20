import { Form, Input } from 'antd';
import React from 'react';
const FormItem = ({ disabled, children, ...rest }) => {
  const processedChildren =
    typeof children === 'function'
      ? children
      : React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { disabled });
          }
          return child;
        });
  return React.createElement(Form.Item, { ...rest }, processedChildren);
};
export default function App() {
  const [form] = Form.useForm();
  return React.createElement(
    Form,
    { form: form, layout: 'vertical', initialValues: { name: null } },
    React.createElement(
      FormItem,
      { disabled: true, label: 'Name', name: 'name', initialValue: '默认值' },
      React.createElement(Input, null),
    ),
    React.createElement(FormItem, { shouldUpdate: true }, (form) =>
      React.createElement(
        'div',
        null,
        '\u5F53\u524D\u8868\u5355\u503C\uFF1A',
        React.createElement('pre', null, JSON.stringify(form.getFieldsValue(), null, 2)),
      ),
    ),
  );
}
//# sourceMappingURL=disabled.js.map
