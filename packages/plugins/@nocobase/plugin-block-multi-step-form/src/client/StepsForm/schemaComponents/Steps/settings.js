import { SchemaSettings } from '@nocobase/client';
import { useT } from '../../../locale';
import { useStepsFormContext } from '../context';
import { useFieldSchema } from '@formily/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SchemaSettingsModalItem, SchemaSettingsItem } from '@nocobase/client';
function SchemaSettingsStepTitleItem() {
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const ctx = useStepsFormContext();
  return React.createElement(SchemaSettingsModalItem, {
    title: t('Edit'),
    schema: {
      type: 'object',
      title: t('Edit'),
      properties: {
        title: {
          title: t('Title'),
          type: 'string',
          default: fieldSchema?.['x-content'],
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    },
    onSubmit: ({ title }) => {
      ctx.changeStepTitle(fieldSchema.name, title);
    },
  });
}
function SchemaSettingDeleteItem() {
  const t = useT();
  const ctx = useStepsFormContext();
  const fieldSchema = useFieldSchema();
  return React.createElement(SchemaSettingsItem, {
    title: t('Delete'),
    onClick: () => {
      ctx.deleteStep(fieldSchema.name);
    },
  });
}
export const stepsFormStepTitleSettings = new SchemaSettings({
  name: `settings:stepsFormStepTitleSettings`,
  items: [
    {
      name: 'SchemaSettingsStepTitleItem',
      Component: SchemaSettingsStepTitleItem,
    },
    {
      name: 'SchemaSettingDeleteItem',
      Component: SchemaSettingDeleteItem,
    },
  ],
});
//# sourceMappingURL=settings.js.map
