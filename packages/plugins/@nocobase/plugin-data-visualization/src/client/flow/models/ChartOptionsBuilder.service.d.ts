/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export type ChartTypeKey = 'line' | 'bar' | 'barHorizontal' | 'pie' | 'doughnut' | 'scatter' | 'area' | 'funnel';
export declare function getChartFormSpec(type: ChartTypeKey): (
  | {
      kind: string;
      name: any;
      labelKey: any;
      options: any;
      required?: undefined;
      allowClear?: undefined;
      placeholderKey?: undefined;
      min?: undefined;
      max?: undefined;
    }
  | {
      kind: string;
      name: any;
      labelKey: any;
      required: boolean;
      allowClear: boolean;
      placeholderKey: string;
      options?: undefined;
      min?: undefined;
      max?: undefined;
    }
  | {
      kind: string;
      name: any;
      labelKey: any;
      options?: undefined;
      required?: undefined;
      allowClear?: undefined;
      placeholderKey?: undefined;
      min?: undefined;
      max?: undefined;
    }
  | {
      kind: string;
      name: any;
      labelKey: any;
      min: any;
      max: any;
      options?: undefined;
      required?: undefined;
      allowClear?: undefined;
      placeholderKey?: undefined;
    }
)[];
export declare function buildFieldOptions(columns?: string[]): {
  label: string;
  value: string;
}[];
export declare function stripInvalidColumns(builder?: {}, columns?: string[]): any;
export declare function normalizeBuilder(builder: any, columns?: string[]): any;
export declare function applyTypeChange(builder: {}, nextType: ChartTypeKey, columns?: string[]): any;
export declare function genRawByBuilder(builder: any): string;
