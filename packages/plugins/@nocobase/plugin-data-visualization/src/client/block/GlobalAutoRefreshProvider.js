/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
export const GlobalAutoRefreshContext = React.createContext({});
export const GlobalAutoRefreshProvider = (props) => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const charts = useRef({});
  const addChart = useMemoizedFn((uid, { service }) => {
    charts.current[uid] = { service };
  });
  const removeChart = useMemoizedFn((uid) => {
    const chart = charts.current[uid];
    if (!chart) {
      return;
    }
    charts.current[uid] = { service: chart.service, selfAutoRefresh: true };
  });
  const refreshCharts = useMemoizedFn(() => {
    for (const chart of Object.values(charts.current)) {
      chart?.service.refresh();
    }
  });
  useEffect(() => {
    if (!autoRefresh) {
      return;
    }
    const timer = setInterval(() => {
      const refreshCharts = Object.values(charts.current).filter((chart) => !chart.selfAutoRefresh);
      for (const chart of refreshCharts) {
        chart?.service.refresh();
      }
    }, autoRefresh * 1000);
    return () => clearInterval(timer);
  }, [autoRefresh]);
  return React.createElement(
    GlobalAutoRefreshContext.Provider,
    { value: { addChart, removeChart, autoRefresh, setAutoRefresh, refreshCharts } },
    props.children,
  );
};
//# sourceMappingURL=GlobalAutoRefreshProvider.js.map
