import { tStr } from '../../../../locale';
import { InitializerWithSwitch, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';
import { stepsFormNextActionSettings } from './settings';
import { useStepsFormContext } from '../../../schemaComponents/context';
export const useStepsFormNextActionProps = () => {
  const context = useStepsFormContext();
  return {
    disabled: context.currentStep === context.stepsCount - 1,
    async onClick() {
      context.nextStep();
    },
  };
};
const ActionInitializer = (props) => {
  const itemConfig = useSchemaInitializerItem();
  return React.createElement(InitializerWithSwitch, { ...itemConfig, ...props, item: itemConfig, type: 'x-action' });
};
export const nextActionInitializerItem = {
  type: 'item',
  name: 'next',
  title: tStr('Next'),
  Component: ActionInitializer,
  schema: {
    type: 'void',
    title: tStr('Next'),
    'x-component': 'Action',
    'x-settings': stepsFormNextActionSettings.name,
    'x-use-component-props': 'useStepsFormNextActionProps',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-action': `stepsform:next`,
  },
};
//# sourceMappingURL=initializer.js.map
