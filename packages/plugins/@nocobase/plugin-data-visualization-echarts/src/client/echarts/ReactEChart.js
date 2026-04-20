/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useSetChartSize } from '@nocobase/plugin-data-visualization/client';
import { useGlobalTheme } from '@nocobase/client';
export const EChart = (props) => {
  let instance;
  const { size = {}, lightTheme = 'walden', darkTheme = 'defaultDark', ...option } = props;
  let { height: fixedHeight } = props;
  if (!fixedHeight && size.type === 'fixed') {
    fixedHeight = size.fixed;
  }
  const { chartRef, chartHeight } = useSetChartSize(size, fixedHeight);
  const { isDarkTheme } = useGlobalTheme();
  return React.createElement(
    'div',
    { ref: chartRef, style: { height: `${chartHeight || 400}px` } },
    React.createElement(ReactECharts, {
      option: option,
      theme: isDarkTheme ? darkTheme : lightTheme,
      style: { height: `${chartHeight || 400}px` },
      ref: (e) => (instance = e),
    }),
  );
};
//# sourceMappingURL=ReactEChart.js.map
