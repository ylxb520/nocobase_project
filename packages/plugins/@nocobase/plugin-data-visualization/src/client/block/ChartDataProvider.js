/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
export const ChartDataContext = createContext({});
ChartDataContext.displayName = 'ChartDataContext';
export const ChartDataProvider = (props) => {
  const [charts, setCharts] = useState({});
  const addChart = useMemoizedFn((uid, { dataSource, collection, service, query }) => {
    setCharts((charts) => ({ ...charts, [uid]: { dataSource, collection, service, query } }));
  });
  const removeChart = useMemoizedFn((uid) => {
    setCharts((charts) => ({ ...charts, [uid]: undefined }));
  });
  return React.createElement(ChartDataContext.Provider, { value: { charts, addChart, removeChart } }, props.children);
};
//# sourceMappingURL=ChartDataProvider.js.map
