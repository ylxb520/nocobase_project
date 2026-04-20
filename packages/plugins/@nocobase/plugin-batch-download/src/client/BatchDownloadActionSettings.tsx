/**
 * 批量下载按钮的 Schema Settings
 */
import { SchemaSettings, useSchemaToolbar } from '@nocobase/client';

export const batchDownloadActionSettings = new SchemaSettings({
  name: 'actionSettings:batchDownload',
  items: [
    {
      name: 'editButton',
      type: 'remove',
    },
  ],
});

export default batchDownloadActionSettings;
