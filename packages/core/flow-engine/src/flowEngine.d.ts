import pino from 'pino';
import { FlowExecutor } from './executor/FlowExecutor';
import { FlowContext, FlowEngineContext, FlowRuntimeContext } from './flowContext';
import { FlowSettings } from './flowSettings';
import { FlowModel } from './models';
import { ReactView } from './ReactView';
import { FlowResource } from './resources';
import { Emitter } from './emitter';
import ModelOperationScheduler from './scheduler/ModelOperationScheduler';
import type { ScheduleOptions, ScheduledCancel } from './scheduler/ModelOperationScheduler';
import type {
  ActionDefinition,
  ApplyFlowCacheEntry,
  CreateModelOptions,
  EventDefinition,
  FlowModelOptions,
  IFlowModelRepository,
  ModelConstructor,
  PersistOptions,
  ResourceType,
} from './types';
/**
 * FlowEngine is the core class of the flow engine, responsible for managing flow models, actions, model repository, and more.
 * It provides capabilities for registering, creating, finding, persisting, replacing, and moving models.
 * Supports flow definitions, action definitions, model class inheritance and filtering.
 * Integrates FlowEngineContext, FlowSettings, and ReactView for context, configuration, and view rendering.
 *
 * Main features:
 * - Register, get, and find model classes and model instances
 * - Register and get action definitions
 * - Persist and query models via the model repository
 * - Register flow definitions
 * - Create, find, replace, move, and destroy model instances
 * - Support for model class inheritance and filtering
 * - Internationalization support
 * - Integration with React view rendering
 *
 * @example
 * const engine = new FlowEngine();
 * engine.registerModels({ MyModel });
 * engine.setModelRepository(new MyRepository());
 * const model = engine.createModel({ use: 'MyModel', uid: 'xxx' });
 */
