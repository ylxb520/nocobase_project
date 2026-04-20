import { ActionInitializerItem, useCreateActionProps, useUpdateActionProps } from '@nocobase/client';
import { useStepsFormContext } from '../../../schemaComponents/context';
import React from 'react';
import { App } from 'antd';
export const useStepsFormSubmitActionProps = () => {
  const context = useStepsFormContext();
  const propsOfCreate = useCreateActionProps();
  const propsOfupdate = useUpdateActionProps();
  const { message } = App.useApp();
  return {
    // type: 'primary',
    htmlType: 'submit',
    disabled: context.currentStep !== context.stepsCount - 1,
    onClick: async (...arg) => {
      try {
        if (context.isEdit) {
          await propsOfupdate?.onClick(...arg);
        } else {
          await propsOfCreate?.onClick();
        }
        context.setCurrentStep(0);
      } catch (e) {
        const error = e?.[0];
        if (error) {
          const formGraph = context.form.getFormGraph();
          message.warning(`${formGraph?.[error.address]?.title} ${error.messages?.[0]}`);
        }
      }
    },
  };
};
const SubmitActionInitializer = (props) => {
  const ctx = useStepsFormContext();
  const createSchema = {
    title: '{{ t("Submit") }}',
    'x-action': 'submit',
    'x-component': 'Action',
    'x-use-component-props': 'useStepsFormSubmitActionProps',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-settings': 'actionSettings:createSubmit',
    'x-action-settings': {
      triggerWorkflows: [],
    },
    'x-component-props': {
      type: 'primary',
    },
  };
  const updateSchema = {
    ...createSchema,
    'x-settings': 'actionSettings:updateSubmit',
  };
  return React.createElement(ActionInitializerItem, { ...props, schema: ctx.isEdit ? updateSchema : createSchema });
};
export const submitActionInitializerItem = {
  name: 'submit',
  title: '{{t("Submit")}}',
  Component: SubmitActionInitializer,
  schema: {
    'x-action-settings': {},
  },
};
//# sourceMappingURL=initializer.js.map
