/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { EChartsReactProps } from 'echarts-for-react';
import './transform';
import { Chart, ChartProps, ChartType, RenderProps } from '@nocobase/plugin-data-visualization/client';
export declare class EChart extends Chart {
  static lightThemes: string[];
  static darkThemes: string[];
  series?: any;
  constructor({
    name,
    title,
    series,
    config,
  }: {
    name: string;
    title: string;
    series?: any;
    config?: ChartProps['config'];
  });
  static registerTheme(name: string, theme: any, mode?: string): void;
  init: ChartType['init'];
  getBasicOptions({ general }: { general: any }): {
    grid: any;
    animation: boolean;
    size: any;
    lightTheme: any;
    darkTheme: any;
  };
  getLegendOptions(config: {
    showLegend: boolean;
    legendOrient: 'horizontal' | 'vertical';
    legendPosition: {
      left: string;
      bottom: string;
      right: string;
      top: string;
    };
  }): any;
  getLabelOptions(config: { labelType: string; series: string; [key: string]: any }): {
    formatter: string;
    show: boolean;
  };
  getProps({ data, general, advanced, fieldProps }: RenderProps): EChartsReactProps['option'];
  getReference(): {
    title: string;
    link: string;
  };
}
