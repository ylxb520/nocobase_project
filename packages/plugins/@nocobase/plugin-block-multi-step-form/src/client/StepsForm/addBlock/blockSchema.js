import { blockSettings } from '../blockSettings';
import { configureActionsInitializer } from '../configureActions';
// import { configureFieldsInitializer } from '../configureFields';
// import { FormV3Props } from '../schemaComponents/FormV3';
import { uid as uidGen } from '@formily/shared';
export function getStepsFormSchema(options) {
  const { dataSource, collection, isEdit, stepTitle, association, isCusomeizeCreate, isCurrent } = options;
  const resourceName = association || collection;
  const isCurrentObj = isCurrent ? { 'x-is-current': true } : {};
  return {
    type: 'void',
    'x-acl-action-props': {
      skipScopeCheck: true,
    },
    'x-acl-action': `${resourceName}:${isEdit ? 'update' : 'create'}`,
    'x-component': 'CardItem',
    'x-settings': blockSettings.name,
    'x-toolbar': 'BlockSchemaToolbar',
    'x-decorator': 'FormBlockProvider',
    'x-decorator-props': {
      action: isEdit ? 'get' : undefined,
      dataSource,
      collection,
      association,
      isCusomeizeCreate,
    },
    'x-use-decorator-props': isEdit ? 'useEditFormBlockDecoratorProps' : 'useCreateFormBlockDecoratorProps',
    ...isCurrentObj,
    properties: {
      step: {
        type: 'void',
        'x-component': 'StepsForm',
        'x-component-props': {
          dataSource,
          collection,
          isEdit,
        },
        properties: {
          step1: getStepsFormStepSchema({ title: stepTitle || 'Step 1', dataSource, collection, isEdit }),
          actionBar: {
            type: 'void',
            'x-initializer': configureActionsInitializer.name,
            'x-component': 'ActionBar',
            'x-component-props': {
              layout: 'one-column',
              style: { marginTop: 24 },
            },
          },
        },
      },
    },
  };
}
export function getStepsFormStepSchema({ title }) {
  const uid = uidGen();
  return {
    type: 'void',
    name: uid,
    'x-component': 'StepsForm.Step',
    'x-component-props': {
      title,
      uid,
    },
    properties: {
      step: {
        type: 'void',
        'x-component': 'StepForm',
        'x-component-props': {
          uid,
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': 'form:configureFields',
            properties: {},
          },
        },
      },
    },
  };
}
//# sourceMappingURL=blockSchema.js.map
