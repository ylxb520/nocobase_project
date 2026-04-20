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
export declare class Funnel extends EChart {
  constructor();
  init: ChartType['init'];
  getProps({ data, general, advanced, fieldProps }: RenderProps): {
    grid: any;
    animation: boolean;
    size: any;
    lightTheme: any;
    darkTheme: any;
    legend: any;
    tooltip: {};
    dataset: (
      | {
          source: Record<string, any>[];
          transform?: undefined;
        }
      | {
          transform: {
            type: string;
            config: {
              fieldProps: {
                [field: string]: {
                  label: string;
                  transformer: import('../../../../plugin-data-visualization/src/client/transformers').Transformer;
                  interface: string;
                };
              };
            };
          };
          source?: undefined;
        }
    )[];
    series: any;
  };
}
