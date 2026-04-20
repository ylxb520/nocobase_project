/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ChildPageModel, DataBlockModel } from '@nocobase/client';
import { SQLResource } from '@nocobase/flow-engine';
import React from 'react';
import { ChartOptions } from './Chart';
import { ChartResource } from '../resources/ChartResource';
type ChartBlockModelStructure = {
  subModels: {
    page: ChildPageModel;
  };
};
type ChartProps = {
  chart: ChartOptions & {
    optionRaw?: string;
  };
};
export declare class ChartBlockModel extends DataBlockModel<ChartBlockModelStructure> {
  props: ChartProps;
  _previousStepParams: any;
  get resource(): ChartResource<any> | SQLResource<any>;
  private __onResourceRefresh;
  onActive(): void;
  refresh(): Promise<void>;
  initResource(mode?: string): void;
  getResourceSettingsInitParams(): any;
  onInit(options: any): Promise<void>;
  renderComponent(): React.JSX.Element;
  getFilterFields(): Promise<
    {
      name: string;
      title: string;
      type: string;
      interface: string;
      target?: string;
      filterable?: {
        operators: {
          label: string;
          value: string;
        }[];
      };
    }[]
  >;
  checkResource(query: any): void;
  applyQuery(query: any): void;
  setDataResult(): void;
  applyChartOptions(payload: { mode: 'basic' | 'custom'; builder?: any; raw?: string }): Promise<void>;
  applyEvents(raw?: string): Promise<void>;
  renderChart(): void;
  onPreview(
    params: {
      query: any;
      chart: any;
    },
    needQueryData?: boolean,
  ): Promise<void>;
  cancelPreview(): Promise<void>;
}
export {};
