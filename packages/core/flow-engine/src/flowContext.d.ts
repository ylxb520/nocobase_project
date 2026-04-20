/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ISchema } from '@formily/json-schema';
import { APIClient, RequestOptions } from '@nocobase/sdk';
import type { Router } from '@remix-run/router';
import { MessageInstance } from 'antd/es/message/interface';
import type { HookAPI } from 'antd/es/modal/useModal';
import { NotificationInstance } from 'antd/es/notification/interface';
import pino from 'pino';
import React from 'react';
import type { Location } from 'react-router-dom';
import { DataSourceManager } from './data-source';
import { FlowEngine } from './flowEngine';
import { JSRunner, JSRunnerOptions } from './JSRunner';
import type { FlowModel } from './models/flowModel';
import type { ForkFlowModel } from './models/forkFlowModel';
import { FlowResource, FlowSQLRepository } from './resources';
import type { ActionDefinition, EventDefinition, ResourceType } from './types';
import { JSONValue } from './utils/params-resolvers';
import type { RecordRef } from './utils/serverContextParams';
import { FlowView, FlowViewer } from './views/FlowView';
import { type RunJSVersion } from './runjs-context/registry';
type Getter<T = any> = (ctx: FlowContext) => T | Promise<T>;
export type FlowContextDocRef =
  | string
  | {
      url: string;
      title?: string;
    };
export type FlowDeprecationDoc =
  | boolean
  | {
      /**
       * 废弃说明（面向人/大模型）。
       */
      message?: string;
      /**
       * 推荐替代 API（例如 'ctx.resolveJsonTemplate'）。
       */
      replacedBy?: string | string[];
      /**
       * 开始废弃的版本号（可选）。
       */
      since?: string;
      /**
       * 预计移除的版本号（可选）。
       */
      removedIn?: string;
      /**
       * 参考链接（可选）。
       */
      ref?: FlowContextDocRef;
    };
export type FlowContextDocParam = {
  name: string;
  description?: string;
  type?: string;
  optional?: boolean;
  default?: JSONValue;
};
export type FlowContextDocReturn = {
  description?: string;
  type?: string;
};
export interface MetaTreeNode {
  name: string;
  title: string;
  type: string;
  interface?: string;
  options?: any;
  uiSchema?: ISchema;
  render?: (props: any) => JSX.Element;
  paths: string[];
  parentTitles?: string[];
  hidden?: boolean | (() => boolean);
  disabled?: boolean | (() => boolean);
  disabledReason?: string | (() => string | undefined);
  children?: MetaTreeNode[] | (() => Promise<MetaTreeNode[]>);
}
export interface PropertyMeta {
  type: string;
  title: string;
  interface?: string;
  options?: any;
  uiSchema?: ISchema;
  render?: (props: any) => JSX.Element;
  sort?: number;
  properties?: Record<string, PropertyMeta> | (() => Promise<Record<string, PropertyMeta>>);
  disabled?: boolean | (() => boolean | Promise<boolean>);
  disabledReason?: string | (() => string | undefined | Promise<string | undefined>);
  hidden?: boolean | (() => boolean | Promise<boolean>);
  buildVariablesParams?: (
    ctx: FlowContext,
  ) => RecordRef | Record<string, any> | Promise<RecordRef | Record<string, any> | undefined> | undefined;
}
export type PropertyMetaFactory = {
  (): PropertyMeta | Promise<PropertyMeta | null> | null;
  /**
   * 仅作为“是否可能存在子节点”的提示，不影响 meta 工厂本身的惰性特性。
   * - true（默认）：视为可能有 children，节点会提供 children 懒加载器（用于级联展开加载子级）。
   * - false：视为没有 children，不渲染展开箭头，且不提供 children 懒加载器；
   *          但节点本身的 meta 工厂仍保持惰性（在需要时仍可解析出 title/type 等信息）。
   */
  hasChildren?: boolean;
  title?: string;
  sort?: number;
};
export type PropertyMetaOrFactory = PropertyMeta | PropertyMetaFactory;
export interface PropertyOptions {
  value?: any;
  once?: boolean;
  get?: Getter;
  cache?: boolean;
  observable?: boolean;
  meta?: PropertyMetaOrFactory;
  /**
   * 面向工具/大模型的静态文档信息（不影响变量选择器 UI）。
   * - `getApiInfos()` 仅使用 RunJS doc + 这里的 `info`（不会读取/展开 `meta`）
   * - 变量结构信息请使用 `getVarInfos()`（来源于 `meta`）
   */
  info?: FlowContextPropertyInfoOrFactory;
  resolveOnServer?: boolean | ((subPath: string) => boolean);
  serverOnlyWhenContextParams?: boolean;
}
export type FlowContextMethodInfoInput = {
  description?: string;
  detail?: string;
  examples?: string[];
  completion?: RunJSDocCompletionDoc;
  ref?: FlowContextDocRef;
  deprecated?: FlowDeprecationDoc;
  params?: FlowContextDocParam[];
  returns?: FlowContextDocReturn;
  hidden?: boolean | ((ctx: any) => boolean | Promise<boolean>);
  disabled?: boolean | ((ctx: any) => boolean | Promise<boolean>);
  disabledReason?: string | ((ctx: any) => string | undefined | Promise<string | undefined>);
};
export type FlowContextMethodInfo = {
  description?: string;
  detail?: string;
  examples?: string[];
  completion?: RunJSDocCompletionDoc;
  ref?: FlowContextDocRef;
  deprecated?: FlowDeprecationDoc;
  params?: FlowContextDocParam[];
  returns?: FlowContextDocReturn;
  disabled?: boolean;
  disabledReason?: string;
};
export type FlowContextPropertyInfoObjectInput = Omit<
  FlowContextPropertyInfo,
  'disabled' | 'disabledReason' | 'properties'
