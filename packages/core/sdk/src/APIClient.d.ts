/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AxiosInstance, AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { Auth } from './Auth';
import { BaseStorage, LocalStorage, MemoryStorage } from './Storage';
export interface ActionParams {
  filterByTk?: any;
  [key: string]: any;
}
type ResourceActionOptions<P = any> = {
  resource?: string;
  resourceOf?: any;
  action?: string;
  params?: P;
};
type ResourceAction = (params?: ActionParams, opts?: any) => Promise<any>;
export type IResource = {
  [key: string]: ResourceAction;
};
interface ExtendedOptions {
  authClass?: any;
  storageType?: 'localStorage' | 'sessionStorage' | 'memory';
  storageClass?: any;
  storagePrefix?: string;
  appName?: string;
  shareToken?: boolean;
}
export type APIClientOptions = AxiosInstance | (AxiosRequestConfig & ExtendedOptions);
export type RequestOptions = AxiosRequestConfig & {
  skipNotify?: boolean | ((error: any) => boolean);
  skipAuth?: boolean;
};
export declare class APIClient {
  options?: APIClientOptions;
  axios: AxiosInstance;
  auth: Auth;
  storage: BaseStorage;
  storagePrefix: string;
  baseStoragePrefix: string;
  shareToken: boolean;
  toErrMessages(error: any): any;
  getHeaders(): {};
  constructor(options?: APIClientOptions);
  createStorage(storageType: 'localStorage' | 'sessionStorage' | 'memory'): MemoryStorage | LocalStorage;
  private initStorage;
  interceptors(): void;
  request<T = any, R = AxiosResponse<T>, D = any>(
    config: (AxiosRequestConfig<D> | ResourceActionOptions) & {
      skipNotify?: boolean | ((error: any) => boolean);
      skipAuth?: boolean;
    },
  ): Promise<R>;
  resource(name: string, of?: any, headers?: RawAxiosRequestHeaders, cancel?: boolean): IResource;
}
export {};
