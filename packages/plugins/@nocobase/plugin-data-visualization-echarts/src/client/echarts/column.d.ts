/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { RenderProps } from '@nocobase/plugin-data-visualization/client';
import { EChart } from './echart';
export declare class Column extends EChart {
  constructor();
  getLabelOptions(config: { labelType: string; series: string; stack: string }): {
    formatter: any;
    show: boolean;
  };
  getProps({ data, general, advanced, fieldProps }: RenderProps): any;
}
