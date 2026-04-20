import { useFlowContext } from '@nocobase/flow-engine';
import { Button, Flex, Form, Input, Space } from 'antd';
import React from 'react';
export const FormComponent = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  const ctx = useFlowContext();
  const { Header, Footer } = ctx.view;
  return React.createElement(
    'div',
    null,
    React.createElement(Header, { title: record ? 'Edit record' : 'Add record' }),
    React.createElement(
      Form,
      { form: form, initialValues: record, layout: 'vertical', colon: true },
      React.createElement(
        Form.Item,
        { label: 'Name', name: 'name', rules: [{ required: true, message: 'Please enter name' }] },
        React.createElement(Input, null),
      ),
      React.createElement(
        Form.Item,
        { label: 'Telephone', name: 'telephone', rules: [{ required: true, message: 'Please enter telephone' }] },
        React.createElement(Input, null),
      ),
      React.createElement(Form.Item, { label: 'Live', name: 'live' }, React.createElement(Input, null)),
      React.createElement(
        Form.Item,
        { label: 'Address', name: 'address' },
        React.createElement(Input.TextArea, { rows: 3 }),
      ),
      React.createElement(Form.Item, { label: 'Remark', name: 'remark' }, React.createElement(Input, null)),
    ),
    React.createElement(
      Footer,
      null,
      React.createElement(
        Flex,
        { justify: 'flex-end', align: 'end' },
        React.createElement(
          Space,
          null,
          React.createElement(
            Button,
            {
              onClick: () => {
                ctx.view.close();
              },
            },
            'Cancel',
          ),
          React.createElement(
            Button,
            {
              type: 'primary',
              onClick: async () => {
                try {
                  const values = await form.validateFields();
                  console.log('Form values:', values);
                  if (record) {
                    await ctx.resource.update(record.id, values);
                  } else {
                    await ctx.resource.create(values);
                  }
                  ctx.message.success('Record save successfully');
                  ctx.view.close();
                } catch (error) {
                  console.error('Validation failed:', error);
                }
              },
            },
            'Submit',
          ),
        ),
      ),
    ),
  );
};
//# sourceMappingURL=FormComponent.js.map
