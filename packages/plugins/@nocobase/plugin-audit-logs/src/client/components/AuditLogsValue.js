/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { EllipsisWithTooltip, FormProvider, SchemaComponent, useRecord } from '@nocobase/client';
import React from 'react';
import { observer, useField } from '@formily/react';
export const AuditLogsValue = observer(
  () => {
    const field = useField();
    const record = useRecord();
    if (record.field?.uiSchema) {
      return React.createElement(
        FormProvider,
        null,
        React.createElement(SchemaComponent, {
          schema: {
            name: record.field.name,
            ...record.field?.uiSchema,
            default: field.value,
            'x-read-pretty': true,
          },
        }),
      );
    }
    return React.createElement(
      EllipsisWithTooltip,
      { ellipsis: true },
      field.value ? JSON.stringify(field.value) : null,
    );
  },
  { displayName: 'AuditLogsValue' },
);
//# sourceMappingURL=AuditLogsValue.js.map
