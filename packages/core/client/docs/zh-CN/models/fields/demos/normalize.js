import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
const dateTimestamp = dayjs('2024-01-01').valueOf();
export default function App() {
  const [form] = Form.useForm();
  return React.createElement(
    Form,
    { form: form, layout: 'vertical', initialValues: { date: dateTimestamp } },
    React.createElement(
      Form.Item,
      {
        label: 'Date',
        name: 'date',
        rules: [{ required: true }],
        getValueProps: (value) => ({ value: value && dayjs(Number(value)) }),
        normalize: (value) => value && `${dayjs(value).valueOf()}`,
      },
      React.createElement(DatePicker, null),
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
//# sourceMappingURL=normalize.js.map