> & {
  properties?:
    | Record<string, FlowContextPropertyInfoInput>
    | (() => Promise<Record<string, FlowContextPropertyInfoInput>>);
  hidden?: RunJSDocHiddenOrPathsDoc;
  disabled?: boolean | ((ctx: any) => boolean | Promise<boolean>);
  disabledReason?: string | ((ctx: any) => string | undefined | Promise<string | undefined>);
};
export type FlowContextPropertyInfoInput = string | FlowContextPropertyInfoObjectInput;
export type FlowContextPropertyInfoFactory = {
  (): FlowContextPropertyInfoInput | Promise<FlowContextPropertyInfoInput | null> | null;
};
export type FlowContextPropertyInfoOrFactory = FlowContextPropertyInfoInput | FlowContextPropertyInfoFactory;
export type FlowContextPropertyInfo = {
  title?: string;
  type?: string;
  interface?: string;
  description?: string;
  detail?: string;
  examples?: string[];
  completion?: RunJSDocCompletionDoc;
  ref?: FlowContextDocRef;
  deprecated?: FlowDeprecationDoc;
  params?: FlowContextDocParam[];
  returns?: FlowContextDocReturn;
  disabled?: boolean;
  disabledReason?: string;
  properties?: Record<string, FlowContextPropertyInfo>;
};
export type FlowContextApiInfo = {
  title?: string;
  type?: string;
  interface?: string;
  description?: string;
  examples?: string[];
  completion?: RunJSDocCompletionDoc;
  ref?: FlowContextDocRef;
  deprecated?: FlowDeprecationDoc;
  params?: FlowContextDocParam[];
  returns?: FlowContextDocReturn;
  disabled?: boolean;
  disabledReason?: string;
  properties?: Record<string, FlowContextApiInfo>;
};
export type FlowContextInfosEnvNode = {
  /**
   * 说明（面向人/大模型）。建议为一句话。
   */
  description?: string;
  /**
   * 可用于 `await ctx.getVar(getVar)` 的表达式字符串，推荐以 `ctx.` 开头。
   * 例如：'ctx.popup'、'ctx.resource.collectionName'
   */
  getVar?: string;
  /**
   * 已解析/可序列化的静态值（用于 prompt 直接使用）。
   * 注意：应保持小体积，避免放入 record 等大对象。
   */
  value?: JSONValue;
  /**
   * 子节点（用于表达 popup.resource.xxx 等层级结构）。
   */
  properties?: Record<string, FlowContextInfosEnvNode>;
};
export type FlowContextInfosEnvs = {
  popup?: FlowContextInfosEnvNode;
  block?: FlowContextInfosEnvNode;
  currentViewBlocks?: FlowContextInfosEnvNode;
  flowModel?: FlowContextInfosEnvNode;
  resource?: FlowContextInfosEnvNode;
  record?: FlowContextInfosEnvNode;
};
export type FlowContextGetApiInfosOptions = {
  /**
   * RunJS 文档版本（默认 v1）。
   */
  version?: RunJSVersion;
};
export type FlowContextGetVarInfosOptions = {
  /**
   * 最大展开层级（默认 3）。
   * - 当不传 path 时，top-level property depth=1。
   * - 当传 path 时，path 对应节点 depth=1。
   */
  maxDepth?: number;
  /**
   * 剪裁：仅收集指定 path 下的变量结构信息。
   * - string 形式支持：'record'、'record.id'、'ctx.record'、'{{ ctx.record }}'
   * - string[] 表示多个剪裁路径合并
   */
  path?: string | string[];
};
type RouteOptions = {
  name?: string;
  path?: string;
  params?: Record<string, any>;
  pathname?: string;
};
export declare class FlowContext {
  #private;
  _props: Record<string, PropertyOptions>;
  _methods: Record<string, (...args: any[]) => any>;
  _methodInfos: Record<string, FlowContextMethodInfoInput>;
  protected _cache: Record<string, any>;
  protected _observableCache: Record<string, any>;
  protected _delegates: FlowContext[];
  protected _pending: Record<string, Promise<any>>;
  [key: string]: any;
  private _metaNodeCache;
  createProxy(): FlowContext;
  constructor();
  defineProperty(key: string, options: PropertyOptions): void;
  defineMethod(name: string, fn: (...args: any[]) => any, info?: string | FlowContextMethodInfoInput): void;
  removeCache(key: string): boolean;
  delegate(ctx: FlowContext): void;
  addDelegate(ctx: FlowContext): void;
  clearDelegates(): void;
  removeDelegate(ctx: FlowContext): void;
  /**
   * 清除特定 meta 对象的缓存
   */
  private _clearMetaNodeCacheFor;
  has(key: string): boolean;
  /**
   * 获取属性元数据树
   * 返回的 MetaTreeNode 中可能包含异步的延迟加载逻辑
   * @param value 可选参数，指定要获取的属性路径，格式: "{{ ctx.propertyName }}"
   * @returns MetaTreeNode[] 根级属性的元数据树，或指定路径的子树
   *
   * @example
   * // 同步调用，获取完整 meta tree
   * const metaTree = flowContext.getPropertyMetaTree();
   *
   * // 获取指定属性的子树
   * const subTree = flowContext.getPropertyMetaTree("{{ ctx.user }}");
   *
   * // 获取多层级属性的子树
   * const profileTree = flowContext.getPropertyMetaTree("{{ ctx.user.profile }}");
   */
  getPropertyMetaTree(
    value?: string,
    options?: {
      flatten?: boolean;
    },
  ): MetaTreeNode[];
  /**
   * 获取静态 API 文档信息（仅顶层一层）。
   *
   * - 输出仅来自 RunJS doc 与 defineProperty/defineMethod 的 info
   * - 不读取/展开 PropertyMeta（变量结构）
   * - 不自动展开深层 properties
   * - 不返回自动补全字段（例如 completion）
   */
  getApiInfos(options?: FlowContextGetApiInfosOptions): Promise<Record<string, FlowContextApiInfo>>;
  /**
   * 获取运行时环境快照信息（小体积、可序列化）。
   */
  getEnvInfos(): Promise<FlowContextInfosEnvs>;
  /**
   * 获取变量结构信息（来源于 PropertyMeta）。
   *
   * - 返回静态 plain object（不包含函数）
   * - 支持 maxDepth（默认 3）与 path 剪裁
   */
  getVarInfos(options?: FlowContextGetVarInfosOptions): Promise<Record<string, FlowContextApiInfo>>;
  _getPropertiesMeta(): Record<string, PropertyMetaOrFactory>;
  protected _getOwnProperty(key: string, currentContext: any): any;
  protected _getOwnMethod(key: string, flowContext?: FlowContext): any;
  _findPropertyInDelegates(delegates: FlowContext[], key: string): PropertyOptions | undefined;
  _findInDelegates(delegates: FlowContext[], key: string): any;
  _hasInDelegates(delegates: FlowContext[], key: string): boolean;
  /**
   * 获取属性定义选项（包含代理链）。
   *
   * - 优先查找当前上下文自身通过 defineProperty 注册的属性定义
   * - 若自身不存在，则沿委托链（delegates）向上查找第一个命中的定义
   *
   * @param key 顶层属性名（例如 'user'、'view'）
   * @returns 属性定义选项，或 undefined（未定义）
   */
  getPropertyOptions(key: string): PropertyOptions | undefined;
}
declare class BaseFlowEngineContext extends FlowContext {
  router: Router;
  dataSourceManager: DataSourceManager;
  requireAsync: (url: string) => Promise<any>;
  importAsync: (url: string) => Promise<any>;
  createJSRunner: (options?: JSRunnerOptions) => Promise<JSRunner>;
  pageInfo: {
    version?: 'v1' | 'v2';
  };
  /**
   * @deprecated use `resolveJsonTemplate` instead
   */
  renderJson: (template: JSONValue) => Promise<any>;
  resolveJsonTemplate: (template: JSONValue) => Promise<any>;
  getVar: (path: string) => Promise<any>;
  request: (options: RequestOptions) => Promise<any>;
  runjs: (code: string, variables?: Record<string, any>, options?: JSRunnerOptions) => Promise<any>;
  getAction: <TModel extends FlowModel = FlowModel, TCtx extends FlowContext = FlowContext>(
    name: string,
  ) => ActionDefinition<TModel, TCtx> | undefined;
  getActions: <TModel extends FlowModel = FlowModel, TCtx extends FlowContext = FlowContext>() => Map<
    string,
    ActionDefinition<TModel, TCtx>
  >;
  getEvents: <TModel extends FlowModel = FlowModel, TCtx extends FlowContext = FlowContext>() => Map<
    string,
    EventDefinition<TModel, TCtx>
  >;
  runAction: (actionName: string, params?: Record<string, any>) => Promise<any> | any;
  engine: FlowEngine;
  api: APIClient;
  viewer: FlowViewer;
  view: FlowView;
  modal: HookAPI;
  message: MessageInstance;
  notification: NotificationInstance;
  route: RouteOptions;
  location: Location;
  sql: FlowSQLRepository;
  logger: pino.Logger;
  constructor();
}
declare class BaseFlowModelContext extends BaseFlowEngineContext {
  model: FlowModel;
  ref: React.RefObject<HTMLDivElement>;
  getAction: <TModel extends FlowModel = FlowModel, TCtx extends FlowContext = FlowContext>(
    name: string,
  ) => ActionDefinition<TModel, TCtx> | undefined;
  getActions: <TModel extends FlowModel = FlowModel, TCtx extends FlowContext = FlowContext>() => Map<
    string,
    ActionDefinition<TModel, TCtx>
  >;
  getEvents: <TModel extends FlowModel = FlowModel, TCtx extends FlowContext = FlowContext>() => Map<
    string,
    EventDefinition<TModel, TCtx>
  >;
  runAction: (actionName: string, params?: Record<string, any>) => Promise<any> | any;
  /**
   * @deprecated use `makeResource` instead
   */
  createResource: <T extends FlowResource = FlowResource>(resourceType: ResourceType<T>) => T;
  /**
   * Create a new resource instance without adding it to the context.
   * @param resourceType - The resource type.
   * @returns The resource instance.
   */
  makeResource: <T extends FlowResource = FlowResource>(resourceType: ResourceType<T>) => T;
}
export declare class FlowEngineContext extends BaseFlowEngineContext {
  engine: FlowEngine;
  constructor(engine: FlowEngine);
}
export declare class FlowModelContext extends BaseFlowModelContext {
  constructor(model: FlowModel);
}
export declare class FlowForkModelContext extends BaseFlowModelContext {
  master: FlowModel;
  fork: ForkFlowModel;
  constructor(master: FlowModel, fork: ForkFlowModel);
}
export declare class FlowRuntimeContext<
  TModel extends FlowModel = FlowModel,
  TMode extends 'runtime' | 'settings' = any,
