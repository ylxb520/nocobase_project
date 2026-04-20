import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';
export const BatchDownloadActionInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const schema = {
    type: 'void',
    title: '{{t("Batch download attachments", { ns: "plugin-batch-download" })}}',
    'x-action': 'batchDownload',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-settings': 'actionSettings:batchDownload',
    'x-component': 'Action',
    'x-use-component-props': 'useBatchDownloadActionProps',
    'x-component-props': {
      type: 'primary',
      icon: 'DownloadOutlined',
    },
    'x-align': 'right',
  };
  return React.createElement(SchemaInitializerItem, {
    title: itemConfig.title,
    onClick: () => {
      insert(schema);
    },
  });
};
//# sourceMappingURL=BatchDownloadActionInitializer.js.map
