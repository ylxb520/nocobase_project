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
export declare class MultiRecordResource<TDataItem = any> extends BaseRecordResource<TDataItem[]> {
  protected _data: {
    value: TDataItem[];
  };
  protected _meta: {
    value: Record<string, any>;
  };
  private refreshTimer;
  private refreshWaiters;
  protected createActionOptions: {};
  protected updateActionOptions: {};
  protected _refreshActionName: string;
  protected request: {
    method: string;
    params: Record<string, any>;
    headers: Record<string, any>;
  };
  get supportsFilter(): boolean;
  setCreateActionOptions(options: AxiosRequestConfig): this;
  setUpdateActionOptions(options: AxiosRequestConfig): this;
  setSelectedRows(selectedRows: TDataItem[]): this;
  getSelectedRows(): TDataItem[];
  getCount(): number;
  setPage(page: number): this;
  getPage(): number;
  setPageSize(pageSize: number): this;
  getPageSize(): number;
  getTotalPage(): number;
  getCell(rowIndex: number, columnKey: string): TDataItem | undefined;
  next(): Promise<void>;
  previous(): Promise<void>;
  goto(page: number): Promise<void>;
  create(
    data: TDataItem,
    options?: AxiosRequestConfig & {
      refresh?: boolean;
    },
  ): Promise<void>;
  get(filterByTk: any): Promise<TDataItem | undefined>;
  update(filterByTk: string | number, data: Partial<TDataItem>, options?: AxiosRequestConfig): Promise<void>;
  destroySelectedRows(): Promise<void>;
  destroy(
    filterByTk: string | number | string[] | number[] | TDataItem | TDataItem[] | object,
    options?: AxiosRequestConfig,
  ): Promise<void>;
  setItem(index: number, newDataItem: TDataItem): void;
  /**
   * 在同一个事件循环内多次调用 refresh 方法时，只有最后一次调用会生效。避免触发多次相同的接口请求。
   * @returns
   */
  refresh(): Promise<void>;
}
