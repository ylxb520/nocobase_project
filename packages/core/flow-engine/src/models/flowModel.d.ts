/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Emitter } from '../emitter';
import { InstanceFlowRegistry } from '../flow-registry/InstanceFlowRegistry';
import { FlowContext, FlowModelContext, FlowRuntimeContext } from '../flowContext';
import { FlowEngine } from '../flowEngine';
import type {
  ActionDefinition,
  ArrayElementType,
  CreateModelOptions,
  CreateSubModelOptions,
  DefaultStructure,
  FlowDefinitionOptions,
  FlowModelMeta,
  FlowModelOptions,
  ModelConstructor,
  ParamObject,
  ParentFlowModel,
  PersistOptions,
  ResolveUseResult,
  StepParams,
} from '../types';
import { IModelComponentProps, ReadonlyModelProps } from '../types';
import { ModelActionRegistry } from '../action-registry/ModelActionRegistry';
import { ModelEventRegistry } from '../event-registry/ModelEventRegistry';
import { GlobalFlowRegistry } from '../flow-registry/GlobalFlowRegistry';
import { FlowDefinition } from '../FlowDefinition';
import { FlowSettingsOpenOptions } from '../flowSettings';
import type { ScheduleOptions } from '../scheduler/ModelOperationScheduler';
import type { DispatchEventOptions, EventDefinition } from '../types';
import { ForkFlowModel } from './forkFlowModel';
import type { MenuProps } from 'antd';
type BaseMenuItem = NonNullable<MenuProps['items']>[number];
type MenuLeafItem = Exclude<
  BaseMenuItem,
  {
    children: MenuProps['items'];
  }
