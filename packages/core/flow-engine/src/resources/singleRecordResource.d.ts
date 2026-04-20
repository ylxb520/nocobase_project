/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AxiosRequestConfig } from 'axios';
import { BaseRecordResource } from './baseRecordResource';
export declare class SingleRecordResource<TData = any> extends BaseRecordResource<TData> {
  isNewRecord: boolean;
  protected saveActionOptions: {};
  protected _refreshActionName: string;
  get supportsFilter(): boolean;
  setSaveActionOptions(options: AxiosRequestConfig): this;
  setFilterByTk(filterByTk: any): this;
  save(
    data: TData,
    options?: AxiosRequestConfig & {
      refresh?: boolean;
    },
  ): Promise<void>;
  destroy(options?: AxiosRequestConfig): Promise<void>;
  refresh(): Promise<void>;
}
