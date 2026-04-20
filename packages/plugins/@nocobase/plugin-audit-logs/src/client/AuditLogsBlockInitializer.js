/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { TableOutlined } from '@ant-design/icons';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createAuditLogsBlockSchema } from './createAuditLogsBlockSchema';
export const AuditLogsBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  const itemConfig = useSchemaInitializerItem();
  const schema = createAuditLogsBlockSchema();
  return React.createElement(SchemaInitializerItem, {
    icon: React.createElement(TableOutlined, null),
    onClick: () => {
      insert(schema);
    },
    title: t('Audit Logs'),
    ...itemConfig,
  });
};
//# sourceMappingURL=AuditLogsBlockInitializer.js.map
