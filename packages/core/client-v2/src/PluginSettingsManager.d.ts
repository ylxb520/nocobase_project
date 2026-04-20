/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import type { Application } from './Application';
import type { RouteType } from './RouterManager';
export declare const ADMIN_SETTINGS_KEY = 'admin.settings.';
export declare const ADMIN_SETTINGS_PATH = '/admin/settings/';
export declare const SNIPPET_PREFIX = 'pm.';
export interface PluginSettingOptions {
  title: any;
  /**
   * @default Outlet
   */
  Component?: RouteType['Component'];
  icon?: string;
  /**
   * sort, the smaller the number, the higher the priority
   * @default 0
   */
  sort?: number;
  aclSnippet?: string;
  link?: string;
  isTopLevel?: boolean;
  isPinned?: boolean;
  [index: string]: any;
}
export interface PluginSettingsPageType {
  label?: string | React.ReactElement;
  title: string | React.ReactElement;
  link?: string;
  key: string;
  icon: any;
  path: string;
  sort?: number;
  name?: string;
  isAllow?: boolean;
  topLevelName?: string;
  aclSnippet: string;
  children?: PluginSettingsPageType[];
  [index: string]: any;
}
export declare class PluginSettingsManager {
  protected settings: Record<string, PluginSettingOptions>;
  protected aclSnippets: string[];
  app: Application;
  private cachedList;
  constructor(_pluginSettings: Record<string, PluginSettingOptions>, app: Application);
  clearCache(): void;
  setAclSnippets(aclSnippets: string[]): void;
  getAclSnippet(name: string): string;
  getRouteName(name: string): string;
  getRoutePath(name: string): string;
  add(name: string, options: PluginSettingOptions): void;
  remove(name: string): void;
  hasAuth(name: string): boolean;
  getSetting(name: string): PluginSettingOptions;
  has(name: string): boolean;
  get(name: string, filterAuth?: boolean): PluginSettingsPageType;
  getList(filterAuth?: boolean): PluginSettingsPageType[];
  getAclSnippets(): string[];
}