> extends BaseFlowModelContext {
  model: TModel;
  flowKey: string;
  protected _mode: TMode;
  steps: Record<
    string,
    {
      params: Record<string, any>;
      uiSchema?: any;
      result?: any;
    }
  >;
  stepResults: Record<string, any>;
  /**
   * @deprecated use `initResource` instead
   */
  useResource: (className: 'APIResource' | 'SingleRecordResource' | 'MultiRecordResource' | 'SQLResource') => void;
  /**
   * Initialize a resource instance without adding it to the context.
   * @param className - The resource class name.
   */
  initResource: (className: 'APIResource' | 'SingleRecordResource' | 'MultiRecordResource' | 'SQLResource') => void;
  getStepParams: (stepKey: string) => Record<string, any>;
  setStepParams: (stepKey: string, params?: any) => void;
  getStepResults: (stepKey: string) => any;
  runAction: (actionName: string, params?: Record<string, any>) => Promise<any> | any;
  constructor(model: TModel, flowKey: string, _mode?: TMode);
  protected _getOwnProperty(key: string): any;
  exit(): void;
  exitAll(): void;
  get mode(): TMode;
}
export type FlowSettingsContext<TModel extends FlowModel = FlowModel> = FlowRuntimeContext<TModel, 'settings'>;
export type RunJSDocCompletionDoc = {
  insertText?: string;
};
export type RunJSDocHiddenDoc = boolean | ((ctx: any) => boolean | Promise<boolean>);
export type RunJSDocHiddenOrPathsDoc =
  | boolean
  | string[]
  | ((ctx: any) => boolean | string[] | Promise<boolean | string[]>);
