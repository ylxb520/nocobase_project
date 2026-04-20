/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ExtendCollectionsProvider, TableBlockProvider } from '@nocobase/client';
import React from 'react';
import { useAuditChangesCollection, useAuditLogsCollection, useCollectionsCollection } from './collections';
export const AuditLogsBlockProvider = ({ children, ...restProps }) => {
  const auditChangesCollection = useAuditChangesCollection();
  const auditLogsCollection = useAuditLogsCollection();
  const collectionsCollection = useCollectionsCollection();
  return React.createElement(
    ExtendCollectionsProvider,
    { collections: [auditLogsCollection, auditChangesCollection, collectionsCollection] },
    React.createElement(TableBlockProvider, { name: 'audit-logs', ...restProps }, children),
  );
};
//# sourceMappingURL=AuditLogsBlockProvider.js.map
