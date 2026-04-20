/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { FlowContext } from './flowContext';
export type RunJSLibCache = 'global' | 'context';
export type RunJSLibLoader<T = any> = (ctx: FlowContext) => T | Promise<T>;
export declare function registerRunJSLib(
  name: string,
  loader: RunJSLibLoader,
  options?: {
    cache?: RunJSLibCache;
  },
): void;
export declare function setupRunJSLibs(ctx: FlowContext): void;
export declare function setRunJSLibOverride(
  ctx: FlowContext,
  name: string,
  value: unknown,
  options?: {
    topLevelKey?: string | false;
  },
): void;
export declare function externalReactRender(options: {
  ctx: any;
  entry: any;
  vnode: any;
  containerEl: any;
  rootMap: WeakMap<any, any>;
  unmountContainerRoot: () => void;
  internalReact: any;
  internalAntd: any;
}): any;