export declare class FlowEngine {
  #private;
  /**
   * Global action registry
   */
  private _actionRegistry;
  /**
   * Global event registry
   */
  private _eventRegistry;
  /**
   * Registered model classes.
   * Key is the model class name, value is the model class constructor.
   * @private
   */
  private _modelClasses;
  /**
   * Created model instances.
   * Key is the model instance UID, value is the model instance object.
   * @private
   */
  private _modelInstances;
  /**
   * The current model repository instance, implements IFlowModelRepository.
   * Used for model persistence and queries.
   * @private
   */
  private _modelRepository;
  /**
   * Flow application cache.
   * Key is the cache key, value is ApplyFlowCacheEntry.
   * @private
   */
  private _applyFlowCache;
  /**
   * Model saving state tracking.
   * Key is the model UID, value is the save promise.
   * @private
   */
  private _savingModels;
  /**
   * Flow engine context object.
   * @private
   */
  private _flowContext;
  /**
   * 视图作用域引擎的栈式链表指针。
   * - previousEngine：打开当前视图的上一个引擎
   * - nextEngine：在当前之上的下一个引擎
   */
  private _previousEngine?;
  private _nextEngine?;
  private _resources;
  /**
   * Data change registry used to coordinate "refresh on active" across view-scoped engines.
   *
   * Keyed by: dataSourceKey -> resourceName -> version.
   * - mark: increments version
   * - get: returns current version (default 0)
   *
   * NOTE: ViewScopedFlowEngine proxies delegate non-local fields/methods to parents, so this
   * registry naturally lives on the root engine instance and is shared across the whole view stack.
   */
  private _dataSourceDirtyVersions;
  /**
   * 引擎事件总线（目前用于模型生命周期等事件）。
   * ViewScopedFlowEngine 持有自己的实例，实现作用域隔离。
   */
  emitter: Emitter;
  /** 调度器：仅在 View 作用域引擎本地启用；根/Block 作用域默认不持有 */
  private _modelOperationScheduler?;
  logger: pino.Logger;
  /**
   * Flow settings, including components and form scopes.
   * @public
   */
  flowSettings: FlowSettings;
  /**
   * Experimental API: Integrates React view rendering capability into FlowEngine.
   * This property may change or be removed in the future. Use with caution.
   * @experimental
   * @public
   */
  reactView: ReactView;
  /**
   * Flow executor that runs event flows.
   */
  executor: FlowExecutor;
  /**
   * Constructor. Initializes React view, registers default model and form scopes.
   */
  constructor();
  /** 获取/创建当前引擎的调度器（仅在本地作用域） */
  getScheduler(): ModelOperationScheduler;
  /** 释放并清理当前引擎本地调度器（若存在） */
  disposeScheduler(): void;
  /**
   * Mark a data source resource as "dirty" (changed).
   * This is used by data blocks to decide whether to refresh when a view becomes active.
   */
  markDataSourceDirty(dataSourceKey: string, resourceName: string): number;
  /**
   * Get current dirty version for a data source resource.
   * Returns 0 when no writes have been recorded.
   */
  getDataSourceDirtyVersion(dataSourceKey: string, resourceName: string): number;
  /** 在目标模型生命周期达成时执行操作（仅在 View 引擎本地存储计划） */
  scheduleModelOperation(
    fromModelOrUid: FlowModel | string,
    toUid: string,
    fn: (model: FlowModel) => Promise<void> | void,
    options?: ScheduleOptions,
  ): ScheduledCancel;
  /** 上一个引擎（根引擎为 undefined） */
  get previousEngine(): FlowEngine | undefined;
  /** 下一个引擎（若存在） */
  get nextEngine(): FlowEngine | undefined;
  /**
   * 将当前引擎链接到 prev 之后（用于视图打开时形成栈关系）。
   */
  linkAfter(engine: FlowEngine): void;
  /**
   * 将当前引擎从栈中移除并修复相邻指针（用于视图关闭时）。
   */
  unlinkFromStack(): void;
  /**
   * Get the flow engine context object.
   * @returns {FlowEngineContext} Flow engine context
   */
  get context(): FlowEngineContext;
  get dataSourceManager(): import('./data-source').DataSourceManager;
  /**
   * Get the flow application cache.
   * @returns {Map<string, ApplyFlowCacheEntry>} Flow application cache map
   * @internal
   */
  get applyFlowCache(): Map<string, ApplyFlowCacheEntry>;
  /**
   * Set the model repository for persisting and querying model instances.
   * If a model repository was already set, it will be overwritten and a warning will be printed.
   * @param {IFlowModelRepository} modelRepository The model repository instance implementing IFlowModelRepository.
   * @example
   * flowEngine.setModelRepository(new MyFlowModelRepository());
   */
  setModelRepository(modelRepository: IFlowModelRepository): void;
  get modelRepository(): IFlowModelRepository | null;
  /**
   * Internationalization translation method, calls the context's t method.
   * @param {string} keyOrTemplate Translation key or template string
   * @param {any} [options] Optional parameters
   * @returns {string} Translated string
   */
  translate(keyOrTemplate: string, options?: any): string;
  /**
   * Register multiple actions.
   * @param {Record<string, ActionDefinition>} actions Action definition object collection
   */
  registerActions(actions: Record<string, ActionDefinition>): void;
  /**
   * Get a registered action definition.
   * @template TModel Specific FlowModel subclass type
   * @param {string} name Action name
   * @returns {ActionDefinition<TModel> | undefined} Action definition, or undefined if not found
   */
  getAction<TModel extends FlowModel = FlowModel, TCtx extends FlowContext = FlowRuntimeContext<TModel>>(
    name: string,
  ): ActionDefinition<TModel, TCtx> | undefined;
  /**
   * Get all registered global actions.
   * Returns a new Map to avoid external mutation of internal state.
   */
  getActions<TModel extends FlowModel = FlowModel, TCtx extends FlowContext = FlowRuntimeContext<TModel>>(): Map<
    string,
    ActionDefinition<TModel, TCtx>
  >;
  /**
   * Register multiple events.
   */
  registerEvents(events: Record<string, EventDefinition>): void;
  /**
   * Get a registered event definition.
   */
  getEvent<TModel extends FlowModel = FlowModel>(name: string): EventDefinition<TModel> | undefined;
  /**
   * Get all registered global events.
   */
  getEvents<TModel extends FlowModel = FlowModel>(): Map<string, EventDefinition<TModel>>;
  /**
   * Register multiple model classes.
   * @param {Record<string, ModelConstructor>} models Model class map, key is model name, value is model constructor
   * @returns {void}
   * @example
   * flowEngine.registerModels({ UserModel, OrderModel });
   */
  registerModels(models: Record<string, ModelConstructor | typeof FlowModel<any>>): void;
  registerResources(resources: Record<string, any>): void;
  createResource<T = FlowResource>(
    resourceType: ResourceType<T>,
    options?: {
      context?: FlowContext;
    },
  ): T;
  /**
   * Get all registered model classes.
   * @returns {Map<string, ModelConstructor>} Model class map
   */
  getModelClasses(): Map<string, ModelConstructor>;
  /**
   * Get a registered model class (constructor).
   * @param {string} name Model class name
   * @returns {ModelConstructor | undefined} Model constructor, or undefined if not found
   */
  getModelClass(name: string): ModelConstructor | undefined;
  /**
   * Find a registered model class by predicate.
   * @param predicate Callback function, arguments are (name, ModelClass), returns true if matched
   * @returns {[string, ModelConstructor] | undefined} Matched model class and name
   */
  findModelClass(
    predicate: (name: string, ModelClass: ModelConstructor) => boolean,
  ): [string, ModelConstructor] | undefined;
  /**
   * Filter model classes by base class (supports multi-level inheritance), with optional custom filter.
   * @param {string | ModelConstructor} baseClass Base class name or constructor
   * @param {(ModelClass: ModelConstructor, className: string) => boolean} [filter] Optional filter function
   * @returns {Map<string, ModelConstructor>} Model classes inherited from base class and passed the filter
   */
  getSubclassesOf(
    baseClass: string | ModelConstructor,
    filter?: (ModelClass: ModelConstructor, className: string) => boolean,
  ): Map<string, ModelConstructor>;
  /**
   * Create and register a model instance.
   * If an instance with the same UID exists, returns the existing instance.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {CreateModelOptions} options Model creation options
   * @returns {T} Created model instance
   */
  createModel<T extends FlowModel = FlowModel>(
    options: CreateModelOptions,
    extra?: {
      delegateToParent?: boolean;
      delegate?: FlowContext;
    },
  ): T;
  /**
   * 按类上的 resolveUse 链路解析最终用于实例化的模型类。
   * 允许模型类根据上下文动态指定实际使用的类，支持多级 resolveUse。
   */
  private _resolveModelClass;
  /**
   * 尝试应用当前模型可用 flow 的 defaultParams（如果存在）到 model.stepParams。
   * 仅对尚未存在的步骤参数进行填充，不覆盖已有值。
   */
  _applyFlowDefinitionDefaultParams(model: FlowModel): Promise<void>;
  /**
   * Get a model instance by UID.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {string} uid Model instance UID
   * @returns {T | undefined} Model instance, or undefined if not found
   */
  getModel<T extends FlowModel = FlowModel>(uid: string, global?: boolean): T | undefined;
  /**
   * Iterate all registered model instances.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {(model: T) => void} callback Callback function
   */
  forEachModel<T extends FlowModel = FlowModel>(callback: (model: T) => void): void;
  /**
   * Remove a local model instance.
   * @param {string} uid UID of the model instance to destroy
   * @returns {boolean} Returns true if successfully destroyed, false otherwise (e.g. instance does not exist)
   */
  removeModel(uid: string): boolean;
  /**
   * Remove a local model instance and all its sub-models recursively.
   * @param {string} uid UID of the model instance to destroy
   * @returns {boolean} Returns true if successfully destroyed, false otherwise
   */
  removeModelWithSubModels(uid: string): boolean;
  /**
   * Check if the model repository is set.
   * @returns {boolean} Returns true if set, false otherwise.
   * @private
   */
  private ensureModelRepository;
  /**
   * Try to locate a model instance in previous engines (view stack) by uid.
   * This is mainly used by view-scoped engines to reuse already-loaded model trees
   * (e.g. models created from local JSON) without hitting the repository.
   */
  private findModelInPreviousEngines;
  /**
   * Try to locate a sub-model in previous engines (view stack) by (parentId, subKey).
   */
  private findSubModelInPreviousEngines;
  /**
   * Hydrate a model into current engine from an already-existing model instance in previous engines.
   * - Avoids repository requests when the model tree is already present in memory.
   */
  private hydrateModelFromPreviousEngines;
  /**
   * Load a model instance (prefers local, falls back to repository).
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {any} options Load options
   * @returns {Promise<T | null>} Loaded model instance or null
   */
  loadModel<T extends FlowModel = FlowModel>(options: any): Promise<T | null>;
  /**
   * Find a sub-model by parent model ID and subKey.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {string} parentId Parent model UID
   * @param {string} subKey Sub-model key
   * @returns {T | null} Found sub-model or null
   */
  findModelByParentId<T extends FlowModel = FlowModel>(parentId: string, subKey: string): T | null;
  /**
   * Load or create a model instance.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {any} options Load or create options
   * @returns {Promise<T | null>} Model instance or null
   */
  loadOrCreateModel<T extends FlowModel = FlowModel>(
    options: any,
    extra?: {
      delegateToParent?: boolean;
      delegate?: FlowContext;
    },
  ): Promise<T | null>;
  /**
   * Persist and save a model instance.
   * Prevents concurrent saves of the same model by tracking save operations.
   * If a model is already being saved, subsequent calls will wait for the existing save to complete.
   *
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {T} model Model instance to save
   * @param {object} [options] Save options
   * @param {boolean} [options.onlyStepParams] Whether to save only step parameters
   * @returns {Promise<any>} Repository save result
   */
  saveModel<T extends FlowModel = FlowModel>(
    model: T,
    options?: {
      onlyStepParams?: boolean;
    },
  ): Promise<any>;
  /**
   * Perform the actual model save operation.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {T} model Model instance to save
   * @param {object} [options] Save options
   * @returns {Promise<any>} Repository save result
   * @private
   */
  _performModelSave<T extends FlowModel = FlowModel>(
    model: T,
    options?: {
      onlyStepParams?: boolean;
    },
  ): Promise<any>;
  /**
   * Destroy a model instance (persistently delete and remove local instance).
   * @param {string} uid UID of the model to destroy
   * @returns {Promise<boolean>} Whether destroyed successfully
   */
  destroyModel(uid: string): Promise<boolean>;
  /**
   * Duplicate a model tree via repository API.
   * Returns the duplicated model JSON (root with subModels) or null if not available.
   * @param {string} uid UID of the model to duplicate
   * @returns {Promise<any | null>} Duplicated model JSON or null
   */
  duplicateModel(uid: string): Promise<Record<string, any>>;
  /**
   * Replace a model instance with a new instance of a class.
   * @template T New model type
   * @param {string} uid UID of the model to replace
   * @param {Partial<FlowModelOptions> | ((oldModel: FlowModel) => Partial<FlowModelOptions>)} [optionsOrFn]
   *        Options for creating the new model, supports two forms:
   *        1. Pass options directly
   *        2. Pass a function that receives current options and returns new options
   * @returns {Promise<T | null>} Newly created model instance
   */
  replaceModel<T extends FlowModel = FlowModel>(
    uid: string,
    optionsOrFn?: Partial<FlowModelOptions> | ((currentOptions: FlowModelOptions) => Partial<FlowModelOptions>),
  ): Promise<T | null>;
  /**
   * Move a model instance within its parent model.
   * @param {any} sourceId Source model UID
   * @param {any} targetId Target model UID
   * @returns {Promise<void>} No return value
   */
  moveModel(sourceId: any, targetId: any, options?: PersistOptions): Promise<void>;
  /**
   * Filter model classes by parent class (supports multi-level inheritance).
   * @param {string | ModelConstructor} parentClass Parent class name or constructor
   * @returns {Map<string, ModelConstructor>} Model classes inherited from the specified parent class
   */
  filterModelClassByParent(parentClass: string | ModelConstructor): Map<any, any>;
  /**
   * Generate a unique key for the flow application cache.
   * @param {string} prefix Prefix
   * @param {string} flowKey Flow key
   * @param {string} modelUid Model UID
   * @returns {string} Unique cache key
   * @internal
   */
  static generateApplyFlowCacheKey(prefix: string, flowKey: string, modelUid: string): string;
}
