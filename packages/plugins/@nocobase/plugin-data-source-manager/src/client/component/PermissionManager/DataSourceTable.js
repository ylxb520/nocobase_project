/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import {
  SchemaComponent,
  SchemaComponentContext,
  SettingCenterPermissionProvider,
  usePlugin,
  useRecord,
  useRequest,
} from '@nocobase/client';
import { Spin } from 'antd';
import React, { createContext, useContext } from 'react';
import PluginDataSourceManagerClient from '../..';
import { PermissionProvider } from './PermisionProvider';
import { dataSourceSchema } from './schemas/dataSourceTable';
const AvailableActionsContext = createContext([]);
AvailableActionsContext.displayName = 'AvailableActionsContext';
const AvailableActionsProver = (props) => {
  const { data, loading } = useRequest({
    resource: 'availableActions',
    action: 'list',
  });
  if (loading) {
    return React.createElement(Spin, null);
  }
  return React.createElement(AvailableActionsContext.Provider, { value: data?.data }, props.children);
};
export const useAvailableActions = () => {
  return useContext(AvailableActionsContext);
};
const schemaComponentContext = { designable: false };
export const DataSourceTable = () => {
  const record = useRecord();
  const plugin = usePlugin(PluginDataSourceManagerClient);
  return React.createElement(
    'div',
    null,
    React.createElement(
      SchemaComponentContext.Provider,
      { value: schemaComponentContext },
      React.createElement(
        AvailableActionsProver,
        null,
        React.createElement(SchemaComponent, {
          schema: dataSourceSchema(plugin.getExtendedTabs()),
          components: { SettingCenterPermissionProvider, PermissionProvider },
          scope: { dataSourceKey: record.key },
        }),
      ),
    ),
  );
};
//# sourceMappingURL=DataSourceTable.js.map
