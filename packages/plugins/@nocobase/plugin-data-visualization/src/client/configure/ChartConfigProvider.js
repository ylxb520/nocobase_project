/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext, useState } from 'react';
import { ChartRendererProvider } from '../renderer';
import { ChartConfigure } from './ChartConfigure';
import { useDesignable } from '@nocobase/client';
export const ChartConfigContext = createContext({
  visible: true,
});
ChartConfigContext.displayName = 'ChartConfigContext';
export const ChartConfigProvider = (props) => {
  const { insertAdjacent } = useDesignable();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  return React.createElement(
    ChartConfigContext.Provider,
    { value: { visible, setVisible, current, setCurrent } },
    props.children,
    React.createElement(
      ChartRendererProvider,
      { ...current.field?.decoratorProps, disableAutoRefresh: true },
      React.createElement(ChartConfigure, {
        insert: (schema, options) => insertAdjacent('beforeEnd', schema, options),
      }),
    ),
  );
};
//# sourceMappingURL=ChartConfigProvider.js.map
