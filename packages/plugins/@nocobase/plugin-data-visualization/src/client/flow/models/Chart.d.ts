/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { EChartsOption, EChartsType } from 'echarts';
export interface ChartOptions {
  option: EChartsOption;
  dataSource: any;
  onRefReady?: (chart: EChartsType) => void;
  loading?: boolean;
}
export declare const Chart: React.ForwardRefExoticComponent<ChartOptions & React.RefAttributes<EChartsType>>;
