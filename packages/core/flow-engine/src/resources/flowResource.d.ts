/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowContext } from '../flowContext';
export declare class ResourceError extends Error {
  data: {
    message: string;
    code?: string;
  };
  constructor(error: any);
  get code(): string;
  get message(): string;
}
export declare class FlowResource<TData = any> {
  protected _data: {
    value: TData;
  };
  protected _meta: {
    value: Record<string, any>;
  };
  protected _error: {
    value: ResourceError;
  };
  protected context: FlowContext;
  constructor(context: FlowContext);
  getData(): TData;
  hasData(): boolean;
  setData(value: TData): this;
  getMeta(metaKey?: string): any;
  setMeta(meta: Record<string, any>): this;
  get error(): ResourceError | null;
  getError(): ResourceError | null;
  setError(error: ResourceError | null): this;
  clearError(): this;
  private events;
  on(event: string, callback: (...args: any[]) => void): void;
  once(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}