export type RunJSDocPropertyDoc =
  | string
  | {
      description?: string;
      detail?: string;
      type?: string;
      examples?: string[];
      completion?: RunJSDocCompletionDoc;
      ref?: FlowContextDocRef;
      deprecated?: FlowDeprecationDoc;
      params?: FlowContextDocParam[];
      returns?: FlowContextDocReturn;
      properties?: Record<string, RunJSDocPropertyDoc>;
      hidden?: RunJSDocHiddenOrPathsDoc;
      disabled?: boolean | ((ctx: any) => boolean | Promise<boolean>);
      disabledReason?: string | ((ctx: any) => string | undefined | Promise<string | undefined>);
    };
export type RunJSDocMethodDoc =
  | string
  | {
      description?: string;
      detail?: string;
      examples?: string[];
      completion?: RunJSDocCompletionDoc;
      ref?: FlowContextDocRef;
      deprecated?: FlowDeprecationDoc;
      params?: FlowContextDocParam[];
      returns?: FlowContextDocReturn;
      hidden?: RunJSDocHiddenDoc;
      disabled?: boolean | ((ctx: any) => boolean | Promise<boolean>);
      disabledReason?: string | ((ctx: any) => string | undefined | Promise<string | undefined>);
    };
export type RunJSDocMeta = {
  label?: string;
  properties?: Record<string, RunJSDocPropertyDoc>;
  methods?: Record<string, RunJSDocMethodDoc>;
  snippets?: Record<string, any>;
};
export declare function createRunJSDeprecationProxy(
  ctx: any,
  options?: {
    doc?: RunJSDocMeta;
  },
): any;
export declare class FlowRunJSContext extends FlowContext {
  constructor(delegate: FlowContext);
  exit(): void;
  exitAll(): void;
  static define(
    meta: RunJSDocMeta,
    options?: {
      locale?: string;
    },
  ): void;
  static getDoc(locale?: string): RunJSDocMeta;
}
export {};
