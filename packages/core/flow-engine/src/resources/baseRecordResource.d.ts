/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AxiosRequestConfig } from 'axios';
import { APIResource } from './apiResource';
import { FilterItem } from './filterItem';
export declare abstract class BaseRecordResource<TData = any> extends APIResource<TData> {
  protected resourceName: string;
  protected sourceId: string | number | null;
  protected request: {
    method: string;
    params: Record<string, any>;
    headers: Record<string, any>;
  };
  protected updateAssociationValues: string[];
  protected runActionOptions: {};
  protected filterGroups: Map<string, any>;
  protected _refreshActionName: string;
  get supportsFilter(): boolean;
  setRefreshAction(refreshActionName: string): void;
  mergeRequestConfig(...args: AxiosRequestConfig[]): AxiosRequestConfig;
  setRunActionOptions(action: string, options: AxiosRequestConfig): this;
  protected splitValue(value: string | string[]): string[];
  protected buildURL(action?: string): string;
  runAction<TData = any, TMeta = any>(action: string, options: any): Promise<any>;
  setResourceName(resourceName: string): this;
  getResourceName(): string;
  /**
   * Mark current resource as dirty on the root FlowEngine.
   * Used to coordinate "refresh on active" across view stacks.
   */
  protected markDataSourceDirty(resourceName?: string): void;
  setSourceId(sourceId: string | number): this;
  getSourceId(): string | number;
  setDataSourceKey(dataSourceKey: string): this;
  getDataSourceKey(): string;
  setFilter(filter: Record<string, any>): this;
  getFilter(): Record<string, any>;
  resetFilter(): void;
  addFilterGroup(key: string, filter: FilterItem | Record<string, any>): void;
  removeFilterGroup(key: string): void;
  setAppends(appends: string[]): this;
  getAppends(): string[];
  addAppends(appends: string | string[]): this;
  removeAppends(appends: string | string[]): this;
  getUpdateAssociationValues(): string[];
  addUpdateAssociationValues(updateAssociationValues: string | string[]): this;
  jsonStringify(value: any): string;
  setFilterByTk(filterByTk: any): this;
  getFilterByTk(): any;
  setFields(fields: string[] | string): this;
  getFields(): string[];
  setSort(sort: string | string[]): this;
  getSort(): string[];
  setExcept(except: string | string[]): this;
  getExcept(): string[];
  setWhitelist(whitelist: string | string[]): this;
  getWhitelist(): string[];
  setBlacklist(blacklist: string | string[]): this;
  getBlacklist(): string[];
  abstract refresh(): Promise<void>;
}
