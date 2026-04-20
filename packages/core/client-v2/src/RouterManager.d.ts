/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { ComponentType } from 'react';
import {
  type BrowserRouterProps,
  type HashRouterProps,
  type MemoryRouterProps,
  type RouteObject,
} from 'react-router-dom';
import { Application } from './Application';
export interface BrowserRouterOptions extends Omit<BrowserRouterProps, 'children'> {
  type?: 'browser';
}
export interface HashRouterOptions extends Omit<HashRouterProps, 'children'> {
  type?: 'hash';
}
export interface MemoryRouterOptions extends Omit<MemoryRouterProps, 'children'> {
  type?: 'memory';
}
export type RouterOptions = (HashRouterOptions | BrowserRouterOptions | MemoryRouterOptions) & {
  renderComponent?: RenderComponentType;
  routes?: Record<string, RouteType>;
};
export type ComponentTypeAndString<T = any> = ComponentType<T> | string;
export interface RouteType extends Omit<RouteObject, 'children' | 'Component'> {
  Component?: ComponentTypeAndString;
  skipAuthCheck?: boolean;
}
export type RenderComponentType = (Component: ComponentTypeAndString, props?: any) => React.ReactNode;
export declare class RouterManager {
  protected routes: Record<string, RouteType>;
  protected options: RouterOptions;
  app: Application;
  router: any;
  get basename(): any;
  get state(): any;
  get navigate(): any;
  constructor(options: RouterOptions, app: Application);
  /**
   * @internal
   */
  getRoutesTree(): RouteObject[];
  getRoutes(): Record<string, RouteType>;
  setType(type: RouterOptions['type']): void;
  getBasename(): string;
  setBasename(basename: string): void;
  matchRoutes(pathname: string): import('@remix-run/router').AgnosticRouteMatch<string, RouteType>[];
  isSkippedAuthCheckRoute(pathname: string): boolean;
  /**
   * @internal
   */
  getRouterComponent(children?: React.ReactNode): React.FC<{
    BaseLayout?: ComponentType;
  }>;
  add(name: string, route: RouteType): void;
  get(name: string): RouteType;
  has(name: string): boolean;
  remove(name: string): void;
}
export declare function createRouterManager(options?: RouterOptions, app?: Application): RouterManager;
