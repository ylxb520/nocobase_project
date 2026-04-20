/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowEngine, FlowEngineContext, FlowModel } from '@nocobase/flow-engine';
import { APIClient, type APIClientOptions } from '@nocobase/sdk';
import { type i18n as i18next } from 'i18next';
import React, { ComponentType, ReactElement, ReactNode } from 'react';
import type { Plugin } from './Plugin';
import { PluginManager, type PluginType } from './PluginManager';
import { type PluginSettingOptions, PluginSettingsManager } from './PluginSettingsManager';
import { type ComponentTypeAndString, RouterManager, type RouterOptions } from './RouterManager';
import { WebSocketClient, type WebSocketClientOptions } from './WebSocketClient';
import type { RequireJS } from './utils/requirejs';
declare global {
  interface Window {
    define: RequireJS['define'];
  }
}
export type DevDynamicImport = (packageName: string) => Promise<{
  default: typeof Plugin;
}>;
export type ComponentAndProps<T = any> = [ComponentType, T];
export interface ApplicationOptions {
  name?: string;
  publicPath?: string;
  apiClient?: APIClientOptions;
  ws?: WebSocketClientOptions | boolean;
  i18n?: i18next;
  providers?: (ComponentType | ComponentAndProps)[];
  plugins?: PluginType[];
  components?: Record<string, ComponentType>;
  scopes?: Record<string, any>;
  router?: RouterOptions;
  pluginSettings?: Record<string, PluginSettingOptions>;
  designable?: boolean;
  loadRemotePlugins?: boolean;
  devDynamicImport?: DevDynamicImport;
  disableAcl?: boolean;
}
export declare class Application {
  protected options: ApplicationOptions;
  eventBus: EventTarget;
  providers: ComponentAndProps[];
  router: RouterManager;
  scopes: Record<string, any>;
  i18n: i18next;
  ws: WebSocketClient;
  apiClient: APIClient;
  components: Record<string, ComponentType<any> | any>;
  pluginManager: PluginManager;
  pluginSettingsManager: PluginSettingsManager;
  devDynamicImport: DevDynamicImport;
  requirejs: RequireJS;
  name: string;
  favicon: string;
  flowEngine: FlowEngine;
  context: FlowEngineContext & {
    pluginSettingsRouter: PluginSettingsManager;
    pluginManager: PluginManager;
  };
  maintained: boolean;
  maintaining: boolean;
  error: any;
  model: ApplicationModel;
  private wsAuthorized;
  apps: {
    Component?: ComponentType;
  };
  get pm(): PluginManager;
  get disableAcl(): boolean;
  get isWsAuthorized(): boolean;
  updateFavicon(favicon?: string): void;
  setWsAuthorized(authorized: boolean): void;
  constructor(options?: ApplicationOptions);
  private initListeners;
  protected setTokenInWebSocket(options: { token: string; authenticator: string }): void;
  setMaintaining(maintaining: boolean): void;
  private initRequireJs;
  private addDefaultProviders;
  private addReactRouterComponents;
  private addRoutes;
  getOptions(): ApplicationOptions;
  getName(): string;
  getPublicPath(): string;
  getApiUrl(pathname?: string): string;
  getRouteUrl(pathname: string): string;
  getHref(pathname: string): string;
  /**
   * @internal
   */
  getComposeProviders(): React.FC;
  use<T = any>(component: ComponentType, props?: T): number;
  addProvider<T = any>(component: ComponentType, props?: T): number;
  addProviders(providers: (ComponentType | [ComponentType, any])[]): void;
  load(): Promise<void>;
  loadWebSocket(): Promise<void>;
  getComponent<T = any>(Component: ComponentTypeAndString<T>, isShowError?: boolean): ComponentType<T> | undefined;
  renderComponent<T extends {}>(Component: ComponentTypeAndString, props?: T, children?: ReactNode): ReactElement;
  private addComponent;
  addComponents(components: Record<string, ComponentType>): void;
  getRootComponent(): React.FC<{
    children?: React.ReactNode;
  }>;
  mount(containerOrSelector: Element | ShadowRoot | string): import('react-dom/client').Root;
}
declare class ApplicationModel extends FlowModel {
  #private;
  get app(): Application;
  getProviders(): React.FunctionComponent<{}>;
  getRouter(): any;
  render(): React.JSX.Element;
  renderMaintaining(): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  renderError(): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  renderContent(): React.JSX.Element;
}
export {};
