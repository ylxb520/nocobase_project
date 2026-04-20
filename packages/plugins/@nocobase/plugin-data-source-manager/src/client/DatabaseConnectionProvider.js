/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SchemaComponentOptions } from '@nocobase/client';
import React, { useState, createContext } from 'react';
import * as hooks from './hooks';
export const DataSourceContext = createContext(null);
DataSourceContext.displayName = 'DataSourceContext';
export const DatabaseConnectionProvider = (props) => {
  const [dataSource, setDataSource] = useState(null);
  return React.createElement(
    DataSourceContext.Provider,
    { value: { dataSource, setDataSource } },
    React.createElement(SchemaComponentOptions, { scope: hooks, components: {} }, props.children),
  );
};
//# sourceMappingURL=DatabaseConnectionProvider.js.map
