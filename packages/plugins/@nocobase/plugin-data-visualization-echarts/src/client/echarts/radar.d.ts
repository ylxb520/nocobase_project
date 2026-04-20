/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ChartType, RenderProps } from '@nocobase/plugin-data-visualization/client';
import { EChart } from './echart';
export declare class Radar extends EChart {
  constructor();
  init: ChartType['init'];
  getProps({ data, general, advanced, fieldProps }: RenderProps): {
    legend: any;
    tooltip: {};
    radar: {
      shape: any;
      indicator: any[];
      radius: any;
      center: any[];
    };
    series: any;
    animation: boolean;
    size: any;
    lightTheme: any;
    darkTheme: any;
  };
}
