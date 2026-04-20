/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observable } from '@formily/reactive';
import _ from 'lodash';
import pino from 'pino';
import { EngineActionRegistry } from './action-registry/EngineActionRegistry';
import { EngineEventRegistry } from './event-registry/EngineEventRegistry';
import { FlowExecutor } from './executor/FlowExecutor';
import { FlowEngineContext } from './flowContext';
import { FlowSettings } from './flowSettings';
import { ErrorFlowModel, FlowModel } from './models';
import { ReactView } from './ReactView';
import { APIResource, FlowResource, MultiRecordResource, SingleRecordResource, SQLResource } from './resources';
import { Emitter } from './emitter';
import ModelOperationScheduler from './scheduler/ModelOperationScheduler';
import { isInheritedFrom } from './utils';
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
export class FlowEngine {
  /**
   * Global action registry
   */
  _actionRegistry = new EngineActionRegistry();
  /**
   * Global event registry
   */
  _eventRegistry = new EngineEventRegistry();
  /**
   * Registered model classes.
   * Key is the model class name, value is the model class constructor.
   * @private
   */
  _modelClasses = observable.shallow(new Map());
  /**
   * Created model instances.
   * Key is the model instance UID, value is the model instance object.
   * @private
   */
  _modelInstances = new Map();
  /**
   * The current model repository instance, implements IFlowModelRepository.
   * Used for model persistence and queries.
   * @private
   */
  _modelRepository = null;
  /**
   * Flow application cache.
   * Key is the cache key, value is ApplyFlowCacheEntry.
   * @private
   */
  _applyFlowCache = new Map();
  /**
   * Model saving state tracking.
   * Key is the model UID, value is the save promise.
   * @private
   */
  _savingModels = new Map();
  /**
   * Flow engine context object.
   * @private
   */
  _flowContext;
  /**
   * 视图作用域引擎的栈式链表指针。
   * - previousEngine：打开当前视图的上一个引擎
   * - nextEngine：在当前之上的下一个引擎
   */
  _previousEngine;
  _nextEngine;
  _resources = new Map();
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
  _dataSourceDirtyVersions = new Map();
  /**
   * 引擎事件总线（目前用于模型生命周期等事件）。
   * ViewScopedFlowEngine 持有自己的实例，实现作用域隔离。
   */
  emitter = new Emitter();
  /** 调度器：仅在 View 作用域引擎本地启用；根/Block 作用域默认不持有 */
  _modelOperationScheduler;
  logger;
  /**
   * Flow settings, including components and form scopes.
   * @public
   */
  flowSettings;
  /**
   * Experimental API: Integrates React view rendering capability into FlowEngine.
   * This property may change or be removed in the future. Use with caution.
   * @experimental
   * @public
   */
  reactView;
  /**
   * Flow executor that runs event flows.
   */
  executor;
  /**
   * Constructor. Initializes React view, registers default model and form scopes.
   */
  constructor() {
    this.reactView = new ReactView(this);
    this.flowSettings = new FlowSettings(this);
    this.flowSettings.registerScopes({ t: this.translate.bind(this) });
    this.registerModels({ FlowModel }); // 会造成循环依赖问题，移除掉
    this.registerResources({
      FlowResource,
      SQLResource,
      APIResource,
      SingleRecordResource,
      MultiRecordResource,
    });
    this.logger = pino({
      level: 'trace',
      browser: {
        write: {
          fatal: (o) => console.trace(o),
          error: (o) => console.error(o),
          warn: (o) => console.warn(o),
          info: (o) => console.info(o),
          debug: (o) => console.debug(o),
          trace: (o) => console.trace(o),
        },
      },
    });
    this.executor = new FlowExecutor(this);
  }
  /** 获取/创建当前引擎的调度器（仅在本地作用域） */
  getScheduler() {
    if (!this._modelOperationScheduler) {
      this._modelOperationScheduler = new ModelOperationScheduler(this);
    }
    return this._modelOperationScheduler;
  }
  /** 释放并清理当前引擎本地调度器（若存在） */
  disposeScheduler() {
    if (this._modelOperationScheduler) {
      try {
        this._modelOperationScheduler.dispose();
      } finally {
        this._modelOperationScheduler = undefined;
      }
    }
  }
  /**
   * Mark a data source resource as "dirty" (changed).
   * This is used by data blocks to decide whether to refresh when a view becomes active.
   */
  markDataSourceDirty(dataSourceKey, resourceName) {
    const dsKey = String(dataSourceKey || 'main');
    const resName = String(resourceName || '');
    if (!resName) return this.getDataSourceDirtyVersion(dsKey, resName);
    const ds = this._dataSourceDirtyVersions.get(dsKey) || new Map();
    if (!this._dataSourceDirtyVersions.has(dsKey)) {
      this._dataSourceDirtyVersions.set(dsKey, ds);
    }
    const next = (ds.get(resName) || 0) + 1;
    ds.set(resName, next);
    return next;
  }
  /**
   * Get current dirty version for a data source resource.
   * Returns 0 when no writes have been recorded.
   */
  getDataSourceDirtyVersion(dataSourceKey, resourceName) {
    const dsKey = String(dataSourceKey || 'main');
    const resName = String(resourceName || '');
    if (!resName) return 0;
    return this._dataSourceDirtyVersions.get(dsKey)?.get(resName) || 0;
  }
  /** 在目标模型生命周期达成时执行操作（仅在 View 引擎本地存储计划） */
  scheduleModelOperation(fromModelOrUid, toUid, fn, options) {
    return this.getScheduler().schedule(fromModelOrUid, toUid, fn, options);
  }
  /** 上一个引擎（根引擎为 undefined） */
  get previousEngine() {
    return this._previousEngine;
  }
  /** 下一个引擎（若存在） */
  get nextEngine() {
    return this._nextEngine;
  }
  /**
   * 将当前引擎链接到 prev 之后（用于视图打开时形成栈关系）。
   */
  linkAfter(engine) {
    // 找到栈底
    let prev = engine;
    while (prev._nextEngine) prev = prev._nextEngine;
    this._previousEngine = prev;
    if (prev) {
      prev._nextEngine = this;
    }
  }
  /**
   * 将当前引擎从栈中移除并修复相邻指针（用于视图关闭时）。
   */
  unlinkFromStack() {
    const prev = this._previousEngine;
    const next = this._nextEngine;
    if (prev) {
      prev._nextEngine = undefined;
    }
  }
  // （已移除）getModelGlobal/forEachModelGlobal/getAllModelsGlobal：不再维护冗余全局遍历 API
  /**
   * Get the flow engine context object.
   * @returns {FlowEngineContext} Flow engine context
   */
  get context() {
    if (!this._flowContext) {
      this._flowContext = new FlowEngineContext(this);
    }
    return this._flowContext;
  }
  get dataSourceManager() {
    return this.context.dataSourceManager;
  }
  /**
   * Get the flow application cache.
   * @returns {Map<string, ApplyFlowCacheEntry>} Flow application cache map
   * @internal
   */
  get applyFlowCache() {
    return this._applyFlowCache;
  }
  /**
   * Set the model repository for persisting and querying model instances.
   * If a model repository was already set, it will be overwritten and a warning will be printed.
   * @param {IFlowModelRepository} modelRepository The model repository instance implementing IFlowModelRepository.
   * @example
   * flowEngine.setModelRepository(new MyFlowModelRepository());
   */
  setModelRepository(modelRepository) {
    if (this._modelRepository) {
      console.warn('FlowEngine: Model repository is already set and will be overwritten.');
    }
    this._modelRepository = modelRepository;
  }
  get modelRepository() {
    return this._modelRepository;
  }
  /**
   * Internationalization translation method, calls the context's t method.
   * @param {string} keyOrTemplate Translation key or template string
   * @param {any} [options] Optional parameters
   * @returns {string} Translated string
   */
  translate(keyOrTemplate, options) {
    return this.context.t(keyOrTemplate, options);
  }
  /**
   * Register multiple actions.
   * @param {Record<string, ActionDefinition>} actions Action definition object collection
   */
  registerActions(actions) {
    this._actionRegistry.registerActions(actions);
  }
  /**
   * Get a registered action definition.
   * @template TModel Specific FlowModel subclass type
   * @param {string} name Action name
   * @returns {ActionDefinition<TModel> | undefined} Action definition, or undefined if not found
   */
  getAction(name) {
    return this._actionRegistry.getAction(name);
  }
  /**
   * Get all registered global actions.
   * Returns a new Map to avoid external mutation of internal state.
   */
  getActions() {
    return this._actionRegistry.getActions();
  }
  /**
   * Register multiple events.
   */
  registerEvents(events) {
    this._eventRegistry.registerEvents(events);
  }
  /**
   * Get a registered event definition.
   */
  getEvent(name) {
    return this._eventRegistry.getEvent(name);
  }
  /**
   * Get all registered global events.
   */
  getEvents() {
    return this._eventRegistry.getEvents();
  }
  /**
   * Register a single model class.
   * @param {string} name Model class name
   * @param {ModelConstructor} modelClass Model class constructor
   * @private
   */
  #registerModel(name, modelClass) {
    if (this._modelClasses.has(name)) {
      console.warn(`FlowEngine: Model class with name '${name}' is already registered and will be overwritten.`);
    }
    Object.defineProperty(modelClass, 'name', { value: name });
    this._modelClasses.set(name, modelClass);
  }
  /**
   * Register multiple model classes.
   * @param {Record<string, ModelConstructor>} models Model class map, key is model name, value is model constructor
   * @returns {void}
   * @example
   * flowEngine.registerModels({ UserModel, OrderModel });
   */
  registerModels(models) {
    for (const [name, modelClass] of Object.entries(models)) {
      this.#registerModel(name, modelClass);
    }
  }
  registerResources(resources) {
    for (const [name, resourceClass] of Object.entries(resources)) {
      this._resources.set(name, resourceClass);
    }
  }
  createResource(resourceType, options) {
    if (typeof resourceType === 'string') {
      const ResourceClass = this._resources.get(resourceType);
      if (!ResourceClass) {
        throw new Error(`Resource class '${resourceType}' not found. Please register it first.`);
      }
      return new ResourceClass(options?.context || this.context);
    }
    const R = resourceType;
    return new R(options?.context || this.context);
  }
  /**
   * Get all registered model classes.
   * @returns {Map<string, ModelConstructor>} Model class map
   */
  getModelClasses() {
    return this._modelClasses;
  }
  /**
   * Get a registered model class (constructor).
   * @param {string} name Model class name
   * @returns {ModelConstructor | undefined} Model constructor, or undefined if not found
   */
  getModelClass(name) {
    return this._modelClasses.get(name);
  }
  /**
   * Find a registered model class by predicate.
   * @param predicate Callback function, arguments are (name, ModelClass), returns true if matched
   * @returns {[string, ModelConstructor] | undefined} Matched model class and name
   */
  findModelClass(predicate) {
    for (const [name, ModelClass] of this._modelClasses) {
      if (predicate(name, ModelClass)) {
        return [name, ModelClass];
      }
    }
    return undefined;
  }
  /**
   * Filter model classes by base class (supports multi-level inheritance), with optional custom filter.
   * @param {string | ModelConstructor} baseClass Base class name or constructor
   * @param {(ModelClass: ModelConstructor, className: string) => boolean} [filter] Optional filter function
   * @returns {Map<string, ModelConstructor>} Model classes inherited from base class and passed the filter
   */
  getSubclassesOf(baseClass, filter) {
    const parentModelClass = typeof baseClass === 'string' ? this.getModelClass(baseClass) : baseClass;
    const result = new Map();
    if (!parentModelClass) return result;
    for (const [className, ModelClass] of this._modelClasses) {
      if (isInheritedFrom(ModelClass, parentModelClass)) {
        if (!filter || filter(ModelClass, className)) {
          result.set(className, ModelClass);
        }
      }
    }
    return result;
  }
  /**
   * Create and register a model instance.
   * If an instance with the same UID exists, returns the existing instance.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {CreateModelOptions} options Model creation options
   * @returns {T} Created model instance
   */
  createModel(options, extra) {
    const { parentId, uid, use: modelClassName, subModels } = options;
    const parentModel = parentId ? this.getModel(parentId) || this.previousEngine?.getModel(parentId) : undefined;
    const ModelClass = this._resolveModelClass(
      typeof modelClassName === 'string' ? this.getModelClass(modelClassName) : modelClassName,
      options,
      parentModel,
    );
    if (uid && this._modelInstances.has(uid)) {
      return this._modelInstances.get(uid);
    }
    let modelInstance;
    if (!ModelClass) {
      modelInstance = new ErrorFlowModel({ ...options, flowEngine: this });
      modelInstance.setErrorMessage(`Model class '${modelClassName}' not found. Please register it first.`);
    } else {
      modelInstance = new ModelClass({ ...options, flowEngine: this });
    }
    if (extra?.delegate) {
      modelInstance.context.addDelegate(extra.delegate);
    }
    if (parentModel) {
      modelInstance.setParent(parentModel);
      if (extra?.delegateToParent === false) {
        modelInstance.removeParentDelegate();
      }
    }
    this._modelInstances.set(modelInstance.uid, modelInstance);
    modelInstance.onInit(options);
    // 发射 created 生命周期事件
    void this.emitter.emitAsync('model:created', {
      uid: modelInstance.uid,
      model: modelInstance,
    });
    // 在模型实例化阶段应用 flow 级 defaultParams（仅填充缺失的 stepParams，不覆盖）
    // 不阻塞创建流程：允许 defaultParams 为异步函数
    this._applyFlowDefinitionDefaultParams(modelInstance).catch((err) => {
      console.warn('FlowEngine: apply flow defaultParams failed:', err);
    });
    modelInstance._createSubModels(options.subModels);
    return modelInstance;
  }
  /**
   * 按类上的 resolveUse 链路解析最终用于实例化的模型类。
   * 允许模型类根据上下文动态指定实际使用的类，支持多级 resolveUse。
   */
  _resolveModelClass(initial, options, parent) {
    const normalize = (resolved) => {
      if (!resolved) return {};
      if (typeof resolved === 'object' && 'use' in resolved) {
        return { target: resolved.use, stop: !!resolved.stop };
      }
      return { target: resolved, stop: false };
    };
    let current = initial;
    const visited = new Set();
    while (current) {
      if (visited.has(current)) {
        console.warn(`FlowEngine: resolveUse circular reference detected on '${current.name}'.`);
        break;
      }
      visited.add(current);
      const resolver = current?.resolveUse;
      if (typeof resolver !== 'function') {
        break;
      }
      const { target, stop } = normalize(resolver(options, this, parent));
      if (!target || target === current) {
        break;
      }
      let next;
      if (typeof target === 'string') {
        next = this.getModelClass(target);
        if (!next) {
          console.warn(`FlowEngine: resolveUse returned '${target}' but no model is registered under that name.`);
          return undefined;
        }
      } else {
        next = target;
      }
      current = next;
      if (stop) {
        break;
      }
    }
    return current;
  }
  /**
   * 尝试应用当前模型可用 flow 的 defaultParams（如果存在）到 model.stepParams。
   * 仅对尚未存在的步骤参数进行填充，不覆盖已有值。
   */
  async _applyFlowDefinitionDefaultParams(model) {
    try {
      const flows = model.getFlows();
      if (!flows || flows.size === 0) return;
      const ctx = model.context;
      for (const [flowKey, flowDef] of flows.entries()) {
        const dp = flowDef.defaultParams;
        if (!dp) continue;
        let resolved;
        try {
          resolved = typeof dp === 'function' ? await dp(ctx) : dp;
        } catch (e) {
          console.warn(`FlowEngine: resolve defaultParams of flow '${flowKey}' failed:`, e);
          continue;
        }
        if (!resolved || typeof resolved !== 'object') continue;
        // 仅支持：返回当前 flow 的步骤对象 { [stepKey]: params }
        const stepsMap = flowDef.getSteps?.();
        const stepKeys = stepsMap ? Array.from(stepsMap.keys()) : Object.keys(flowDef.steps || {});
        const entries = Object.entries(resolved).filter(([k]) => stepKeys.includes(k));
        if (entries.length === 0) continue;
        for (const [stepKey, params] of entries) {
          const exists = model.getStepParams(flowKey, stepKey);
          if (exists === undefined && params && typeof params === 'object') {
            model.setStepParams(flowKey, stepKey, params);
          }
        }
      }
    } catch (error) {
      console.warn('FlowEngine: apply flow defaultParams error:', error);
    }
  }
  /**
   * Get a model instance by UID.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {string} uid Model instance UID
   * @returns {T | undefined} Model instance, or undefined if not found
   */
  getModel(uid, global) {
    // 默认仅在当前引擎查找；只有当 global === true 时才跨视图栈查找
    if (!global) {
      return this._modelInstances.get(uid);
    }
    // 跨视图栈查找：按视图栈从栈顶到根逐个查找
    // 1) 找到栈顶引擎
    let top = this;
    while (top.nextEngine) top = top.nextEngine;
    // 2) 从栈顶向下查找，命中即返回
    let eng = top;
    while (eng) {
      const found = eng._modelInstances.get(uid);
      if (found) return found;
      eng = eng.previousEngine;
    }
    return undefined;
  }
  /**
   * Iterate all registered model instances.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {(model: T) => void} callback Callback function
   */
  forEachModel(callback) {
    this._modelInstances.forEach(callback);
  }
  /**
   * Remove a local model instance.
   * @param {string} uid UID of the model instance to destroy
   * @returns {boolean} Returns true if successfully destroyed, false otherwise (e.g. instance does not exist)
   */
  removeModel(uid) {
    if (!this._modelInstances.has(uid)) {
      console.warn(`FlowEngine: Model with UID '${uid}' does not exist.`);
      return false;
    }
    const modelInstance = this._modelInstances.get(uid);
    // Ensure any cached beforeRender results tied to this uid are cleared before removal.
    modelInstance.invalidateFlowCache(undefined, true);
    modelInstance.clearForks();
    // 从父模型中移除当前模型的引用
    if (modelInstance.parent?.subModels) {
      for (const subKey in modelInstance.parent.subModels) {
        const subModelValue = modelInstance.parent.subModels[subKey];
        if (Array.isArray(subModelValue)) {
          const index = subModelValue.findIndex((subModel) => subModel == modelInstance);
          if (index !== -1) {
            subModelValue.splice(index, 1);
            modelInstance.parent.emitter.emit('onSubModelRemoved', modelInstance);
            this.emitter?.emit('model:subModel:removed', {
              parentUid: modelInstance.parent.uid,
              parent: modelInstance.parent,
              model: modelInstance,
            });
            break;
          }
        } else if (subModelValue && subModelValue === modelInstance) {
          delete modelInstance.parent.subModels[subKey];
          modelInstance.parent.emitter.emit('onSubModelRemoved', modelInstance);
          this.emitter?.emit('model:subModel:removed', {
            parentUid: modelInstance.parent.uid,
            parent: modelInstance.parent,
            model: modelInstance,
          });
          break;
        }
      }
    }
    this._modelInstances.delete(uid);
    // 发射 destroyed 生命周期事件（在移除后，但携带实例便于调度器传递；严格模式：不吞错）
    void this.emitter.emitAsync('model:destroyed', {
      uid,
      model: modelInstance,
    });
    return true;
  }
  /**
   * Remove a local model instance and all its sub-models recursively.
   * @param {string} uid UID of the model instance to destroy
   * @returns {boolean} Returns true if successfully destroyed, false otherwise
   */
  removeModelWithSubModels(uid) {
    const model = this.getModel(uid);
    if (!model) {
      return false;
    }
    const collectDescendants = (m, acc) => {
      if (m.subModels) {
        for (const key in m.subModels) {
          const sub = m.subModels[key];
          if (Array.isArray(sub)) {
            [...sub].forEach((s) => collectDescendants(s, acc));
          } else if (sub) {
            collectDescendants(sub, acc);
          }
        }
      }
      acc.push(m);
    };
    const allModels = [];
    collectDescendants(model, allModels);
    let success = true;
    for (const m of allModels) {
      if (!this.removeModel(m.uid)) {
        success = false;
      }
    }
    return success;
  }
  /**
   * Check if the model repository is set.
   * @returns {boolean} Returns true if set, false otherwise.
   * @private
   */
  ensureModelRepository() {
    if (!this._modelRepository) {
      // 不抛错，直接返回 false
      return false;
    }
    return true;
  }
  /**
   * Try to locate a model instance in previous engines (view stack) by uid.
   * This is mainly used by view-scoped engines to reuse already-loaded model trees
   * (e.g. models created from local JSON) without hitting the repository.
   */
  findModelInPreviousEngines(uid) {
    let eng = this.previousEngine;
    while (eng) {
      const found = eng.getModel(uid);
      if (found) return found;
      eng = eng.previousEngine;
    }
    return undefined;
  }
  /**
   * Try to locate a sub-model in previous engines (view stack) by (parentId, subKey).
   */
  findSubModelInPreviousEngines(parentId, subKey) {
    let eng = this.previousEngine;
    while (eng) {
      const parent = eng.getModel(parentId);
      if (parent) {
        const sub = parent.subModels?.[subKey];
        if (sub) {
          const model = Array.isArray(sub) ? sub[0] : sub;
          if (model) return { parent, model };
        }
      }
      eng = eng.previousEngine;
    }
    return undefined;
  }
  /**
   * Hydrate a model into current engine from an already-existing model instance in previous engines.
   * - Avoids repository requests when the model tree is already present in memory.
   */
  hydrateModelFromPreviousEngines(options, extra) {
    const uid = options?.uid;
    const parentId = options?.parentId;
    const subKey = options?.subKey;
    // 1) Prefer exact uid match when provided.
    if (uid && !this._modelInstances.has(uid)) {
      const existing = this.findModelInPreviousEngines(uid);
      if (existing?.context.flowSettingsEnabled) {
        // 如果模型实例启用 flowSettingsEnabled，直接返回 null, 避免旧数据
        return null;
      }
      if (existing) {
        const data = existing.serialize();
        return this.createModel(data, extra);
      }
    }
    // 2) Parent/subKey lookup (common for pages/popups).
    if (parentId && subKey) {
      const found = this.findSubModelInPreviousEngines(parentId, subKey);
      if (!found || found.parent.context.flowSettingsEnabled) return null;
      const { parent: parentFromPrev, model: modelFromPrev } = found;
      // Ensure the parent shell exists in current engine so findModelByParentId can work locally.
      let localParent = this.getModel(parentId);
      if (!localParent) {
        const parentData = parentFromPrev.serialize();
        delete parentData.subModels;
        localParent = this.createModel(parentData, extra);
      }
      // Create (or reuse) the sub-model instance in current engine.
      const modelData = modelFromPrev.serialize();
      const localModel = this.createModel(modelData, extra);
      // Mount under local parent if not mounted yet (so later lookups by parentId/subKey won't hit repo).
      const mounted = localParent.subModels?.[subKey];
      if (Array.isArray(mounted)) {
        const exists = mounted.some((m) => m?.uid === localModel?.uid);
        if (!exists) {
          localParent.addSubModel(subKey, localModel);
        }
      } else if (mounted instanceof FlowModel) {
        // Keep existing instance when uid matches; otherwise, replace.
        if (mounted.uid !== localModel?.uid) {
          localParent.setSubModel(subKey, localModel);
        }
      } else {
        if (localModel?.subType === 'array') {
          localParent.addSubModel(subKey, localModel);
        } else {
          localParent.setSubModel(subKey, localModel);
        }
      }
      return localModel;
    }
    return null;
  }
  /**
   * Load a model instance (prefers local, falls back to repository).
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {any} options Load options
   * @returns {Promise<T | null>} Loaded model instance or null
   */
  async loadModel(options) {
    if (!this.ensureModelRepository()) return;
    const refresh = !!options?.refresh;
    if (!refresh) {
      const model = this.findModelByParentId(options.parentId, options.subKey);
      if (model) {
        return model;
      }
      const hydrated = this.hydrateModelFromPreviousEngines(options);
      if (hydrated) {
        return hydrated;
      }
    }
    const data = await this._modelRepository.findOne(options);
    if (!data?.uid) return null;
    if (refresh) {
      const existing = this.getModel(data.uid);
      if (existing) {
        this.removeModelWithSubModels(existing.uid);
      }
    }
    return this.createModel(data);
  }
  /**
   * Find a sub-model by parent model ID and subKey.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {string} parentId Parent model UID
   * @param {string} subKey Sub-model key
   * @returns {T | null} Found sub-model or null
   */
  findModelByParentId(parentId, subKey) {
    if (parentId && this._modelInstances.has(parentId)) {
      const parentModel = this._modelInstances.get(parentId);
      if (parentModel && parentModel.subModels[subKey]) {
        const subModels = parentModel.subModels[subKey];
        if (Array.isArray(subModels)) {
          return subModels[0]; // 返回第一个子模型
        } else {
          return subModels;
        }
      }
    }
  }
  /**
   * Load or create a model instance.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {any} options Load or create options
   * @returns {Promise<T | null>} Model instance or null
   */
  async loadOrCreateModel(options, extra) {
    if (!this.ensureModelRepository()) return;
    const { uid, parentId, subKey } = options;
    if (uid && this._modelInstances.has(uid)) {
      return this._modelInstances.get(uid);
    }
    const m = this.findModelByParentId(parentId, subKey);
    if (m) {
      return m;
    }
    const hydrated = this.hydrateModelFromPreviousEngines(options, extra);
    if (hydrated) {
      return hydrated;
    }
    const data = await this._modelRepository.findOne(options);
    let model = null;
    if (data?.uid) {
      model = this.createModel(data, extra);
    } else {
      model = this.createModel(options, extra);
      await model.save();
    }
    if (model.parent) {
      const subModel = model.parent.findSubModel(model.subKey, (m) => {
        return m.uid === model.uid;
      });
      if (subModel) {
        return model;
      }
      if (model.subType === 'array') {
        model.parent.addSubModel(model.subKey, model);
      } else {
        model.parent.setSubModel(model.subKey, model);
      }
    }
    return model;
  }
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
  async saveModel(model, options) {
    if (!this.ensureModelRepository()) return;
    const modelUid = model.uid;
    // 如果这个 model 正在保存中，返回现有的保存 Promise
    if (this._savingModels.has(modelUid)) {
      this.logger.debug(`Model ${modelUid} is already being saved, waiting for existing save operation`);
      return await this._savingModels.get(modelUid);
    }
    // 创建保存 Promise 并添加到追踪 Map 中
    const savePromise = this._performModelSave(model, options);
    this._savingModels.set(modelUid, savePromise);
    try {
      const result = await savePromise;
      return result;
    } finally {
      // 无论成功还是失败，都要清除保存状态
      this._savingModels.delete(modelUid);
    }
  }
  /**
   * Perform the actual model save operation.
   * @template T FlowModel subclass type, defaults to FlowModel.
   * @param {T} model Model instance to save
   * @param {object} [options] Save options
   * @returns {Promise<any>} Repository save result
   * @private
   */
  async _performModelSave(model, options) {
    this.logger.debug(`Starting save operation for model ${model.uid}`);
    try {
      const result = await this._modelRepository.save(model, options);
      this.logger.debug(`Successfully saved model ${model.uid}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to save model ${model.uid}:`, error);
      throw error;
    }
  }
  /**
   * Destroy a model instance (persistently delete and remove local instance).
   * @param {string} uid UID of the model to destroy
   * @returns {Promise<boolean>} Whether destroyed successfully
   */
  async destroyModel(uid) {
    if (this.ensureModelRepository()) {
      await this._modelRepository.destroy(uid);
    }
    const modelInstance = this._modelInstances.get(uid);
    const parent = modelInstance?.parent;
    const result = this.removeModel(uid);
    parent && parent.emitter.emit('onSubModelDestroyed', modelInstance);
    return result;
  }
  /**
   * Duplicate a model tree via repository API.
   * Returns the duplicated model JSON (root with subModels) or null if not available.
   * @param {string} uid UID of the model to duplicate
   * @returns {Promise<any | null>} Duplicated model JSON or null
   */
  async duplicateModel(uid) {
    if (!this.ensureModelRepository()) return null;
    return this._modelRepository.duplicate(uid);
  }
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
  async replaceModel(uid, optionsOrFn) {
    const oldModel = this.getModel(uid);
    if (!oldModel) {
      console.warn(`FlowEngine: Cannot replace model. Model with UID '${uid}' not found.`);
      return null;
    }
    // 1. 保存当前模型的关键信息
    const currentParent = oldModel.parent;
    const currentSubKey = oldModel.subKey;
    const currentSubType = oldModel.subType;
    const currentOptions = oldModel.serialize();
    // 2. 确定新的选项
    let userOptions;
    if (typeof optionsOrFn === 'function') {
      // 函数模式：传入当前options，获取新的options
      userOptions = optionsOrFn(oldModel);
    } else {
      // 对象模式：直接使用提供的options替换
      userOptions = optionsOrFn || {};
    }
    // 3. 合并用户选项和关键属性
    const newOptions = {
      ..._.omit(currentOptions, ['subModels']),
      ...userOptions,
    };
    // 暂停父模型的事件触发,
    // TODO: find a better way to do this
    if (currentParent) {
      currentParent.emitter.setPaused(true);
    }
    // 4. 销毁当前模型（这会处理所有清理工作：持久化删除、内存清理、父模型引用等）
    await oldModel.destroy();
    // 5. 使用createModel创建新的模型实例
    const newModel = this.createModel(newOptions);
    // 6. 如果有父模型，将新模型添加到父模型的subModels中
    if (currentParent && currentSubKey) {
      if (currentSubType === 'array') {
        // 对于数组类型，使用addSubModel方法
        currentParent.addSubModel(currentSubKey, newModel);
      } else {
        // 对于对象类型，使用setSubModel方法
        currentParent.setSubModel(currentSubKey, newModel);
      }
    }
    // 7. 触发事件以通知其他部分模型已替换
    if (currentParent) {
      currentParent.emitter.setPaused(false);
      currentParent.parent.invalidateFlowCache('beforeRender', true);
      currentParent.parent?.rerender();
      currentParent.emitter.emit('onSubModelReplaced', { oldModel, newModel });
      this.emitter?.emit('model:subModel:replaced', {
        parentUid: currentParent.uid,
        parent: currentParent,
        oldModel,
        newModel,
      });
    }
    await newModel.save();
    return newModel;
  }
  /**
   * Move a model instance within its parent model.
   * @param {any} sourceId Source model UID
   * @param {any} targetId Target model UID
   * @returns {Promise<void>} No return value
   */
  async moveModel(sourceId, targetId, options) {
    const sourceModel = this.getModel(sourceId);
    const targetModel = this.getModel(targetId);
    if (!sourceModel || !targetModel) {
      console.warn(`FlowEngine: Cannot move model. Source or target model not found.`);
      return;
    }
    const move = (sourceModel, targetModel) => {
      if (!sourceModel.parent || !targetModel.parent || sourceModel.parent !== targetModel.parent) {
        console.error('FlowModel.moveTo: Both models must have the same parent to perform move operation.');
        return false;
      }
      const subModels = sourceModel.parent.subModels[sourceModel.subKey];
      if (!subModels || !Array.isArray(subModels)) {
        console.error('FlowModel.moveTo: Parent subModels must be an array to perform move operation.');
        return false;
      }
      const subModelsCopy = [...subModels];
      const findIndex = (model) => subModelsCopy.findIndex((item) => item.uid === model.uid);
      const currentIndex = findIndex(sourceModel);
      const targetIndex = findIndex(targetModel);
      if (currentIndex === -1 || targetIndex === -1) {
        console.error('FlowModel.moveTo: Current or target model not found in parent subModels.');
        return false;
      }
      if (currentIndex === targetIndex) {
        console.warn('FlowModel.moveTo: Current model is already at the target position. No action taken.');
        return false;
      }
      // 使用splice直接移动数组元素（O(n)比排序O(n log n)更快）
      const [movedModel] = subModelsCopy.splice(currentIndex, 1);
      subModelsCopy.splice(targetIndex, 0, movedModel);
      // 重新分配连续的sortIndex
      subModelsCopy.forEach((model, index) => {
        model.sortIndex = index;
      });
      // 更新父模型的 subModels 引用，确保拖拽后仍为可观察数组
      subModels.splice(0, subModels.length, ...subModelsCopy);
      return true;
    };
    move(sourceModel, targetModel);
    if (options?.persist !== false && this.ensureModelRepository()) {
      const position = sourceModel.sortIndex - targetModel.sortIndex > 0 ? 'after' : 'before';
      await this._modelRepository.move(sourceId, targetId, position);
    }
    // 触发事件以通知其他部分模型已移动
    sourceModel.parent.emitter.emit('onSubModelMoved', { source: sourceModel, target: targetModel });
    this.emitter?.emit('model:subModel:moved', {
      parentUid: sourceModel.parent?.uid,
      parent: sourceModel.parent,
      source: sourceModel,
      target: targetModel,
    });
  }
  /**
   * Filter model classes by parent class (supports multi-level inheritance).
   * @param {string | ModelConstructor} parentClass Parent class name or constructor
   * @returns {Map<string, ModelConstructor>} Model classes inherited from the specified parent class
   */
  filterModelClassByParent(parentClass) {
    const parentModelClass = typeof parentClass === 'string' ? this.getModelClass(parentClass) : parentClass;
    if (!parentModelClass) {
      return new Map();
    }
    const modelClasses = new Map();
    for (const [className, ModelClass] of this._modelClasses) {
      if (isInheritedFrom(ModelClass, parentModelClass)) {
        modelClasses.set(className, ModelClass);
      }
    }
    return modelClasses;
  }
  /**
   * Generate a unique key for the flow application cache.
   * @param {string} prefix Prefix
   * @param {string} flowKey Flow key
   * @param {string} modelUid Model UID
   * @returns {string} Unique cache key
   * @internal
   */
  static generateApplyFlowCacheKey(prefix, flowKey, modelUid) {
    return `${prefix}:${flowKey}:${modelUid}`;
  }
}
//# sourceMappingURL=flowEngine.js.map
