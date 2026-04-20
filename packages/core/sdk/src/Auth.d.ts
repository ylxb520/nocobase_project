/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { APIClient } from './APIClient';
export declare class Auth {
  protected api: APIClient;
  get storagePrefix(): string;
  protected options: {
    locale: any;
    role: any;
    authenticator: any;
    token: any;
  };
  constructor(api: APIClient);
  get locale(): string;
  set locale(value: string);
  get role(): string;
  set role(value: string);
  get token(): string;
  set token(value: string);
  get authenticator(): string;
  set authenticator(value: string);
  /**
   * @internal
   */
  getOption(key: string): string;
  /**
   * @internal
   */
  setOption(key: string, value?: string): void;
  /**
   * @internal
   * use {@link Auth#locale} instead
   */
  getLocale(): string;
  /**
   * @internal
   * use {@link Auth#locale} instead
   */
  setLocale(locale: string): void;
  /**
   * @internal
   * use {@link Auth#role} instead
   */
  getRole(): string;
  /**
   * @internal
   * use {@link Auth#role} instead
   */
  setRole(role: string): void;
  /**
   * @internal
   * use {@link Auth#token} instead
   */
  getToken(): string;
  /**
   * @internal
   * use {@link Auth#token} instead
   */
  setToken(token: string): void;
  /**
   * @internal
   * use {@link Auth#authenticator} instead
   */
  getAuthenticator(): string;
  /**
   * @internal
   * use {@link Auth#authenticator} instead
   */
  setAuthenticator(authenticator: string): void;
  middleware(config: AxiosRequestConfig): AxiosRequestConfig<any>;
  signIn(values: any, authenticator?: string): Promise<AxiosResponse<any>>;
  signUp(values: any, authenticator?: string): Promise<AxiosResponse<any>>;
  signOut(): Promise<AxiosResponse<any, any>>;
  lostPassword(values: any): Promise<AxiosResponse<any>>;
  resetPassword(values: any): Promise<AxiosResponse<any>>;
  checkResetToken(values: any): Promise<AxiosResponse<any>>;
}
