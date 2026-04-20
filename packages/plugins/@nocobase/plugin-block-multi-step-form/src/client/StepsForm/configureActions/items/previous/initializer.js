import { tStr } from '../../../../locale';
import { InitializerWithSwitch, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';
import { stepsFormPreviousActionSettings } from './settings';
import { useStepsFormContext } from '../../../schemaComponents/context';
export const useStepsFormPreviousActionProps = () => {
  // const form = useForm();
  const context = useStepsFormContext();
  return {
    disabled: context.currentStep === 0,
    async onClick() {
      // await form.submit();
      context.previousStep();
    },
  };
};
const ActionInitializer = (props) => {
  const itemConfig = useSchemaInitializerItem();
  return React.createElement(InitializerWithSwitch, { ...itemConfig, ...props, item: itemConfig, type: 'x-action' });
};
export const previousActionInitializerItem = {
  type: 'item',
  name: 'previous',
  title: tStr('Previous'),
  Component: ActionInitializer,
  schema: {
    type: 'void',
    title: tStr('Previous'),
    'x-component': 'Action',
    'x-settings': stepsFormPreviousActionSettings.name,
    'x-use-component-props': 'useStepsFormPreviousActionProps',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-action': `stepsform:previous`,
  },
};
//# sourceMappingURL=initializer.js.map
