/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { APIClient } from '@nocobase/sdk';
import { FlowContext } from '../flowContext';
import { FlowResource } from './flowResource';
export declare class APIResource<TData = any> extends FlowResource<TData> {
  protected request: any;
  protected api: APIClient;
  constructor(context?: FlowContext);
  setAPIClient(api: APIClient): this;
  getURL(): string;
  setURL(value: string): this;
  get loading(): boolean;
  set loading(value: boolean);
  clearRequestParameters(): this;
  setRequestParameters(params: Record<string, any>): this;
  setRequestMethod(method: string): this;
  addRequestHeader(key: string, value: string): this;
  removeRequestHeader(key: string): this;
  addRequestParameter(key: string, value: any): this;
  getRequestParameter(key: string): any;
  removeRequestParameter(key: string): this;
  setRequestBody(data: any): this;
  setRequestOptions(key: string, value: any): this;
  getRequestOptions(): any;
  refresh(): Promise<void>;
  protected getRefreshRequestOptions(): any;
}