>;
export type FlowModelExtraMenuItem = Omit<MenuLeafItem, 'key'> & {
  key: React.Key;
  group?: string;
  sort?: number;
  onClick?: () => void;
};
type FlowModelExtraMenuItemInput = Omit<FlowModelExtraMenuItem, 'key'> & {
  key?: React.Key;
};
type ExtraMenuItemEntry = {
  group?: string;
  sort?: number;
  matcher?: (model: FlowModel) => boolean;
  keyPrefix?: string;
  items:
    | FlowModelExtraMenuItemInput[]
    | ((
        model: FlowModel,
        t: (k: string, opt?: any) => string,
      ) => FlowModelExtraMenuItemInput[] | Promise<FlowModelExtraMenuItemInput[]>);
};
export declare enum ModelRenderMode {
  ReactElement = 'reactElement',
  RenderFunction = 'renderFunction',
}
export declare class FlowModel<Structure extends DefaultStructure = DefaultStructure> {
  #private;
  /**
   * 当 flowSettingsEnabled 且 model.hidden 为 true 时用于渲染设置态组件（实例方法，子类可覆盖）。
   * 基类默认仅返回一个透明度降低的占位元素
   */
  protected renderHiddenInConfig(): React.ReactNode | undefined;
  readonly uid: string;
  sortIndex: number;
  hidden: boolean;
  props: IModelComponentProps;
  stepParams: StepParams;
  flowEngine: FlowEngine;
  parent: ParentFlowModel<Structure>;
  subModels: Structure['subModels'];
  private _options;
  protected _title: string;
  protected _extraTitle: string;
  isNew: boolean;
  skeleton: any;
  forbidden: any;
  /**
   * 所有 fork 实例的引用集合。
   * 使用 Set 便于在销毁时主动遍历并调用 dispose，避免悬挂引用。
   */
  forks: Set<ForkFlowModel<any>>;
  emitter: Emitter;
  /**
   * 基于 key 的 fork 实例缓存，用于复用 fork 实例
   */
  private forkCache;
  /**
   * 上一次 beforeRender 的执行参数
   */
  private _lastAutoRunParams;
  protected observerDispose: () => void;
  /**
   * 原始 render 方法的引用
   */
  private _originalRender;
  protected renderOriginal(): React.ReactNode;
  /**
   * 缓存的响应式包装器组件（每个实例一个）
   */
  private _reactiveWrapperCache?;
  flowRegistry: InstanceFlowRegistry;
  private _cleanRun?;
  /**
   * 声明渲染模式：
   * - 'renderElement': render 返回 React 节点，框架会用 observer 包装以获得响应式；
   * - 'renderFunction': render 返回渲染函数（例如表格单元格渲染器），不做包装也不预调用；
   */
  static renderMode: ModelRenderMode;
  constructor(options: FlowModelOptions<Structure>);
  /**
   * 对外暴露的上下文：
   */
  get context(): FlowModelContext;
  on(eventName: string, listener: (...args: any[]) => void): void;
  onInit(options: any): void;
  /**
   * 通过 AddSubModelButton 添加为子模型后调用（子类可覆盖）
   */
  afterAddAsSubModel(): Promise<void>;
  get async(): boolean;
  get use(): string;
  get subKey(): string;
  get subType(): 'object' | 'array';
  get reactView(): import('../ReactView').ReactView;
  get parentId(): string;
  scheduleModelOperation(
    toUid: string,
    fn: (model: FlowModel) => Promise<void> | void,
    options?: ScheduleOptions,
  ): import('../scheduler/ModelOperationScheduler').ScheduledCancel;
  static get meta(): FlowModelMeta;
  static get globalFlowRegistry(): GlobalFlowRegistry;
  protected static get actionRegistry(): ModelActionRegistry;
  protected static get eventRegistry(): ModelEventRegistry;
  /**
   * 动态解析实际要实例化的模型类；可在子类中覆盖。
   * 返回注册名或构造器，支持在 FlowEngine 中继续沿链解析。
   */
  static resolveUse?(options: CreateModelOptions, engine: FlowEngine, parent?: FlowModel): ResolveUseResult | void;
  /**
   * 注册仅当前 FlowModel 类及其子类可用的 Action。
   * 该注册是类级别的，不会影响全局（FlowEngine）的 Action 注册。
   */
  static registerAction<TModel extends FlowModel = FlowModel>(definition: ActionDefinition<TModel>): void;
  /**
   * 批量注册仅当前 FlowModel 类及其子类可用的 Actions。
   */
  static registerActions<TModel extends FlowModel = FlowModel>(actions: Record<string, ActionDefinition<TModel>>): void;
  /**
   * 注册仅当前 FlowModel 类及其子类可用的 Event。
   * 该注册是类级别的，不会影响全局（FlowEngine）的 Event 注册。
   */
  static registerEvent<TModel extends FlowModel = FlowModel>(definition: EventDefinition<TModel>): void;
  /**
   * 批量注册仅当前 FlowModel 类及其子类可用的 Events。
   */
  static registerEvents<TModel extends FlowModel = FlowModel>(events: Record<string, EventDefinition<TModel>>): void;
  static buildChildrenFromModels(ctx: any, Models: Array<any>): Promise<import('..').SubModelItem[]>;
  get title(): any;
  get extraTitle(): any;
  setTitle(value: string): void;
  setExtraTitle(value: string): void;
  setHidden(value: boolean): void;
  _createSubModels(subModels: Record<string, CreateSubModelOptions | CreateSubModelOptions[]>): void;
  /**
   * 失效指定事件的流程缓存；未指定 eventName 时，失效当前模型全部事件缓存。
   * - 默认 beforeRender 与其它事件共享同一缓存体系：prefix=`event:${scope}`，flowKey=`eventName`，uid=`model.uid`
   */
  invalidateFlowCache(eventName?: string, deep?: boolean): void;
  /**
   * 设置FlowEngine实例
   * @param {FlowEngine} flowEngine FlowEngine实例
   */
  setFlowEngine(flowEngine: FlowEngine): void;
  static define(meta: FlowModelMeta): void;
  /**
   * 注册一个 Flow。
   * @template TModel 具体的FlowModel子类类型
   * @param {string | FlowDefinitionOptions<TModel>} keyOrDefinition 流程的 Key 或 FlowDefinitionOptions 对象。
   *        如果为字符串，则为流程 Key，需要配合 flowDefinition 参数。
   *        如果为对象，则为包含 key 属性的完整 FlowDefinitionOptions。
   * @param {FlowDefinitionOptions<TModel>} [flowDefinition] 当第一个参数为流程 Key 时，此参数为流程的定义。
   * @returns {void}
   */
  static registerFlow<TClass extends ModelConstructor, TModel extends InstanceType<TClass> = InstanceType<TClass>>(
    this: TClass,
    keyOrDefinition: string | FlowDefinitionOptions<TModel>,
    flowDefinition?: Omit<FlowDefinitionOptions<TModel>, 'key'> & {
      key?: string;
    },
  ): void;
  /**
   * 获取已注册的流程定义。
   * 如果当前类不存在对应的flow，会继续往父类查找。
   * @param {string} key 流程 Key。
   * @returns {FlowDefinition | undefined} 流程定义，如果未找到则返回 undefined。
   */
  getFlow(key: string): FlowDefinition | undefined;
  /**
   * 注册一个实例级别的流程定义。
   * @template TModel 具体的FlowModel子类类型
   * @param {string | FlowDefinitionOptions<TModel>} keyOrDefinition 流程的 Key 或 FlowDefinitionOptions 对象。
   * @param {FlowDefinitionOptions<TModel>} [flowDefinition] 当第一个参数为流程 Key 时，此参数为流程的定义。
   * @returns {FlowDefinition} 注册的流程定义实例
   */
  registerFlow<TModel extends FlowModel = this>(
    keyOrDefinition: string | FlowDefinitionOptions<TModel>,
    flowDefinition?: Omit<FlowDefinitionOptions<TModel>, 'key'> & {
      key?: string;
    },
  ): FlowDefinition;
  /**
   * 获取当前模型可用的所有 Actions：
   * - 包含全局（FlowEngine）注册的 Actions；
   * - 合并类级（FlowModel.registerAction(s)）注册的 Actions，并考虑继承（子类覆盖父类同名 Action）。
   */
  getActions<TModel extends FlowModel = this, TCtx extends FlowContext = FlowRuntimeContext<TModel>>(): Map<
    string,
    ActionDefinition<TModel, TCtx>
  >;
  /**
   * 获取当前模型可用的所有 Events：
   * - 包含全局（FlowEngine）注册的 Events；
   * - 合并类级（FlowModel.registerEvent(s)）注册的 Events，并考虑继承（子类覆盖父类同名 Event）。
   */
  getEvents<TModel extends FlowModel = this>(): Map<string, EventDefinition<TModel>>;
  /**
   * 获取指定名称的 Event（优先返回类级注册的，未找到则回退到全局）。
   */
  getEvent<TModel extends FlowModel = this>(name: string): EventDefinition<TModel> | undefined;
  /**
   * 获取指定名称的 Action（优先返回类级注册的，未找到则回退到全局）。
   */
  getAction<TModel extends FlowModel = this, TCtx extends FlowContext = FlowRuntimeContext<TModel>>(
    name: string,
  ): ActionDefinition<TModel, TCtx> | undefined;
  getFlows(): Map<string, FlowDefinition>;
  setProps(props: IModelComponentProps): void;
  setProps(key: string, value: any): void;
  getProps(): ReadonlyModelProps;
  setStepParams(flowKey: string, stepKey: string, params: ParamObject): void;
  setStepParams(flowKey: string, stepParams: Record<string, ParamObject>): void;
  setStepParams(allParams: StepParams): void;
  getStepParams(flowKey: string, stepKey: string): any | undefined;
  getStepParams(flowKey: string): Record<string, any> | undefined;
  getStepParams(): StepParams;
  applyFlow(flowKey: string, inputArgs?: Record<string, any>, runId?: string): Promise<any>;
  private _dispatchEvent;
  private _dispatchEventWithDebounce;
  dispatchEvent(
    eventName: string,
    inputArgs?: Record<string, any>,
    options?: {
      /** 是否要开启防抖功能 */
      debounce?: boolean;
    } & DispatchEventOptions,
  ): Promise<any[]>;
  /**
   * 按事件名获取对应的流程集合（保持 getFlows 的顺序，即按 sort 排序）。
   * - beforeRender 兼容：除显式 on: 'beforeRender' 外，包含未声明 on 且 manual !== true 的流程。
   */
  getEventFlows(eventName: string): FlowDefinition[];
  /**
   * 重新执行上一次的 beforeRender，保持参数一致
   * 如果之前没有执行过，则直接跳过
   * 使用 lodash debounce 避免频繁调用
   */
  private _rerunLastAutoRun;
  /**
   * 通用事件分发钩子：开始
   * 子类可覆盖；beforeRender 事件可通过抛出 FlowExitException 提前终止。
   */
  onDispatchEventStart(
    eventName: string,
    options?: DispatchEventOptions,
    inputArgs?: Record<string, any>,
  ): Promise<void>;
  /**
   * 通用事件分发钩子：结束
   * 子类可覆盖。
   */
  onDispatchEventEnd(
    eventName: string,
    options?: DispatchEventOptions,
    inputArgs?: Record<string, any>,
    results?: any[],
  ): Promise<void>;
  /**
   * 通用事件分发钩子：错误
   * 子类可覆盖。
   */
  onDispatchEventError(
    eventName: string,
    options?: DispatchEventOptions,
    inputArgs?: Record<string, any>,
    error?: Error,
  ): Promise<void>;
  useHooksBeforeRender(): void;
  /**
   * 智能检测是否应该跳过响应式包装
   * 说明：
   * - 仅基于标记判断，不会执行 render，避免出现“预调用 render”带来的副作用和双调用问题。
   * - 当子类需要返回函数（如表格列的单元格渲染器），应在子类上设置静态属性 `renderReturnsFunction = true`。
   */
  private shouldSkipReactiveWrapping;
  /**
   * 设置 render 方法的响应式包装
   * @private
   */
  private setupReactiveRender;
  get cleanRun(): boolean;
  setCleanRun(value: boolean): void;
  /**
   * 组件挂载时的生命周期钩子
   * 子类可以重写此方法来添加挂载时的逻辑
   * @protected
   */
  protected onMount(): void;
  /**
   * 组件卸载时的生命周期钩子
   * 子类可以重写此方法来添加卸载时的逻辑
   * @protected
   */
  protected onUnmount(): void;
  /**
   * 有权限时的渲染逻辑。
   * 这是一个抽象方法，所有子类都必须实现，用于返回自己的正常 UI。
   *
   * @returns {React.ReactNode} 有权限时的渲染结果
   */
  render(): any;
  rerender(): Promise<void>;
  /**
   * 事件缓存的作用域标识；可按事件区分（默认与事件无关的 scope 返回 'default'）。
   */
  getFlowCacheScope(eventName: string): string;
  setParent(parent: FlowModel): void;
  removeParentDelegate(): void;
  addSubModel<T extends FlowModel>(subKey: string, options: CreateModelOptions | T): T;
  setSubModel(subKey: string, options: CreateModelOptions | FlowModel): FlowModel<DefaultStructure>;
  filterSubModels<K extends keyof Structure['subModels'], R>(
    subKey: K,
    callback: (model: ArrayElementType<Structure['subModels'][K]>, index: number) => boolean,
  ): ArrayElementType<Structure['subModels'][K]>[];
  mapSubModels<K extends keyof Structure['subModels'], R>(
    subKey: K,
    callback: (model: ArrayElementType<Structure['subModels'][K]>, index: number) => R,
  ): R[];
  hasSubModel<K extends keyof Structure['subModels']>(subKey: K): boolean;
  findSubModel<K extends keyof Structure['subModels'], R>(
    subKey: K,
    callback: (model: ArrayElementType<Structure['subModels'][K]>) => R,
  ): ArrayElementType<Structure['subModels'][K]> | null;
  createRootModel(options: any): FlowModel<DefaultStructure>;
  /**
   * 对指定子模型派发 beforeRender 事件（顺序执行并使用缓存）。
   */
  applySubModelsBeforeRenderFlows<K extends keyof Structure['subModels']>(
    subKey: K,
    inputArgs?: Record<string, any>,
    shared?: Record<string, any>,
  ): Promise<void>;
  /**
   * 创建一个 fork 实例，实现"一份数据（master）多视图（fork）"的能力。
   * @param {IModelComponentProps} [localProps={}] fork 专属的局部 props，优先级高于 master.props
   * @param {string} [key] 可选的 key，用于复用 fork 实例。如果提供了 key，会尝试复用已存在的 fork
   * @returns {ForkFlowModel<this>} 创建的 fork 实例
   */
  createFork(
    localProps?: IModelComponentProps,
    key?: string,
    options?: {
      sharedProperties?: string[];
      register?: boolean;
    },
  ): ForkFlowModel<this>;
  clearForks(): void;
  getFork(key: string): ForkFlowModel<any>;
  /**
   * 移动当前模型到目标模型的位置
   * @param {FlowModel} targetModel 目标模型
   * @param {PersistOptions} [options] 可选的持久化选项
   * @returns {boolean} 是否成功移动
   */
  moveTo(targetModel: FlowModel, options?: PersistOptions): Promise<void>;
  remove(): boolean;
  save(): Promise<any>;
  saveStepParams(): Promise<any>;
  destroy(): Promise<boolean>;
  /**
   * @deprecated
   * 打开步骤设置对话框
   * 用于配置流程中特定步骤的参数和设置
   * @param {string} flowKey 流程的唯一标识符
   * @param {string} stepKey 步骤的唯一标识符
   * @returns {void}
   */
  openStepSettingsDialog(flowKey: string, stepKey: string): Promise<any>;
  /**
   * 配置必填步骤参数
   * 用于在一个分步表单中配置所有需要参数的步骤
   * @param {number | string} [dialogWidth=800] 对话框宽度，默认为800
   * @param {string} [dialogTitle='步骤参数配置'] 对话框标题，默认为'步骤参数配置'
   * @returns {Promise<any>} 返回表单提交的值
   */
  configureRequiredSteps(dialogWidth?: number | string, dialogTitle?: string): Promise<any>;
  /**
   * @deprecated
   * @param dialogWidth
   * @param dialogTitle
   * @returns
   */
  openPresetStepSettingsDialog(dialogWidth?: number | string, dialogTitle?: string): Promise<any>;
  openFlowStepSettingsDialog(options: {
    flowKey?: string;
    stepKey?: string;
    preset?: boolean;
    uiMode?: 'drawer' | 'dialog';
  }): Promise<void>;
  get translate(): any;
  serialize(): Record<string, any>;
  /**
   * 复制当前模型实例为一个新的实例。
   * 新实例及其所有子模型都会有新的 uid，且不保留 root model 的 parent 关系。
   * 内部所有引用旧 uid 的地方（如 parentId, parentUid 等）都会被替换为对应的新 uid。
   * @returns {FlowModel} 复制后的新模型实例
   */
  clone<T extends FlowModel = this>(): T;
  /**
   * Opens the flow settings dialog for this flow model.
   * @param options - Configuration options for opening flow settings, excluding the model property
   * @returns A promise that resolves when the flow settings dialog is opened
   */
  openFlowSettings(options?: Omit<FlowSettingsOpenOptions, 'model'>): Promise<boolean>;
  /** 注册设置菜单的额外项（静态，按类缓存，可继承合并） */
  static registerExtraMenuItems(
    opts:
      | ExtraMenuItemEntry
      | ((
          model: FlowModel,
          t: (k: string, opt?: any) => string,
        ) => FlowModelExtraMenuItemInput[] | Promise<FlowModelExtraMenuItemInput[]>),
  ): () => void;
  static getExtraMenuItems(model: FlowModel, t: (k: string, opt?: any) => string): Promise<FlowModelExtraMenuItem[]>;
  refresh(): Promise<void>;
}
export declare class ErrorFlowModel extends FlowModel {
  errorMessage: string;
  setErrorMessage(msg: string): void;
  render(): React.JSX.Element;
}
export declare function defineFlow<TModel extends FlowModel = FlowModel>(
  definition: FlowDefinitionOptions,
): FlowDefinitionOptions<TModel>;
export {};
