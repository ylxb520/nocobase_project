/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowContext, FlowEngineContext } from '../flowContext';
import { BaseRecordResource } from './baseRecordResource';
type SQLRunOptions = {
  bind?: Record<string, any>;
  type?: 'selectVar' | 'selectRow' | 'selectRows';
  dataSourceKey?: string;
  filter?: Record<string, any>;
};
type SQLSaveOptions = {
  uid: string;
  sql: string;
  dataSourceKey?: string;
};
export declare class FlowSQLRepository {
  protected ctx: FlowContext;
  constructor(ctx: FlowContext);
  run(sql: string, options?: SQLRunOptions): Promise<any>;
  save(data: SQLSaveOptions): Promise<void>;
  runById(uid: string, options?: SQLRunOptions): Promise<any>;
  destroy(uid: string): Promise<void>;
}
export declare class SQLResource<TData = any> extends BaseRecordResource<TData> {
  protected _data: {
    value: TData;
  };
  protected _meta: {
    value: Record<string, any>;
  };
  private refreshTimer;
  private refreshWaiters;
  private _debugEnabled;
  private _sql;
  protected request: {
    method: string;
    params: Record<string, any>;
    data: Record<string, any>;
    headers: Record<string, any>;
  };
  get refreshActionName(): 'run' | 'runById';
  get supportsFilter(): boolean;
  constructor(context: FlowEngineContext);
  protected buildURL(action?: string): string;
  setPage(page: number): this;
  getPage(): number;
  setPageSize(pageSize: number): this;
  setDebug(enabled: boolean): this;
  getPageSize(): number;
  next(): Promise<void>;
  previous(): Promise<void>;
  goto(page: number): Promise<void>;
  setDataSourceKey(dataSourceKey: string): this;
  setSQLType(type: 'selectRows' | 'selectRow' | 'selectVar'): this;
  setSQL(sql: string): this;
  setFilterByTk(filterByTk: any): this;
  setFilter(filter: Record<string, any>): this;
  setBind(bind: Record<string, any> | Array<any>): this;
  setLiquidContext(liquidContext: Record<string, any>): this;
  run(): Promise<any>;
  runBySQL(): Promise<any>;
  runById(): Promise<any>;
  /**
   * 在同一个事件循环内多次调用 refresh 方法时，只有最后一次调用会生效。避免触发多次相同的接口请求。
   * @returns
   */
  refresh(): Promise<void>;
}
export {};
