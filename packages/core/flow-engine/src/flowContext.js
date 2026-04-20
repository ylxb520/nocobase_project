/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observable } from '@formily/reactive';
import * as antd from 'antd';
import _ from 'lodash';
import qs from 'qs';
import React, { createRef } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { ElementProxy } from './ElementProxy';
import { ACL } from './acl/Acl';
import { ContextPathProxy } from './ContextPathProxy';
import { DataSource, DataSourceManager } from './data-source';
import { FlowEngine } from './flowEngine';
import { FlowI18n } from './flowI18n';
import { JSRunner } from './JSRunner';
import { FlowSQLRepository } from './resources';
import {
  escapeT,
  extractPropertyPath,
  extractUsedVariablePaths,
  FLOW_ENGINE_NAMESPACE,
  isCtxDatePathPrefix,
  isCssFile,
  prepareRunJsCode,
  resolveCtxDatePath,
  resolveDefaultParams,
  resolveExpressions,
  resolveModuleUrl,
} from './utils';
import { FlowExitAllException } from './utils/exceptions';
import { enqueueVariablesResolve } from './utils/params-resolvers';
import { buildServerContextParams as _buildServerContextParams } from './utils/serverContextParams';
import { inferRecordRef } from './utils/variablesParams';
import { RunJSContextRegistry, getModelClassName } from './runjs-context/registry';
import { createEphemeralContext } from './utils/createEphemeralContext';
import dayjs from 'dayjs';
import { externalReactRender, setupRunJSLibs } from './runjsLibs';
import { runjsImportAsync, runjsImportModule, runjsRequireAsync } from './utils/runjsModuleLoader';
// Helper: detect a RecordRef-like object
function isRecordRefLike(val) {
  return !!(val && typeof val === 'object' && 'collection' in val && 'filterByTk' in val);
}
// Helper: Filter builder output by subpaths that need server resolution
// - built can be RecordRef (top-level var) or an object mapping subKey -> RecordRef (e.g., { record: ref })
function filterBuilderOutputByPaths(built, neededPaths) {
  if (!neededPaths || neededPaths.length === 0) return undefined;
  if (isRecordRefLike(built)) return built;
  if (built && typeof built === 'object' && !Array.isArray(built)) {
    const out = {};
    for (const [k, v] of Object.entries(built)) {
      const hit = neededPaths.some((p) => p === k || p.startsWith(`${k}.`) || p.startsWith(`${k}[`));
      if (hit) out[k] = v;
    }
    return out;
  }
  return undefined;
}
// Helper: extract top-level segment of a subpath (e.g. 'a.b' -> 'a', 'tags[0].name' -> 'tags')
function topLevelOf(subPath) {
  if (!subPath) return undefined;
  const m = String(subPath).match(/^([^.[]+)/);
  return m?.[1];
}
// Helper: infer selects (fields/appends) from usage paths (mirrors server-side inferSelectsFromUsage)
function inferSelectsFromUsage(paths = []) {
  if (!Array.isArray(paths) || paths.length === 0) {
    return { generatedAppends: undefined, generatedFields: undefined };
  }
  const appendSet = new Set();
  const fieldSet = new Set();
  const normalizePath = (raw) => {
    if (!raw) return '';
    let s = String(raw);
    // remove numeric indexes like [0]
    s = s.replace(/\[(?:\d+)\]/g, '');
    // normalize string indexes like ["name"] / ['name'] into .name
    s = s.replace(/\[(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')\]/g, (_m, g1, g2) => `.${g1 || g2}`);
    s = s.replace(/\.\.+/g, '.');
    s = s.replace(/^\./, '').replace(/\.$/, '');
    return s;
  };
  for (let path of paths) {
    if (!path) continue;
    // drop leading numeric index like [0].name
    while (/^\[(\d+)\](\.|$)/.test(path)) {
      path = path.replace(/^\[(\d+)\]\.?/, '');
    }
    const norm = normalizePath(path);
    if (!norm) continue;
    const segments = norm.split('.').filter(Boolean);
    if (segments.length === 0) continue;
    if (segments.length === 1) {
      fieldSet.add(segments[0]);
      continue;
    }
    for (let i = 0; i < segments.length - 1; i++) {
      appendSet.add(segments.slice(0, i + 1).join('.'));
    }
    fieldSet.add(segments.join('.'));
  }
  const generatedAppends = appendSet.size ? Array.from(appendSet) : undefined;
  const generatedFields = fieldSet.size ? Array.from(fieldSet) : undefined;
  return { generatedAppends, generatedFields };
}
export class FlowContext {
  _props = {};
  _methods = {};
  _methodInfos = {};
  _cache = {};
  _observableCache = observable.shallow({});
  _delegates = [];
  _pending = {};
  #proxy = null;
  _metaNodeCache = new WeakMap();
  createProxy() {
    if (this.#proxy) {
      return this.#proxy;
    }
    this.#proxy = new Proxy(this, {
      get: (target, key, receiver) => {
        if (typeof key === 'string') {
          // 1. 检查是否为直接属性或方法，如果是则跳过委托链查找
          if (Reflect.has(target, key)) {
            const val = Reflect.get(target, key, receiver);
            if (typeof val === 'function') return val.bind(target);
            return val;
          }
          // 2. 优先查找自身 _props
          if (Object.prototype.hasOwnProperty.call(target._props, key)) {
            return target._getOwnProperty(key, this.createProxy());
          }
          // 3. 优先查找自身 _methods
          if (Object.prototype.hasOwnProperty.call(target._methods, key)) {
            return target._getOwnMethod(key, this.createProxy());
          }
          // 4. 只有在自身没有该属性时才查找委托链
          const found = this._findInDelegates(target._delegates, key);
          if (found !== undefined) return found.result;
          return undefined;
        }
        return Reflect.get(target, key, receiver);
      },
      has: (target, key) => {
        if (typeof key === 'string') {
          // 1. 检查直接属性
          if (Reflect.has(target, key)) return true;
          // 2. 检查 _props 和 _methods
          if (Object.prototype.hasOwnProperty.call(target._props, key)) return true;
          if (Object.prototype.hasOwnProperty.call(target._methods, key)) return true;
          // 3. 检查委托链
          if (this._hasInDelegates(target._delegates, key)) return true;
        }
        return Reflect.has(target, key);
      },
    });
    return this.#proxy;
  }
  constructor() {
    return this.createProxy();
  }
  defineProperty(key, options) {
    if (this._props[key] && this._props[key]?.once) {
      return;
    }
    // 清除旧属性对应的缓存
    const oldOptions = this._props[key];
    if (oldOptions?.meta) {
      this._clearMetaNodeCacheFor(oldOptions.meta);
    }
    this._props[key] = options;
    delete this._observableCache[key]; // 清除旧的 observable 缓存
    delete this._cache[key];
    // 用 Object.defineProperty 挂载到实例上，便于 ctx.foo 直接访问
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      get: () => this._getOwnProperty(key, this.createProxy()),
    });
  }
  defineMethod(name, fn, info) {
    this._methods[name] = fn;
    if (typeof info === 'string') {
      this._methodInfos[name] = { description: info };
    } else if (info && typeof info === 'object') {
      this._methodInfos[name] = info;
    } else {
      delete this._methodInfos[name];
    }
    Object.defineProperty(this, name, {
      configurable: true,
      enumerable: false,
      writable: false,
      value: fn.bind(this.createProxy()),
    });
  }
  removeCache(key) {
    if (key in this._observableCache) {
      delete this._observableCache[key];
      return true;
    }
    if (key in this._cache) {
      delete this._cache[key];
      return true;
    }
    if (key in this._pending) {
      delete this._pending[key];
      return true;
    }
    // 递归清理委托链
    for (const delegate of this._delegates) {
      if (delegate.removeCache(key)) {
        return true;
      }
    }
  }
  delegate(ctx) {
    if (!(ctx instanceof FlowContext)) {
      throw new Error('Delegate must be an instance of FlowContext');
    }
    // 防止重复委托同一个 context
    if (this._delegates.includes(ctx)) {
      console.warn(`[FlowContext] delegate - skip duplicate delegate: ${this._delegates.length}`);
      return;
    }
    this._delegates.unshift(ctx);
  }
  addDelegate(ctx) {
    if (!(ctx instanceof FlowContext)) {
      throw new Error('Delegate must be an instance of FlowContext');
    }
    if (!this._delegates.includes(ctx)) {
      this._delegates.unshift(ctx);
    }
  }
  clearDelegates() {
    this._delegates = [];
    this._metaNodeCache = new WeakMap(); // 清除缓存
  }
  removeDelegate(ctx) {
    if (!(ctx instanceof FlowContext)) {
      throw new Error('Delegate must be an instance of FlowContext');
    }
    const index = this._delegates.indexOf(ctx);
    if (index !== -1) {
      this._delegates.splice(index, 1);
      // 不需要清除缓存：委托链变化不影响基于 meta 内容的缓存
    }
  }
  /**
   * 清除特定 meta 对象的缓存
   */
  _clearMetaNodeCacheFor(meta) {
    this._metaNodeCache.delete(meta);
  }
  has(key) {
    return !!this._props[key];
  }
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
  getPropertyMetaTree(value, options) {
    const metaMap = this._getPropertiesMeta();
    // 如果有 value 参数，尝试返回对应属性的子树
    if (value) {
      const propertyPath = extractPropertyPath(value);
      if (propertyPath && propertyPath.length > 0) {
        const loadChildrenFrom = async (metaOrFactory, fullPath, finalKey) => {
          try {
            const meta = typeof metaOrFactory === 'function' ? await metaOrFactory() : metaOrFactory;
            if (!meta?.properties) return [];
            let props = meta.properties;
            if (typeof props === 'function') {
              const resolved = await props();
              meta.properties = resolved;
              props = resolved;
            }
            const childNodes = this.#createChildNodes(props, fullPath, [], meta);
            return Array.isArray(childNodes) ? childNodes : await childNodes();
          } catch (error) {
            console.warn(`Failed to load meta for ${finalKey}:`, error);
            return [];
          }
        };
        const targetMeta = this.#findMetaByPath(propertyPath);
        if (targetMeta) {
          const [finalKey, metaOrFactory, fullPath] = targetMeta;
          const depth = propertyPath.length;
          if (depth === 1) {
            if (typeof metaOrFactory === 'function') {
              return () => loadChildrenFrom(metaOrFactory, fullPath, finalKey);
            }
            if (metaOrFactory.properties) {
              if (typeof metaOrFactory.properties === 'function') {
                return () => loadChildrenFrom(metaOrFactory, fullPath, finalKey);
              }
              const childNodes = this.#createChildNodes(metaOrFactory.properties, fullPath, [], metaOrFactory);
              return Array.isArray(childNodes) ? childNodes : [];
            }
            return [];
          }
          if (typeof metaOrFactory === 'function') {
            if (options?.flatten) {
              // 统一语义：当请求子层路径且 flatten=true 时，直接返回其 children 列表
              return () => loadChildrenFrom(metaOrFactory, fullPath, finalKey);
            }
            const parentTitles = this.#buildParentTitles(fullPath);
            return [this.#toTreeNode(finalKey, metaOrFactory, fullPath, parentTitles)];
          }
          if (metaOrFactory.properties) {
            const parentTitles = [...this.#buildParentTitles(fullPath), metaOrFactory.title];
            const childNodes = this.#createChildNodes(metaOrFactory.properties, fullPath, parentTitles, metaOrFactory);
            return Array.isArray(childNodes) ? childNodes : [];
          }
          return [];
        }
        // 未找到目标路径，返回空数组
        return [];
      } else if (propertyPath === null) {
        console.warn(
          `[FlowContext] getPropertyMetaTree - unsupported value format: "${value}". Only "{{ ctx.propertyName }}" format is supported. Returning empty meta tree.`,
        );
        return [];
      }
    }
    // 根级节点按 meta.sort 降序排列（未设置默认为 0）
    const sorted = Object.entries(metaMap).sort(([, a], [, b]) => {
      const sa = (typeof a === 'function' ? a.sort : a?.sort) ?? 0;
      const sb = (typeof b === 'function' ? b.sort : b?.sort) ?? 0;
      return sb - sa;
    });
    return sorted.map(([key, metaOrFactory]) => this.#toTreeNode(key, metaOrFactory, [key], []));
  }
  /**
   * 获取静态 API 文档信息（仅顶层一层）。
   *
   * - 输出仅来自 RunJS doc 与 defineProperty/defineMethod 的 info
   * - 不读取/展开 PropertyMeta（变量结构）
   * - 不自动展开深层 properties
   * - 不返回自动补全字段（例如 completion）
   */
  async getApiInfos(options = {}) {
    const version = options.version || 'v1';
    const evalCtx = this.createProxy();
    const isPrivateKey = (key) => typeof key === 'string' && key.startsWith('_');
    // NOTE: These are variable-like roots documented in RunJS context doc, but should be served by `getVarInfos()`.
    // `getApiInfos()` intentionally excludes them to keep static docs and variable meta separated.
    const isVarRootKey = (key) => key === 'record' || key === 'formValues' || key === 'popup';
    const isPromiseLike = (v) =>
      !!v && (typeof v === 'object' || typeof v === 'function') && typeof v.then === 'function';
    const getRunJSDoc = () => {
      const modelClass = getModelClassName(this);
      const Ctor = RunJSContextRegistry.resolve(version, modelClass) || RunJSContextRegistry.resolve(version, '*');
      if (!Ctor) return {};
      const locale = this?.api?.auth?.locale || this?.i18n?.language || this?.locale;
      try {
        if (Ctor?.getDoc?.length) {
          return Ctor.getDoc(locale) || {};
        }
        return Ctor?.getDoc?.() || {};
      } catch (_) {
        return {};
      }
    };
    const doc = getRunJSDoc();
    const docMethods = __isPlainObject(doc?.methods) ? doc.methods : {};
    const docProps = __isPlainObject(doc?.properties) ? doc.properties : {};
    const toDocObject = (node) => {
      if (typeof node === 'string') return { description: node };
      if (__isPlainObject(node)) return node;
      return undefined;
    };
    const mapDocKeyToApiKey = (key, docNode) => {
      // Some libs are exposed as both `ctx.React` and `ctx.libs.React`. Prefer documenting them under `libs.*`.
      const desc =
        typeof docNode === 'string'
          ? docNode
          : __isPlainObject(docNode) && typeof docNode.description === 'string'
          ? String(docNode.description)
          : undefined;
      if (desc && desc.includes(`ctx.libs.${key}`)) return `libs.${key}`;
      return key;
    };
    const pickMethodInfo = (obj) => {
      const src = toDocObject(obj);
      if (!src) return {};
      const out = {};
      for (const k of ['description', 'examples', 'ref', 'params', 'returns']) {
        const v = src[k];
        if (typeof v !== 'undefined') out[k] = v;
      }
      if (Array.isArray(out.examples)) {
        out.examples = out.examples.filter((x) => typeof x === 'string' && x.trim());
      }
      return out;
    };
    const pickPropertyInfo = (obj) => {
      const src = toDocObject(obj);
      if (!src) return {};
      const out = {};
      for (const k of ['title', 'type', 'interface', 'description', 'examples', 'ref', 'params', 'returns']) {
        const v = src[k];
        if (typeof v !== 'undefined') out[k] = v;
      }
      if (Array.isArray(out.examples)) {
        out.examples = out.examples.filter((x) => typeof x === 'string' && x.trim());
      }
      return out;
    };
    const getMethodInfoFromChain = (name) => {
      const visited = new WeakSet();
      const walk = (ctx) => {
        if (!ctx || typeof ctx !== 'object') return undefined;
        if (visited.has(ctx)) return undefined;
        visited.add(ctx);
        if (Object.prototype.hasOwnProperty.call(ctx._methodInfos || {}, name)) {
          return ctx._methodInfos?.[name];
        }
        const delegates = ctx._delegates;
        if (Array.isArray(delegates)) {
          for (const d of delegates) {
            const found = walk(d);
            if (found) return found;
          }
        }
        return undefined;
      };
      return walk(this);
    };
    const resolvePropertyInfo = async (key) => {
      const opt = this.getPropertyOptions(key);
      if (!opt?.info) return undefined;
      try {
        const v = typeof opt.info === 'function' ? opt.info.call(evalCtx, evalCtx) : opt.info;
        const resolved = isPromiseLike(v) ? await v : v;
        return resolved ?? undefined;
      } catch (_) {
        return undefined;
      }
    };
    const propKeys = new Set();
    const methodKeys = new Set();
    for (const k of Object.keys(docProps)) propKeys.add(k);
    for (const k of Object.keys(docMethods)) methodKeys.add(k);
    const collectInfoKeysDeep = (ctx, visited) => {
      if (!ctx || typeof ctx !== 'object') return;
      if (visited.has(ctx)) return;
      visited.add(ctx);
      try {
        const props = ctx._props;
        if (props && typeof props === 'object') {
          for (const [k, v] of Object.entries(props)) {
            if (v?.info) propKeys.add(k);
          }
        }
      } catch (_) {
        // ignore
      }
      try {
        const mi = ctx._methodInfos;
        if (mi && typeof mi === 'object') {
          for (const k of Object.keys(mi)) methodKeys.add(k);
        }
      } catch (_) {
        // ignore
      }
      try {
        const delegates = ctx._delegates;
        if (Array.isArray(delegates)) {
          for (const d of delegates) collectInfoKeysDeep(d, visited);
        }
      } catch (_) {
        // ignore
      }
    };
    collectInfoKeysDeep(this, new WeakSet());
    const out = {};
    for (const key of propKeys) {
      if (isPrivateKey(key)) continue;
      if (isVarRootKey(key)) continue;
      const docNode = docProps[key];
      const infoNode = await resolvePropertyInfo(key);
      if (typeof docNode === 'undefined' && typeof infoNode === 'undefined') continue;
      const docObj = toDocObject(docNode);
      const infoObj = toDocObject(infoNode);
      let node = {};
      node = { ...node, ...pickPropertyInfo(docObj) };
      node = { ...node, ...pickPropertyInfo(infoObj) };
      delete node.properties;
      delete node.completion;
      if (!Object.keys(node).length) continue;
      const outKey = mapDocKeyToApiKey(key, docNode);
      // Avoid exposing ctx.React/ctx.ReactDOM/ctx.antd in api docs when mapping to ctx.libs.*.
      out[outKey] = out[outKey] ? { ...(out[outKey] || {}), ...(node || {}) } : node;
    }
    for (const key of methodKeys) {
      if (isPrivateKey(key)) continue;
      const docNode = docMethods[key];
      const info = getMethodInfoFromChain(key);
      if (typeof docNode === 'undefined' && typeof info === 'undefined') continue;
      const docObj = toDocObject(docNode);
      let node = {};
      node = { ...node, ...pickMethodInfo(docObj) };
      node = { ...node, ...pickMethodInfo(info) };
      delete node.properties;
      delete node.completion;
      if (!Object.keys(node).length) continue;
      node.type = 'function';
      if (!out[key]) out[key] = node;
      else out[key] = { ...(out[key] || {}), ...(node || {}) };
    }
    // Flatten libs children (one-layer output, but allow `libs.xxx` keys).
    // Prefer richer doc from root aliases (e.g. `React` mapped to `libs.React`) when available.
    const libsDocObj = toDocObject(docProps.libs);
    const libsChildren = __isPlainObject(libsDocObj?.properties) ? libsDocObj.properties : undefined;
    if (libsChildren) {
      for (const [k, v] of Object.entries(libsChildren)) {
        if (isPrivateKey(k)) continue;
        const outKey = `libs.${k}`;
        if (out[outKey]) continue;
        const childObj = toDocObject(v);
        let node = {};
        node = { ...node, ...pickPropertyInfo(childObj) };
        delete node.properties;
        delete node.completion;
        if (!node.description || !String(node.description).trim()) continue;
        out[outKey] = node;
      }
    }
    return out;
  }
  /**
   * 获取运行时环境快照信息（小体积、可序列化）。
   */
  async getEnvInfos() {
    const evalCtx = this.createProxy();
    const isPromiseLike = (v) =>
      !!v && (typeof v === 'object' || typeof v === 'function') && typeof v.then === 'function';
    const envs = {};
    const getMaybe = (fn) => {
      try {
        return fn();
      } catch (_) {
        return undefined;
      }
    };
    const hasSnapshotValue = (v) => {
      if (typeof v === 'undefined' || v === null) return false;
      if (typeof v === 'string') return v.trim().length > 0;
      if (Array.isArray(v)) return v.length > 0;
      return true;
    };
    const getResourceSnapshot = (res) => {
      const out = {};
      if (!res) return out;
      const r = res;
      // Direct fields (popup/view inputArgs style)
      for (const k of ['dataSourceKey', 'collectionName', 'associationName', 'filterByTk', 'sourceId']) {
        const v = r?.[k];
        if (hasSnapshotValue(v)) out[k] = v;
      }
      // FlowResource-like methods (BaseRecordResource/SQLResource)
      if (!('dataSourceKey' in out)) {
        const v = r.getDataSourceKey?.();
        if (hasSnapshotValue(v)) out.dataSourceKey = v;
      }
      if (!('filterByTk' in out)) {
        const v = r.getFilterByTk?.();
        if (hasSnapshotValue(v)) out.filterByTk = v;
      }
      if (!('filterByTk' in out)) {
        const v = r.getMeta?.('currentFilterByTk');
        if (hasSnapshotValue(v)) out.filterByTk = v;
      }
      if (!('sourceId' in out)) {
        const v = r.getSourceId?.();
        if (hasSnapshotValue(v)) out.sourceId = v;
      }
      // Infer collection/association from resourceName when not provided
      if (!('collectionName' in out) || !('associationName' in out)) {
        const rn = r.getResourceName?.();
        const resourceName = typeof rn === 'string' ? rn.trim() : '';
        if (resourceName) {
          const parts = resourceName
            .split('.')
            .map((x) => x.trim())
            .filter(Boolean);
          if (parts.length === 1) {
            if (!('collectionName' in out)) out.collectionName = parts[0];
          } else if (parts.length >= 2) {
            if (!('collectionName' in out)) out.collectionName = parts[0];
            if (!('associationName' in out)) out.associationName = parts.slice(1).join('.');
          }
        }
      }
      return out;
    };
    // Resolve popup (may be Promise)
    const popup = await (async () => {
      try {
        const raw = evalCtx.popup;
        return isPromiseLike(raw) ? await raw : raw;
      } catch (_) {
        return undefined;
      }
    })();
    const popupLike = popup;
    const model = getMaybe(() => evalCtx.model);
    const blockModel = getMaybe(() => evalCtx.blockModel);
    const inputArgs = getMaybe(() => evalCtx.view?.inputArgs);
    const ctxResource = getMaybe(() => evalCtx.resource);
    const popupResource = popupLike?.resource;
    const popupResourceSnap = getResourceSnapshot(popupResource);
    const blockOwner = blockModel;
    const blockOwnerExpr = blockModel ? 'ctx.blockModel' : undefined;
    const blockResourceBaseExpr = blockOwnerExpr ? `${blockOwnerExpr}.resource` : undefined;
    const blockResource = blockOwner?.resource;
    const blockResourceSnap = getResourceSnapshot(blockResource);
    const inputArgsSnap = getResourceSnapshot(inputArgs);
    const ctxResourceSnap = getResourceSnapshot(ctxResource);
    // Resource snapshot (for prompt)
    const pickWithGetVar = (pairs) => {
      for (const p of pairs) {
        if (hasSnapshotValue(p.value)) return { value: p.value, getVar: p.getVar };
      }
      return undefined;
    };
    const hasAnyResourceValuesIn = (snap) =>
      hasSnapshotValue(snap.collectionName) ||
      hasSnapshotValue(snap.dataSourceKey) ||
      hasSnapshotValue(snap.associationName);
    const resourceBaseExpr = hasAnyResourceValuesIn(popupResourceSnap)
      ? 'ctx.popup.resource'
      : hasAnyResourceValuesIn(blockResourceSnap)
      ? blockResourceBaseExpr
      : hasAnyResourceValuesIn(inputArgsSnap)
      ? 'ctx.view.inputArgs'
      : hasAnyResourceValuesIn(ctxResourceSnap)
      ? 'ctx.resource'
      : undefined;
    const collectionNamePick = pickWithGetVar([
      { value: popupResourceSnap?.collectionName, getVar: 'ctx.popup.resource.collectionName' },
      { value: blockResourceSnap?.collectionName, getVar: `${blockResourceBaseExpr}.collectionName` },
      { value: inputArgsSnap?.collectionName, getVar: 'ctx.view.inputArgs.collectionName' },
      { value: ctxResourceSnap?.collectionName, getVar: 'ctx.resource.collectionName' },
    ]);
    const dataSourceKeyPick = pickWithGetVar([
      { value: popupResourceSnap?.dataSourceKey, getVar: 'ctx.popup.resource.dataSourceKey' },
      { value: blockResourceSnap?.dataSourceKey, getVar: `${blockResourceBaseExpr}.dataSourceKey` },
      { value: inputArgsSnap?.dataSourceKey, getVar: 'ctx.view.inputArgs.dataSourceKey' },
      { value: ctxResourceSnap?.dataSourceKey, getVar: 'ctx.resource.dataSourceKey' },
    ]);
    const associationNamePick = pickWithGetVar([
      { value: popupResourceSnap?.associationName, getVar: 'ctx.popup.resource.associationName' },
      { value: blockResourceSnap?.associationName, getVar: `${blockResourceBaseExpr}.associationName` },
      { value: inputArgsSnap?.associationName, getVar: 'ctx.view.inputArgs.associationName' },
      { value: ctxResourceSnap?.associationName, getVar: 'ctx.resource.associationName' },
    ]);
    const filterByTkPick = pickWithGetVar([
      { value: popupResourceSnap?.filterByTk, getVar: 'ctx.popup.resource.filterByTk' },
      { value: blockResourceSnap?.filterByTk, getVar: `${blockResourceBaseExpr}.filterByTk` },
      { value: inputArgsSnap?.filterByTk, getVar: 'ctx.view.inputArgs.filterByTk' },
      { value: ctxResourceSnap?.filterByTk, getVar: 'ctx.resource.filterByTk' },
    ]);
    const sourceIdPick = pickWithGetVar([
      { value: popupResourceSnap?.sourceId, getVar: 'ctx.popup.resource.sourceId' },
      { value: blockResourceSnap?.sourceId, getVar: `${blockResourceBaseExpr}.sourceId` },
      { value: inputArgsSnap?.sourceId, getVar: 'ctx.view.inputArgs.sourceId' },
      { value: ctxResourceSnap?.sourceId, getVar: 'ctx.resource.sourceId' },
    ]);
    const resourceProps = {};
    let hasResourceValues = false;
    const collectionNameValue = collectionNamePick?.value;
    if (hasSnapshotValue(collectionNameValue)) {
      resourceProps.collectionName = {
        description: 'Collection name',
        getVar: collectionNamePick?.getVar || (resourceBaseExpr ? `${resourceBaseExpr}.collectionName` : undefined),
        value: collectionNameValue,
      };
      hasResourceValues = true;
    }
    const dataSourceKeyValue = dataSourceKeyPick?.value;
    if (hasSnapshotValue(dataSourceKeyValue)) {
      resourceProps.dataSourceKey = {
        description: 'Data source key',
        getVar: dataSourceKeyPick?.getVar || (resourceBaseExpr ? `${resourceBaseExpr}.dataSourceKey` : undefined),
        value: dataSourceKeyValue,
      };
      hasResourceValues = true;
    }
    const associationNameValue = associationNamePick?.value;
    if (hasSnapshotValue(associationNameValue)) {
      resourceProps.associationName = {
        description: 'Association name',
        getVar: associationNamePick?.getVar || (resourceBaseExpr ? `${resourceBaseExpr}.associationName` : undefined),
        value: associationNameValue,
      };
      hasResourceValues = true;
    }
    // Only include envs.resource when snapshot contains at least one resource value.
    // Optional fields like filterByTk/sourceId are included (without value) only when envs.resource exists.
    if (hasResourceValues) {
      if (hasSnapshotValue(filterByTkPick?.value)) {
        resourceProps.filterByTk = {
          description: 'Record filterByTk',
          getVar: filterByTkPick?.getVar || (resourceBaseExpr ? `${resourceBaseExpr}.filterByTk` : undefined),
        };
      }
      if (hasSnapshotValue(sourceIdPick?.value)) {
        resourceProps.sourceId = {
          description: 'Source record ID (sourceId)',
          getVar: sourceIdPick?.getVar || (resourceBaseExpr ? `${resourceBaseExpr}.sourceId` : undefined),
        };
      }
      envs.resource = {
        description: 'Resource information',
        getVar: resourceBaseExpr,
        properties: resourceProps,
      };
    }
    // Record (only when filterByTk is available)
    if (hasSnapshotValue(filterByTkPick?.value)) {
      envs.record = {
        description: 'Current record',
        getVar: 'ctx.record',
      };
    }
    const pickLabel = (obj) => {
      try {
        const t = obj?.title;
        if (typeof t === 'string' && t.trim()) return t;
      } catch (_) {
        // ignore
      }
      try {
        const label = obj?.constructor?.meta?.label;
        if (typeof label === 'string' && label.trim()) return label;
      } catch (_) {
        // ignore
      }
      return undefined;
    };
    // FlowModel (when ctx.model exists)
    if (model) {
      const modelLabel = pickLabel(model);
      const modelUid = model.uid;
      const modelClassName = model.constructor?.name;
      const modelResourceSnap = getResourceSnapshot(model.resource);
      const modelResourceProps = {};
      let hasModelResourceValues = false;
      const modelCollectionName = modelResourceSnap.collectionName;
      if (hasSnapshotValue(modelCollectionName)) {
        modelResourceProps.collectionName = {
          description: 'Collection name',
          getVar: 'ctx.model.resource.collectionName',
          value: modelCollectionName,
        };
        hasModelResourceValues = true;
      }
      const modelDataSourceKey = modelResourceSnap.dataSourceKey;
      if (hasSnapshotValue(modelDataSourceKey)) {
        modelResourceProps.dataSourceKey = {
          description: 'Data source key',
          getVar: 'ctx.model.resource.dataSourceKey',
          value: modelDataSourceKey,
        };
        hasModelResourceValues = true;
      }
      const modelAssociationName = modelResourceSnap.associationName;
      if (hasSnapshotValue(modelAssociationName)) {
        modelResourceProps.associationName = {
          description: 'Association name',
          getVar: 'ctx.model.resource.associationName',
          value: modelAssociationName,
        };
        hasModelResourceValues = true;
      }
      envs.flowModel = {
        description: 'Current FlowModel information',
        getVar: 'ctx.model',
        properties: {
          ...(hasSnapshotValue(modelLabel) ? { label: { description: 'Flow model label', value: modelLabel } } : {}),
          ...(hasSnapshotValue(modelClassName)
            ? {
                modelClass: {
                  description: 'Flow model class name',
                  value: modelClassName,
                },
              }
            : {}),
          ...(hasSnapshotValue(modelUid)
            ? { uid: { description: 'Flow model uid', getVar: 'ctx.model.uid', value: modelUid } }
            : {}),
          ...(hasModelResourceValues
            ? {
                resource: {
                  description: 'Flow model resource',
                  getVar: 'ctx.model.resource',
                  properties: modelResourceProps,
                },
              }
            : {}),
        },
      };
    }
    // popup info (when ctx.popup exists)
    if (popupLike?.uid) {
      envs.popup = {
        description: 'Current popup information',
        getVar: 'ctx.popup',
        properties: {
          uid: { description: 'Popup uid', getVar: 'ctx.popup.uid', value: popupLike.uid },
          ...(popupLike?.record ? { record: { description: 'Popup record', getVar: 'ctx.popup.record' } } : {}),
          ...(popupLike?.sourceRecord
            ? { sourceRecord: { description: 'Popup source record', getVar: 'ctx.popup.sourceRecord' } }
            : {}),
        },
      };
    }
    // block (when ctx.blockModel exists)
    if (blockOwner) {
      const blockLabel = pickLabel(blockOwner);
      const blockUid = blockOwner.uid;
      const blockModelClass = blockOwner.constructor?.name;
      const blockResourceProps = {};
      let hasBlockResourceValues = false;
      const blockCollectionName = blockResourceSnap.collectionName;
      if (hasSnapshotValue(blockCollectionName)) {
        blockResourceProps.collectionName = {
          description: 'Collection name',
          getVar: `${blockResourceBaseExpr}.collectionName`,
          value: blockCollectionName,
        };
        hasBlockResourceValues = true;
      }
      const blockDataSourceKey = blockResourceSnap.dataSourceKey;
      if (hasSnapshotValue(blockDataSourceKey)) {
        blockResourceProps.dataSourceKey = {
          description: 'Data source key',
          getVar: `${blockResourceBaseExpr}.dataSourceKey`,
          value: blockDataSourceKey,
        };
        hasBlockResourceValues = true;
      }
      const blockAssociationName = blockResourceSnap.associationName;
      if (hasSnapshotValue(blockAssociationName)) {
        blockResourceProps.associationName = {
          description: 'Association name',
          getVar: `${blockResourceBaseExpr}.associationName`,
          value: blockAssociationName,
        };
        hasBlockResourceValues = true;
      }
      envs.block = {
        description: 'Current block information',
        getVar: blockOwnerExpr,
        properties: {
          ...(hasSnapshotValue(blockLabel) ? { label: { description: 'Block label', value: blockLabel } } : {}),
          ...(hasSnapshotValue(blockModelClass)
            ? { modelClass: { description: 'Block model class name', value: blockModelClass } }
            : {}),
          ...(hasSnapshotValue(blockUid)
            ? { uid: { description: 'Block uid', getVar: `${blockOwnerExpr}.uid`, value: blockUid } }
            : {}),
          ...(hasBlockResourceValues
            ? {
                resource: {
                  description: 'Block resource',
                  getVar: blockResourceBaseExpr,
                  properties: blockResourceProps,
                },
              }
            : {}),
        },
      };
    }
    // Current view blocks snapshot (page view or current popup view)
    const viewUid = (() => {
      const popupUid = popupLike?.uid;
      if (hasSnapshotValue(popupUid)) return String(popupUid).trim();
      const v = inputArgs?.viewUid;
      if (hasSnapshotValue(v)) return String(v).trim();
      return undefined;
    })();
    const engine = getMaybe(() => evalCtx.engine);
    const viewModel = viewUid ? engine?.getModel(viewUid, true) : undefined;
    const isBlockModelInstance = (m) => m.context?.blockModel === m;
    if (viewModel) {
      const queue = [viewModel];
      const blocks = [];
      for (let i = 0; i < queue.length; i++) {
        const m = queue[i];
        if (isBlockModelInstance(m)) {
          const modelClass = m.constructor?.name || m.uid;
          const label = pickLabel(m) || modelClass || m.uid;
          const resSnap = getResourceSnapshot(m.resource);
          const resource = {};
          if (hasSnapshotValue(resSnap.dataSourceKey)) resource.dataSourceKey = resSnap.dataSourceKey;
          if (hasSnapshotValue(resSnap.collectionName)) resource.collectionName = resSnap.collectionName;
          if (hasSnapshotValue(resSnap.associationName)) resource.associationName = resSnap.associationName;
          const block = {
            uid: m.uid,
            label,
            modelClass,
            ...(Object.keys(resource).length > 0 ? { resource } : {}),
          };
          blocks.push(block);
        }
        const subModels = m.subModels;
        if (subModels && typeof subModels === 'object') {
          for (const v of Object.values(subModels)) {
            if (!v) continue;
            if (Array.isArray(v)) queue.push(...v);
            else queue.push(v);
          }
        }
      }
      if (blocks.length) {
        envs.currentViewBlocks = {
          description: 'Current view blocks',
          value: blocks,
        };
      }
    }
    return envs;
  }
  /**
   * 获取变量结构信息（来源于 PropertyMeta）。
   *
   * - 返回静态 plain object（不包含函数）
   * - 支持 maxDepth（默认 3）与 path 剪裁
   */
  async getVarInfos(options = {}) {
    const maxDepthRaw = options.maxDepth ?? 3;
    const maxDepth = Number.isFinite(maxDepthRaw) ? Math.max(1, Math.floor(maxDepthRaw)) : 3;
    const version = 'v1';
    const evalCtx = this.createProxy();
    const isPrivateKey = (key) => typeof key === 'string' && key.startsWith('_');
    const isPromiseLike = (v) =>
      !!v && (typeof v === 'object' || typeof v === 'function') && typeof v.then === 'function';
    // Per-call cache for resolved PropertyMetaFactory nodes to avoid repeated async calls.
    const metaFactoryCache = new WeakMap();
    const resolveMetaOrFactory = async (meta) => {
      if (!meta) return undefined;
      if (typeof meta !== 'function') return meta;
      let pending = metaFactoryCache.get(meta);
      if (!pending) {
        pending = (async () => {
          const v = meta.call(evalCtx, evalCtx);
          const resolved = isPromiseLike(v) ? await v : v;
          return resolved || null;
        })();
        metaFactoryCache.set(meta, pending);
      }
      const resolved = await pending;
      return resolved || undefined;
    };
    const buildEnvs = async () => {
      const envs = {};
      const getMaybe = (fn) => {
        try {
          return fn();
        } catch (_) {
          return undefined;
        }
      };
      const hasSnapshotValue = (v) => {
        if (typeof v === 'undefined' || v === null) return false;
        if (typeof v === 'string') return v.trim().length > 0;
        if (Array.isArray(v)) return v.length > 0;
        return true;
      };
      const getResourceSnapshot = (res) => {
        const out = {};
        if (!res) return out;
        const r = res;
        // Direct fields (popup/view inputArgs style)
        for (const k of ['dataSourceKey', 'collectionName', 'associationName', 'filterByTk', 'sourceId']) {
          const v = r?.[k];
          if (hasSnapshotValue(v)) out[k] = v;
        }
        // FlowResource-like methods (BaseRecordResource/SQLResource)
        if (!('dataSourceKey' in out)) {
          const v = r.getDataSourceKey?.();
          if (hasSnapshotValue(v)) out.dataSourceKey = v;
        }
        if (!('filterByTk' in out)) {
          const v = r.getFilterByTk?.();
          if (hasSnapshotValue(v)) out.filterByTk = v;
        }
        if (!('filterByTk' in out)) {
          const v = r.getMeta?.('currentFilterByTk');
          if (hasSnapshotValue(v)) out.filterByTk = v;
        }
        if (!('sourceId' in out)) {
          const v = r.getSourceId?.();
          if (hasSnapshotValue(v)) out.sourceId = v;
        }
        // Infer collection/association from resourceName when not provided
        if (!('collectionName' in out) || !('associationName' in out)) {
          const rn = r.getResourceName?.();
          const resourceName = typeof rn === 'string' ? rn.trim() : '';
          if (resourceName) {
            const parts = resourceName
              .split('.')
              .map((x) => x.trim())
              .filter(Boolean);
            if (parts.length === 1) {
              if (!('collectionName' in out)) out.collectionName = parts[0];
            } else if (parts.length >= 2) {
              if (!('collectionName' in out)) out.collectionName = parts[0];
              if (!('associationName' in out)) out.associationName = parts.slice(1).join('.');
            }
          }
        }
        return out;
      };
      // Resolve popup (may be Promise)
      const popup = await (async () => {
        try {
          const raw = evalCtx.popup;
          return isPromiseLike(raw) ? await raw : raw;
        } catch (_) {
          return undefined;
        }
      })();
      const popupLike = popup;
      const model = getMaybe(() => evalCtx.model);
      const blockModel = getMaybe(() => evalCtx.blockModel);
      const inputArgs = getMaybe(() => evalCtx.view?.inputArgs);
      const ctxResource = getMaybe(() => evalCtx.resource);
      const popupResource = popupLike?.resource;
      const popupResourceSnap = getResourceSnapshot(popupResource);
      const blockOwner = blockModel;
      const blockOwnerExpr = blockModel ? 'ctx.blockModel' : undefined;
      const blockResourceBaseExpr = blockOwnerExpr ? `${blockOwnerExpr}.resource` : undefined;
      const blockResource = blockOwner?.resource;
      const blockResourceSnap = getResourceSnapshot(blockResource);
      const inputArgsSnap = getResourceSnapshot(inputArgs);
      const ctxResourceSnap = getResourceSnapshot(ctxResource);
      // Resource snapshot (for prompt)
      const pickWithGetVar = (pairs) => {
        for (const p of pairs) {
          if (hasSnapshotValue(p.value)) return { value: p.value, getVar: p.getVar };
        }
        return undefined;
      };
      const hasAnyResourceValuesIn = (snap) =>
        hasSnapshotValue(snap.collectionName) ||
        hasSnapshotValue(snap.dataSourceKey) ||
        hasSnapshotValue(snap.associationName);
      const resourceBaseExpr = hasAnyResourceValuesIn(popupResourceSnap)
        ? 'ctx.popup.resource'
        : hasAnyResourceValuesIn(blockResourceSnap)
        ? blockResourceBaseExpr
        : hasAnyResourceValuesIn(inputArgsSnap)
        ? 'ctx.view.inputArgs'
        : hasAnyResourceValuesIn(ctxResourceSnap)
        ? 'ctx.resource'
        : undefined;
      const collectionNamePick = pickWithGetVar([
        { value: popupResourceSnap?.collectionName, getVar: 'ctx.popup.resource.collectionName' },
        { value: blockResourceSnap?.collectionName, getVar: `${blockResourceBaseExpr}.collectionName` },
        { value: inputArgsSnap?.collectionName, getVar: 'ctx.view.inputArgs.collectionName' },
        { value: ctxResourceSnap?.collectionName, getVar: 'ctx.resource.collectionName' },
      ]);
      const dataSourceKeyPick = pickWithGetVar([
        { value: popupResourceSnap?.dataSourceKey, getVar: 'ctx.popup.resource.dataSourceKey' },
        { value: blockResourceSnap?.dataSourceKey, getVar: `${blockResourceBaseExpr}.dataSourceKey` },
        { value: inputArgsSnap?.dataSourceKey, getVar: 'ctx.view.inputArgs.dataSourceKey' },
        { value: ctxResourceSnap?.dataSourceKey, getVar: 'ctx.resource.dataSourceKey' },
      ]);
      const associationNamePick = pickWithGetVar([
        { value: popupResourceSnap?.associationName, getVar: 'ctx.popup.resource.associationName' },
        { value: blockResourceSnap?.associationName, getVar: `${blockResourceBaseExpr}.associationName` },
        { value: inputArgsSnap?.associationName, getVar: 'ctx.view.inputArgs.associationName' },
        { value: ctxResourceSnap?.associationName, getVar: 'ctx.resource.associationName' },
      ]);
      const filterByTkPick = pickWithGetVar([
        { value: popupResourceSnap?.filterByTk, getVar: 'ctx.popup.resource.filterByTk' },
        { value: blockResourceSnap?.filterByTk, getVar: `${blockResourceBaseExpr}.filterByTk` },
        { value: inputArgsSnap?.filterByTk, getVar: 'ctx.view.inputArgs.filterByTk' },
        { value: ctxResourceSnap?.filterByTk, getVar: 'ctx.resource.filterByTk' },
      ]);
      const sourceIdPick = pickWithGetVar([
        { value: popupResourceSnap?.sourceId, getVar: 'ctx.popup.resource.sourceId' },
        { value: blockResourceSnap?.sourceId, getVar: `${blockResourceBaseExpr}.sourceId` },
        { value: inputArgsSnap?.sourceId, getVar: 'ctx.view.inputArgs.sourceId' },
        { value: ctxResourceSnap?.sourceId, getVar: 'ctx.resource.sourceId' },
      ]);
      const resourceProps = {};
      let hasResourceValues = false;
      const collectionNameValue = collectionNamePick?.value;
      if (hasSnapshotValue(collectionNameValue)) {
        resourceProps.collectionName = {
          description: 'Collection name',
          getVar: collectionNamePick?.getVar || (resourceBaseExpr ? `${resourceBaseExpr}.collectionName` : undefined),
          value: collectionNameValue,
        };
        hasResourceValues = true;
      }
      const dataSourceKeyValue = dataSourceKeyPick?.value;
      if (hasSnapshotValue(dataSourceKeyValue)) {
        resourceProps.dataSourceKey = {
          description: 'Data source key',
          getVar: dataSourceKeyPick?.getVar || (resourceBaseExpr ? `${resourceBaseExpr}.dataSourceKey` : undefined),
          value: dataSourceKeyValue,
        };
        hasResourceValues = true;
      }
      const associationNameValue = associationNamePick?.value;
      if (hasSnapshotValue(associationNameValue)) {
        resourceProps.associationName = {
          description: 'Association name',
          getVar: associationNamePick?.getVar || (resourceBaseExpr ? `${resourceBaseExpr}.associationName` : undefined),
          value: associationNameValue,
        };
        hasResourceValues = true;
      }
      // Only include envs.resource when snapshot contains at least one resource value.
      // Optional fields like filterByTk/sourceId are included (without value) only when envs.resource exists.
      if (hasResourceValues) {
        if (hasSnapshotValue(filterByTkPick?.value)) {
          resourceProps.filterByTk = {
            description: 'Record filterByTk',
            getVar: filterByTkPick?.getVar || (resourceBaseExpr ? `${resourceBaseExpr}.filterByTk` : undefined),
          };
        }
        if (hasSnapshotValue(sourceIdPick?.value)) {
          resourceProps.sourceId = {
            description: 'Source record ID (sourceId)',
            getVar: sourceIdPick?.getVar || (resourceBaseExpr ? `${resourceBaseExpr}.sourceId` : undefined),
          };
        }
        envs.resource = {
          description: 'Resource information',
          getVar: resourceBaseExpr,
          properties: resourceProps,
        };
      }
      // Record (only when filterByTk is available)
      if (hasSnapshotValue(filterByTkPick?.value)) {
        envs.record = {
          description: 'Current record',
          getVar: 'ctx.record',
        };
      }
      const pickLabel = (obj) => {
        try {
          const t = obj?.title;
          if (typeof t === 'string' && t.trim()) return t;
        } catch (_) {
          // ignore
        }
        try {
          const label = obj?.constructor?.meta?.label;
          if (typeof label === 'string' && label.trim()) return label;
        } catch (_) {
          // ignore
        }
        return undefined;
      };
      // FlowModel (when ctx.model exists)
      if (model) {
        const modelLabel = pickLabel(model);
        const modelUid = model.uid;
        const modelClassName = model.constructor?.name;
        const modelResourceSnap = getResourceSnapshot(model.resource);
        const modelResourceProps = {};
        let hasModelResourceValues = false;
        const modelCollectionName = modelResourceSnap.collectionName;
        if (hasSnapshotValue(modelCollectionName)) {
          modelResourceProps.collectionName = {
            description: 'Collection name',
            getVar: 'ctx.model.resource.collectionName',
            value: modelCollectionName,
          };
          hasModelResourceValues = true;
        }
        const modelDataSourceKey = modelResourceSnap.dataSourceKey;
        if (hasSnapshotValue(modelDataSourceKey)) {
          modelResourceProps.dataSourceKey = {
            description: 'Data source key',
            getVar: 'ctx.model.resource.dataSourceKey',
            value: modelDataSourceKey,
          };
          hasModelResourceValues = true;
        }
        const modelAssociationName = modelResourceSnap.associationName;
        if (hasSnapshotValue(modelAssociationName)) {
          modelResourceProps.associationName = {
            description: 'Association name',
            getVar: 'ctx.model.resource.associationName',
            value: modelAssociationName,
          };
          hasModelResourceValues = true;
        }
        envs.flowModel = {
          description: 'Current FlowModel information',
          getVar: 'ctx.model',
          properties: {
            ...(hasSnapshotValue(modelLabel) ? { label: { description: 'Flow model label', value: modelLabel } } : {}),
            ...(hasSnapshotValue(modelClassName)
              ? {
                  modelClass: {
                    description: 'Flow model class name',
                    value: modelClassName,
                  },
                }
              : {}),
            ...(hasSnapshotValue(modelUid)
              ? { uid: { description: 'Flow model uid', getVar: 'ctx.model.uid', value: modelUid } }
              : {}),
            ...(hasModelResourceValues
              ? {
                  resource: {
                    description: 'Resource information',
                    getVar: 'ctx.model.resource',
                    properties: {
                      ...modelResourceProps,
                      ...(hasSnapshotValue(modelResourceSnap?.filterByTk)
                        ? {
                            filterByTk: {
                              description: 'Record filterByTk',
                              getVar: 'ctx.model.resource.filterByTk',
                            },
                          }
                        : {}),
                      ...(hasSnapshotValue(modelResourceSnap?.sourceId)
                        ? {
                            sourceId: {
                              description: 'Source record ID (sourceId)',
                              getVar: 'ctx.model.resource.sourceId',
                            },
                          }
                        : {}),
                    },
                  },
                }
              : {}),
          },
        };
      }
      // Block (when ctx.blockModel exists)
      if (blockOwner && blockOwnerExpr) {
        const blockLabel = pickLabel(blockOwner);
        const blockUid = blockOwner.uid;
        const blockModelClass = blockOwner.constructor?.name;
        const blockResourceProps = {};
        let hasBlockResourceValues = false;
        const blockCollectionName = blockResourceSnap.collectionName;
        if (hasSnapshotValue(blockCollectionName)) {
          blockResourceProps.collectionName = {
            description: 'Collection name',
            getVar: `${blockResourceBaseExpr}.collectionName`,
            value: blockCollectionName,
          };
          hasBlockResourceValues = true;
        }
        const blockDataSourceKey = blockResourceSnap.dataSourceKey;
        if (hasSnapshotValue(blockDataSourceKey)) {
          blockResourceProps.dataSourceKey = {
            description: 'Data source key',
            getVar: `${blockResourceBaseExpr}.dataSourceKey`,
            value: blockDataSourceKey,
          };
          hasBlockResourceValues = true;
        }
        const blockAssociationName = blockResourceSnap.associationName;
        if (hasSnapshotValue(blockAssociationName)) {
          blockResourceProps.associationName = {
            description: 'Association name',
            getVar: `${blockResourceBaseExpr}.associationName`,
            value: blockAssociationName,
          };
          hasBlockResourceValues = true;
        }
        envs.block = {
          description: 'Current block information',
          getVar: 'ctx.blockModel',
          properties: {
            ...(hasSnapshotValue(blockLabel) ? { label: { description: 'Block label', value: blockLabel } } : {}),
            ...(hasSnapshotValue(blockModelClass)
              ? {
                  modelClass: {
                    description: 'Block model class name',
                    value: blockModelClass,
                  },
                }
              : {}),
            ...(hasSnapshotValue(blockUid)
              ? {
                  uid: {
                    description: 'Block uid',
                    getVar: 'ctx.blockModel.uid',
                    value: blockUid,
                  },
                }
              : {}),
            ...(hasBlockResourceValues
              ? {
                  resource: {
                    description: 'Resource information',
                    getVar: 'ctx.blockModel.resource',
                    properties: {
                      ...blockResourceProps,
                      ...(hasSnapshotValue(blockResourceSnap?.filterByTk)
                        ? {
                            filterByTk: {
                              description: 'Record filterByTk',
                              getVar: 'ctx.blockModel.resource.filterByTk',
                            },
                          }
                        : {}),
                      ...(hasSnapshotValue(blockResourceSnap?.sourceId)
                        ? {
                            sourceId: {
                              description: 'Source record ID (sourceId)',
                              getVar: 'ctx.blockModel.resource.sourceId',
                            },
                          }
                        : {}),
                    },
                  },
                }
              : {}),
          },
        };
      }
      // Popup (only when popup exists)
      if (popupLike?.uid) {
        const popupUid = popupLike.uid;
        const popupResourceProps = {};
        let hasPopupResourceValues = false;
        const popupCollectionName = popupResourceSnap.collectionName;
        if (hasSnapshotValue(popupCollectionName)) {
          popupResourceProps.collectionName = {
            description: 'Collection name',
            getVar: 'ctx.popup.resource.collectionName',
            value: popupCollectionName,
          };
          hasPopupResourceValues = true;
        }
        const popupDataSourceKey = popupResourceSnap.dataSourceKey;
        if (hasSnapshotValue(popupDataSourceKey)) {
          popupResourceProps.dataSourceKey = {
            description: 'Data source key',
            getVar: 'ctx.popup.resource.dataSourceKey',
            value: popupDataSourceKey,
          };
          hasPopupResourceValues = true;
        }
        const popupAssociationName = popupResourceSnap.associationName;
        if (hasSnapshotValue(popupAssociationName)) {
          popupResourceProps.associationName = {
            description: 'Association name',
            getVar: 'ctx.popup.resource.associationName',
            value: popupAssociationName,
          };
          hasPopupResourceValues = true;
        }
        envs.popup = {
          description: 'Current popup information',
          getVar: 'ctx.popup',
          properties: {
            uid: { description: 'Popup uid', getVar: 'ctx.popup.uid', value: popupUid },
            record: {
              description: 'Current popup record (object).',
              getVar: 'ctx.popup.record',
            },
            sourceRecord: {
              description: 'Current popup sourceRecord (object).',
              getVar: 'ctx.popup.sourceRecord',
            },
            parent: {
              description: 'Parent popup info (object).',
              getVar: 'ctx.popup.parent',
            },
            ...(hasPopupResourceValues
              ? {
                  resource: {
                    description: 'Resource information',
                    getVar: 'ctx.popup.resource',
                    properties: {
                      ...popupResourceProps,
                      ...(hasSnapshotValue(popupResourceSnap?.filterByTk)
                        ? {
                            filterByTk: {
                              description: 'Record filterByTk',
                              getVar: 'ctx.popup.resource.filterByTk',
                            },
                          }
                        : {}),
                      ...(hasSnapshotValue(popupResourceSnap?.sourceId)
                        ? {
                            sourceId: {
                              description: 'Source record ID (sourceId)',
                              getVar: 'ctx.popup.resource.sourceId',
                            },
                          }
                        : {}),
                    },
                  },
                }
              : {}),
          },
        };
      }
      // Current view blocks snapshot (page or current popup)
      const viewUid = (() => {
        const popupUid = popupLike?.uid;
        if (hasSnapshotValue(popupUid)) return popupUid.trim();
        const v = inputArgs?.viewUid;
        if (hasSnapshotValue(v)) return v.trim();
        return undefined;
      })();
      const engine = getMaybe(() => evalCtx.engine);
      const viewModel = viewUid ? engine?.getModel(viewUid, true) : undefined;
      const isBlockModelInstance = (m) => m.context?.blockModel === m;
      if (viewModel) {
        const queue = [viewModel];
        const blocks = [];
        for (let i = 0; i < queue.length; i++) {
          const m = queue[i];
          if (isBlockModelInstance(m)) {
            const modelClass = m.constructor?.name || m.uid;
            const label = pickLabel(m) || modelClass || m.uid;
            const resSnap = getResourceSnapshot(m.resource);
            const resource = {};
            if (hasSnapshotValue(resSnap.dataSourceKey)) resource.dataSourceKey = resSnap.dataSourceKey;
            if (hasSnapshotValue(resSnap.collectionName)) resource.collectionName = resSnap.collectionName;
            if (hasSnapshotValue(resSnap.associationName)) resource.associationName = resSnap.associationName;
            const block = {
              uid: m.uid,
              label,
              modelClass,
              ...(Object.keys(resource).length > 0 ? { resource } : {}),
            };
            blocks.push(block);
          }
          const subModels = m.subModels;
          if (subModels && typeof subModels === 'object') {
            for (const v of Object.values(subModels)) {
              if (!v) continue;
              if (Array.isArray(v)) queue.push(...v);
              else queue.push(v);
            }
          }
        }
        envs.currentViewBlocks = {
          description: 'Current view blocks',
          value: blocks,
        };
      }
      return envs;
    };
    const normalizePath = (raw) => {
      if (typeof raw !== 'string') return undefined;
      const s = raw.trim();
      if (!s) return undefined;
      const extracted = extractPropertyPath(s);
      if (Array.isArray(extracted) && extracted.length > 0) {
        return extracted.join('.');
      }
      if (s === 'ctx') return '';
      if (s.startsWith('ctx.')) return s.slice(4).trim();
      return s;
    };
    const paths = (() => {
      const p = options.path;
      const list = typeof p === 'string' ? [p] : Array.isArray(p) ? p : [];
      return list.map((x) => normalizePath(String(x))).filter((x) => typeof x === 'string' && x.length > 0);
    })();
    const hasRootPath = (() => {
      const p = options.path;
      if (typeof p === 'string') return normalizePath(p) === '';
      if (Array.isArray(p)) return p.some((x) => normalizePath(String(x)) === '');
      return false;
    })();
    const collectKeysDeep = (ctx, out, key, visited) => {
      if (!ctx || typeof ctx !== 'object') return;
      if (visited.has(ctx)) return;
      visited.add(ctx);
      try {
        const bag = ctx[key];
        if (bag && typeof bag === 'object') {
          for (const k of Object.keys(bag)) out.add(k);
        }
      } catch (_) {
        // ignore
      }
      try {
        const delegates = ctx._delegates;
        if (Array.isArray(delegates)) {
          for (const d of delegates) collectKeysDeep(d, out, key, visited);
        }
      } catch (_) {
        // ignore
      }
    };
    const getRunJSDoc = () => {
      const modelClass = getModelClassName(this);
      const Ctor = RunJSContextRegistry.resolve(version, modelClass) || RunJSContextRegistry.resolve(version, '*');
      if (!Ctor) return {};
      const locale = this?.api?.auth?.locale || this?.i18n?.language || this?.locale;
      try {
        if (Ctor?.getDoc?.length) {
          return Ctor.getDoc(locale) || {};
        }
        return Ctor?.getDoc?.() || {};
      } catch (_) {
        return {};
      }
    };
    const doc = getRunJSDoc();
    const docMethods = __isPlainObject(doc?.methods) ? doc.methods : {};
    const docProps = __isPlainObject(doc?.properties) ? doc.properties : {};
    const toDocObject = (node) => {
      if (typeof node === 'string') return { description: node };
      if (__isPlainObject(node)) return node;
      return undefined;
    };
    const evalBool = async (raw, call) => {
      if (typeof raw === 'undefined') return undefined;
      if (typeof raw === 'boolean') return raw;
      if (typeof raw === 'function') {
        try {
          const v = call(raw);
          return isPromiseLike(v) ? !!(await v) : !!v;
        } catch (_) {
          return false;
        }
      }
      return !!raw;
    };
    const evalString = async (raw, call) => {
      if (typeof raw === 'undefined' || raw === null) return undefined;
      if (typeof raw === 'string') return raw;
      if (typeof raw === 'function') {
        try {
          const v = call(raw);
          const resolved = isPromiseLike(v) ? await v : v;
          if (typeof resolved === 'string') return resolved;
          return typeof resolved === 'undefined' || resolved === null ? undefined : String(resolved);
        } catch (_) {
          return undefined;
        }
      }
      return String(raw);
    };
    const evalRunJSHidden = async (raw) => {
      let hideSelf = false;
      let list = [];
      try {
        if (typeof raw === 'boolean') hideSelf = raw;
        else if (Array.isArray(raw)) list = raw;
        else if (typeof raw === 'function') {
          const v = raw(evalCtx);
          const resolved = isPromiseLike(v) ? await v : v;
          if (typeof resolved === 'boolean') hideSelf = resolved;
          else if (Array.isArray(resolved)) list = resolved;
        }
      } catch (_) {
        hideSelf = false;
        list = [];
      }
      const hideSubpaths = [];
      if (Array.isArray(list)) {
        for (const p of list) {
          if (typeof p !== 'string') continue;
          const s = p.trim();
          if (!s) continue;
          // Only relative paths are supported. Ignore "ctx.xxx" absolute style to avoid ambiguity.
          if (s === 'ctx' || s.startsWith('ctx.')) continue;
          if (/\s/.test(s)) continue;
          hideSubpaths.push(s);
        }
      }
      return { hideSelf: !!hideSelf, hideSubpaths };
    };
    const isHiddenByPrefixes = (path, hiddenPrefixes) => {
      if (!path) return false;
      const parts = path.split('.').filter(Boolean);
      while (parts.length) {
        if (hiddenPrefixes.has(parts.join('.'))) return true;
        parts.pop();
      }
      return false;
    };
    const pickMethodInfo = (obj) => {
      const src = toDocObject(obj);
      if (!src) return {};
      const out = {};
      for (const k of ['description', 'examples', 'completion', 'ref', 'params', 'returns']) {
        const v = src[k];
        if (typeof v !== 'undefined') out[k] = v;
      }
      if (Array.isArray(out.examples)) {
        out.examples = out.examples.filter((x) => typeof x === 'string' && x.trim());
      }
      return out;
    };
    const pickPropertyInfo = (obj) => {
      const src = toDocObject(obj);
      if (!src) return {};
      const out = {};
      for (const k of [
        'title',
        'type',
        'interface',
        'description',
        'examples',
        'completion',
        'ref',
        'params',
        'returns',
      ]) {
        const v = src[k];
        if (typeof v !== 'undefined') out[k] = v;
      }
      if (Array.isArray(out.examples)) {
        out.examples = out.examples.filter((x) => typeof x === 'string' && x.trim());
      }
      return out;
    };
    const getMethodInfoFromChain = (name) => {
      const visited = new WeakSet();
      const walk = (ctx) => {
        if (!ctx || typeof ctx !== 'object') return undefined;
        if (visited.has(ctx)) return undefined;
        visited.add(ctx);
        if (Object.prototype.hasOwnProperty.call(ctx._methodInfos || {}, name)) {
          return ctx._methodInfos?.[name];
        }
        const delegates = ctx._delegates;
        if (Array.isArray(delegates)) {
          for (const d of delegates) {
            const found = walk(d);
            if (found) return found;
          }
        }
        return undefined;
      };
      return walk(this);
    };
    const hasMethodInChain = (name) => {
      const visited = new WeakSet();
      const walk = (ctx) => {
        if (!ctx || typeof ctx !== 'object') return false;
        if (visited.has(ctx)) return false;
        visited.add(ctx);
        if (Object.prototype.hasOwnProperty.call(ctx._methods || {}, name)) return true;
        const delegates = ctx._delegates;
        if (Array.isArray(delegates)) {
          for (const d of delegates) {
            if (walk(d)) return true;
          }
        }
        return false;
      };
      return walk(this);
    };
    const buildMethodInfo = async (name) => {
      if (isPrivateKey(name)) return undefined;
      const docNode = docMethods[name];
      const info = getMethodInfoFromChain(name);
      const exists = typeof docNode !== 'undefined' || typeof info !== 'undefined' || hasMethodInChain(name);
      if (!exists) return undefined;
      const docObj = toDocObject(docNode);
      const docHidden = await evalBool(docObj?.hidden, (fn) => fn(evalCtx));
      const infoHidden = await evalBool(info?.hidden, (fn) => fn(evalCtx));
      if (!!docHidden || !!infoHidden) return undefined;
      const docDisabled = await evalBool(docObj?.disabled, (fn) => fn(evalCtx));
      const docDisabledReason = await evalString(docObj?.disabledReason, (fn) => fn(evalCtx));
      const infoDisabled = await evalBool(info?.disabled, (fn) => fn(evalCtx));
      const infoDisabledReason = await evalString(info?.disabledReason, (fn) => fn(evalCtx));
      const disabled = typeof infoDisabled !== 'undefined' ? infoDisabled : docDisabled;
      const disabledReason = typeof infoDisabledReason !== 'undefined' ? infoDisabledReason : docDisabledReason;
      let out = {};
      out = { ...out, ...pickMethodInfo(docObj) };
      out = { ...out, ...pickMethodInfo(info) };
      if (typeof disabled !== 'undefined') out.disabled = !!disabled;
      if (typeof disabledReason !== 'undefined') out.disabledReason = disabledReason;
      if (!Object.keys(out).length) return undefined;
      // Mark as callable for tooling (e.g. code-editor completion).
      out.type = 'function';
      return out;
    };
    const buildPropertyInfoFromNodes = async (args) => {
      const { docNode, metaNode, infoNode, depth, pathFromRoot, hiddenPrefixes } = args;
      const relPath = pathFromRoot.join('.');
      if (isHiddenByPrefixes(relPath, hiddenPrefixes)) return undefined;
      const docObj = toDocObject(docNode);
      const infoObj = toDocObject(infoNode);
      const docHiddenDecision = await evalRunJSHidden(docObj?.hidden);
      if (docHiddenDecision.hideSelf) return undefined;
      const infoHiddenDecision = await evalRunJSHidden(infoObj?.hidden);
      if (infoHiddenDecision.hideSelf) return undefined;
      const resolvedMetaNode = await resolveMetaOrFactory(metaNode);
      const metaHidden = await evalBool(resolvedMetaNode?.hidden, (fn) => fn.call(resolvedMetaNode, evalCtx));
      if (metaHidden) return undefined;
      const childHiddenPrefixes = new Set(hiddenPrefixes);
      for (const sub of [...docHiddenDecision.hideSubpaths, ...infoHiddenDecision.hideSubpaths]) {
        const normalized = sub.trim();
        if (!normalized) continue;
        const stripped = normalized === 'ctx' ? '' : normalized.startsWith('ctx.') ? normalized.slice(4) : normalized;
        if (!stripped) continue;
        const abs = relPath ? `${relPath}.${stripped}` : stripped;
        childHiddenPrefixes.add(abs);
      }
      const docDisabled = await evalBool(docObj?.disabled, (fn) => fn(evalCtx));
      const docDisabledReason = await evalString(docObj?.disabledReason, (fn) => fn(evalCtx));
      const metaDisabled = await evalBool(resolvedMetaNode?.disabled, (fn) => fn.call(resolvedMetaNode, evalCtx));
      const metaDisabledReason = await evalString(resolvedMetaNode?.disabledReason, (fn) =>
        fn.call(resolvedMetaNode, evalCtx),
      );
      const infoDisabled = await evalBool(infoObj?.disabled, (fn) => fn(evalCtx));
      const infoDisabledReason = await evalString(infoObj?.disabledReason, (fn) => fn(evalCtx));
      const disabled =
        typeof infoDisabled !== 'undefined'
          ? infoDisabled
          : typeof metaDisabled !== 'undefined'
          ? metaDisabled
          : docDisabled;
      const disabledReason =
        typeof infoDisabledReason !== 'undefined'
          ? infoDisabledReason
          : typeof metaDisabledReason !== 'undefined'
          ? metaDisabledReason
          : docDisabledReason;
      let out = {};
      out = { ...out, ...pickPropertyInfo(docObj) };
      out = { ...out, ...pickPropertyInfo(resolvedMetaNode) };
      out = { ...out, ...pickPropertyInfo(infoObj) };
      if (typeof disabled !== 'undefined') out.disabled = !!disabled;
      if (typeof disabledReason !== 'undefined') out.disabledReason = disabledReason;
      if (depth >= maxDepth) return Object.keys(out).length ? out : undefined;
      const docChildren = __isPlainObject(docObj?.properties) ? docObj.properties : undefined;
      let metaChildren;
      if (resolvedMetaNode?.properties) {
        try {
          const props = resolvedMetaNode.properties;
          if (typeof props === 'function') {
            const resolved = await props.call(resolvedMetaNode, evalCtx);
            resolvedMetaNode.properties = resolved;
            metaChildren = resolved;
          } else if (__isPlainObject(props)) {
            metaChildren = props;
          }
        } catch (_) {
          metaChildren = undefined;
        }
      }
      let infoChildren;
      if (__isPlainObject(infoObj) && infoObj?.properties) {
        try {
          const props = infoObj.properties;
          if (typeof props === 'function') {
            const resolved = await props.call(infoObj, evalCtx);
            infoObj.properties = resolved;
            infoChildren = resolved;
          } else if (__isPlainObject(props)) {
            infoChildren = props;
          }
        } catch (_) {
          infoChildren = undefined;
        }
      }
      const keys = new Set();
      if (docChildren) for (const k of Object.keys(docChildren)) keys.add(k);
      if (metaChildren) for (const k of Object.keys(metaChildren)) keys.add(k);
      if (infoChildren) for (const k of Object.keys(infoChildren)) keys.add(k);
      if (!keys.size) return Object.keys(out).length ? out : undefined;
      const childrenOut = {};
      for (const k of keys) {
        if (isPrivateKey(k)) continue;
        const child = await buildPropertyInfoFromNodes({
          docNode: docChildren?.[k],
          metaNode: metaChildren?.[k],
          infoNode: infoChildren?.[k],
          depth: depth + 1,
          pathFromRoot: [...pathFromRoot, k],
          hiddenPrefixes: childHiddenPrefixes,
        });
        if (child) childrenOut[k] = child;
      }
      if (Object.keys(childrenOut).length) out.properties = childrenOut;
      if (!Object.keys(out).length) return undefined;
      return out;
    };
    const resolvePropertyMetaAtPath = async (segments) => {
      if (!segments.length) return undefined;
      const [first, ...rest] = segments;
      const opt = this.getPropertyOptions(first);
      if (!opt?.meta) return undefined;
      try {
        // Fast path: when querying the root key only, return the meta (may be a factory) and let
        // buildPropertyInfoFromNodes decide whether to resolve it based on maxDepth.
        if (!rest.length) return opt.meta;
        let current = await resolveMetaOrFactory(opt.meta);
        if (!current) return undefined;
        for (let i = 0; i < rest.length; i++) {
          const key = rest[i];
          let props = current?.properties;
          if (!props) return undefined;
          if (typeof props === 'function') {
            const resolved = await props.call(current, evalCtx);
            current.properties = resolved;
            props = resolved;
          }
          if (!props || typeof props !== 'object') return undefined;
          const next = props?.[key];
          if (!next) return undefined;
          // Return the node at the requested path (may still be a factory).
          if (i === rest.length - 1) return next;
          const resolvedNext = await resolveMetaOrFactory(next);
          if (!resolvedNext) return undefined;
          current = resolvedNext;
        }
        return undefined;
      } catch (_) {
        return undefined;
      }
    };
    const resolvePropertyInfoAtPath = async (segments) => {
      if (!segments.length) return undefined;
      const [first, ...rest] = segments;
      const opt = this.getPropertyOptions(first);
      if (!opt?.info) return undefined;
      try {
        let cur = typeof opt.info === 'function' ? await opt.info.call(evalCtx, evalCtx) : opt.info;
        if (!rest.length) return cur;
        for (const key of rest) {
          const obj = toDocObject(cur);
          if (!__isPlainObject(obj)) return undefined;
          let props = obj?.properties;
          if (!props) return undefined;
          if (typeof props === 'function') {
            const resolved = await props.call(obj, evalCtx);
            obj.properties = resolved;
            props = resolved;
          }
          if (!__isPlainObject(props)) return undefined;
          cur = props[key];
        }
        return cur;
      } catch (_) {
        return undefined;
      }
    };
    const resolveDocNodeAtPath = (segments) => {
      if (!segments.length) return undefined;
      let cur = docProps[segments[0]];
      for (let i = 1; i < segments.length; i++) {
        const obj = toDocObject(cur);
        if (!__isPlainObject(obj)) return undefined;
        const props = obj.properties;
        if (!__isPlainObject(props)) return undefined;
        cur = props[segments[i]];
      }
      return cur;
    };
    // path 剪裁：每个 path 独立返回一个根节点（key 为 path 字符串）
    if (!hasRootPath && paths.length) {
      const out = {};
      for (const p of paths) {
        const segments = p
          .split('.')
          .map((x) => x.trim())
          .filter(Boolean);
        if (segments.some((s) => isPrivateKey(s))) continue;
        if (!segments.length) continue;
        const metaNode = await resolvePropertyMetaAtPath(segments);
        const pi = await buildPropertyInfoFromNodes({
          docNode: undefined,
          metaNode,
          infoNode: undefined,
          depth: 1,
          pathFromRoot: [],
          hiddenPrefixes: new Set(),
        });
        if (pi) out[p] = pi;
      }
      return out;
    }
    // 全量输出：仅基于 property meta（含委托链）
    const metaMap = this._getPropertiesMeta();
    const out = {};
    for (const [key, metaNode] of Object.entries(metaMap)) {
      if (isPrivateKey(key)) continue;
      const pi = await buildPropertyInfoFromNodes({
        docNode: undefined,
        metaNode,
        infoNode: undefined,
        depth: 1,
        pathFromRoot: [key],
        hiddenPrefixes: new Set(),
      });
      if (pi) out[key] = pi;
    }
    return out;
  }
  #createChildNodes(properties, parentPaths = [], parentTitles = [], parentMeta) {
    return typeof properties === 'function'
      ? async () => {
          const resolved = await properties();
          // 缓存解析结果，避免下次重复调用
          if (parentMeta) {
            parentMeta.properties = resolved;
          }
          const entries = Object.entries(resolved);
          entries.sort(([, a], [, b]) => (b?.sort ?? 0) - (a?.sort ?? 0));
          return entries.map(([name, meta]) => this.#toTreeNode(name, meta, [...parentPaths, name], parentTitles));
        }
      : Object.entries(properties)
          .sort(([, a], [, b]) => (b?.sort ?? 0) - (a?.sort ?? 0))
          .map(([name, meta]) => this.#toTreeNode(name, meta, [...parentPaths, name], parentTitles));
  }
  /**
   * 根据属性路径查找对应的 meta
   * @param propertyPath 属性路径数组，例如 ["aaa", "bbb"]
   * @returns [finalKey, metaOrFactory, fullPath] 或 null
   */
  #findMetaByPath(propertyPath) {
    if (propertyPath.length === 0) return null;
    const [firstKey, ...remainingPath] = propertyPath;
    // 首先查找第一个属性，这里利用委托链机制
    // 1. 查找自身的属性
    const ownProperty = this._props[firstKey];
    if (ownProperty?.meta) {
      return this.#findMetaInProperty(firstKey, ownProperty.meta, remainingPath, [firstKey]);
    }
    // 2 进一步递归查找更深层委托链（_getPropertiesMeta 会递归收集，但此处原来仅检查了一层，导致不一致）
    const deepMeta = this.#findMetaInDelegatesDeep(this._delegates, firstKey);
    if (deepMeta) {
      return this.#findMetaInProperty(firstKey, deepMeta, remainingPath, [firstKey]);
    }
    return null;
  }
  /**
   * 递归在委托链中查找指定 key 的 meta（只返回 metaOrFactory，不解析路径）。
   */
  #findMetaInDelegatesDeep(delegates, key) {
    for (const delegate of delegates) {
      const prop = delegate._props[key];
      if (prop?.meta) return prop.meta;
      const deeper = this.#findMetaInDelegatesDeep(delegate._delegates, key);
      if (deeper) return deeper;
    }
    return null;
  }
  /**
   * 在给定属性的 meta 中查找剩余路径
   */
  #findMetaInProperty(currentKey, metaOrFactory, remainingPath, currentPath) {
    // 如果已经到了最后一层，直接返回当前的 meta
    if (remainingPath.length === 0) {
      return [currentKey, metaOrFactory, currentPath];
    }
    // 如果还有剩余路径，但当前是函数类型，构建一个新的异步函数继续解析剩余路径
    if (typeof metaOrFactory === 'function') {
      const finalKey = remainingPath[remainingPath.length - 1];
      const finalPath = [...currentPath, ...remainingPath];
      const wrappedFactory = async () => {
        const resolvedMeta = await metaOrFactory();
        const result = await this.#resolvePathInMetaAsync(resolvedMeta, remainingPath);
        return result;
      };
      return [finalKey, wrappedFactory, finalPath];
    }
    // 如果还有剩余路径，且是同步 meta，尝试继续查找下一层
    if (metaOrFactory.properties) {
      const [nextKey, ...restPath] = remainingPath;
      const nextPath = [...currentPath, nextKey];
      // properties 是异步的，构建新的异步函数继续解析
      if (typeof metaOrFactory.properties === 'function') {
        const finalKey = remainingPath[remainingPath.length - 1];
        const finalPath = [...currentPath, ...remainingPath];
        const wrappedFactory = async () => {
          const propertiesFactory = metaOrFactory.properties;
          const resolvedProperties = await propertiesFactory();
          // 缓存解析结果，避免下次重复调用
          metaOrFactory.properties = resolvedProperties;
          const startMeta = resolvedProperties[nextKey];
          if (!startMeta) {
            throw new Error(`Property ${nextKey} not found in resolved properties`);
          }
          const result = await this.#resolvePathInMetaAsync(startMeta, restPath);
          return result;
        };
        return [finalKey, wrappedFactory, finalPath];
      }
      // properties 是同步的，继续查找
      const nextMeta = metaOrFactory.properties[nextKey];
      if (nextMeta) {
        return this.#findMetaInProperty(nextKey, nextMeta, restPath, nextPath);
      }
    }
    return null;
  }
  /**
   * 在给定的 meta 中递归解析路径
   */
  #resolvePathInMeta(meta, path) {
    if (path.length === 0) {
      return meta;
    }
    let current = meta;
    for (const key of path) {
      const properties = _.get(current, 'properties');
      if (!properties || typeof properties === 'function') {
        return null; // 无法同步解析异步 properties
      }
      current = _.get(properties, key);
      if (!current) {
        return null;
      }
    }
    return current;
  }
  /**
   * 支持异步 properties 的路径解析：
   * - 遇到 properties 为函数时会 await 并缓存其结果
   * - 持续向下解析直到到达最终的 meta
   * 若解析失败则抛出异常，由调用方自行处理
   */
  async #resolvePathInMetaAsync(meta, path) {
    if (path.length === 0) return meta;
    let current = meta;
    for (const key of path) {
      let properties = _.get(current, 'properties');
      if (!properties) {
        throw new Error(`Property path not found: ${path.join('.')}`);
      }
      if (typeof properties === 'function') {
        const resolved = await properties();
        current.properties = resolved;
        properties = resolved;
      }
      const next = properties[key];
      if (!next) {
        throw new Error(`Property ${key} not found while resolving path: ${path.join('.')}`);
      }
      current = next;
    }
    return current;
  }
  /**
   * 构建 parentTitles 数组，通过递归查找每个路径层级对应的 meta title
   * @param propertyPath 属性路径数组，例如 ['aaa', 'bbb', 'ccc']
   * @param excludeLastLevel 是否排除最后一层，默认为 true（parentTitles 不包含当前节点）
   * @returns string[] 父级标题数组
   */
  #buildParentTitles(propertyPath, excludeLastLevel = true) {
    if (propertyPath.length === 0) return [];
    const pathToProcess = excludeLastLevel ? propertyPath.slice(0, -1) : propertyPath;
    if (pathToProcess.length === 0) return [];
    const parentTitles = [];
    // 从根级开始逐层查找 meta title
    let currentMetas = this._getPropertiesMeta();
    for (let i = 0; i < pathToProcess.length; i++) {
      const currentKey = pathToProcess[i];
      const currentMeta = currentMetas[currentKey];
      if (!currentMeta || typeof currentMeta === 'function') {
        parentTitles.push(currentKey);
        break;
      }
      // 同步 meta，使用 title
      parentTitles.push(currentMeta.title || currentKey);
      // 为下一层级准备 meta 映射
      if (i < pathToProcess.length - 1 && currentMeta.properties && typeof currentMeta.properties !== 'function') {
        currentMetas = currentMeta.properties;
      } else if (i < pathToProcess.length - 1) {
        // 如果下一层是异步的或者不存在，无法继续，使用路径名填充剩余部分
        for (let j = i + 1; j < pathToProcess.length; j++) {
          parentTitles.push(pathToProcess[j]);
        }
        break;
      }
    }
    return parentTitles;
  }
  #toTreeNode(name, metaOrFactory, paths = [name], parentTitles = []) {
    // 检查缓存
    const cached = this._metaNodeCache.get(metaOrFactory);
    if (cached) {
      // 更新路径信息（因为同一个 meta 可能在不同路径下使用）
      cached.paths = paths;
      cached.parentTitles = parentTitles.length > 0 ? parentTitles : undefined;
      return cached;
    }
    let node;
    // 计算禁用/隐藏状态与原因的帮助函数
    const computeStateFromMeta = (m) => {
      if (!m) return { disabled: false, hidden: false };
      const disabledVal = typeof m.disabled === 'function' ? m.disabled() : m.disabled;
      const reasonVal = typeof m.disabledReason === 'function' ? m.disabledReason() : m.disabledReason;
      const hiddenVal = typeof m.hidden === 'function' ? m.hidden() : m.hidden;
      const disabledIsPromise = disabledVal && typeof disabledVal.then === 'function';
      const reasonIsPromise = reasonVal && typeof reasonVal.then === 'function';
      const hiddenIsPromise = hiddenVal && typeof hiddenVal.then === 'function';
      // getPropertyMetaTree 为同步 API：遇到 Promise 时 fail-open（不隐藏/不禁用）
      const disabled = disabledIsPromise ? false : !!disabledVal;
      const reason = reasonIsPromise ? undefined : reasonVal;
      const hidden = hiddenIsPromise ? false : !!hiddenVal;
      return { disabled, reason, hidden };
    };
    if (typeof metaOrFactory === 'function') {
      const initialTitle = name;
      const hasChildrenHint = metaOrFactory.hasChildren;
      node = {
        name,
        title: metaOrFactory.title || initialTitle,
        type: 'object',
        interface: undefined,
        options: undefined,
        uiSchema: undefined,
        paths,
        parentTitles: parentTitles.length > 0 ? parentTitles : undefined,
        disabled: () => {
          const maybe = metaOrFactory();
          if (maybe && typeof maybe['then'] === 'function') return false;
          return computeStateFromMeta(maybe).disabled;
        },
        disabledReason: () => {
          const maybe = metaOrFactory();
          if (maybe && typeof maybe['then'] === 'function') return undefined;
          return computeStateFromMeta(maybe).reason;
        },
        hidden: () => {
          const maybe = metaOrFactory();
          if (maybe && typeof maybe['then'] === 'function') return false;
          return computeStateFromMeta(maybe).hidden;
        },
        // 注意：即便 hasChildren === false，也只是“没有子节点”的 UI 提示；
        // 节点自身依然通过 meta 工厂保持惰性特性（需要时可解析出 title/type 等）。
        // 这里仅在 hasChildren !== false 时，提供子节点的懒加载逻辑。
        children:
          hasChildrenHint === false
            ? undefined
            : async () => {
                try {
                  const meta = await metaOrFactory();
                  const finalTitle = meta?.title || name;
                  node.title = finalTitle;
                  node.type = meta?.type;
                  node.interface = meta?.interface;
                  node.options = meta?.options;
                  node.uiSchema = meta?.uiSchema;
                  // parentTitles 保持不变，因为它不包含自身 title
                  if (!meta?.properties) return [];
                  const childNodes = this.#createChildNodes(
                    meta.properties,
                    paths,
                    [...parentTitles, finalTitle],
                    meta,
                  );
                  const resolvedChildren = Array.isArray(childNodes) ? childNodes : await childNodes();
                  // 更新 children 为解析后的结果
                  node.children = resolvedChildren;
                  return resolvedChildren;
                } catch (error) {
                  console.warn(`Failed to load meta for ${name}:`, error);
                  return [];
                }
              },
      };
    } else {
      // 同步 meta：直接创建节点
      const nodeTitle = metaOrFactory.title;
      const { disabled, reason, hidden } = computeStateFromMeta(metaOrFactory);
      node = {
        name,
        title: nodeTitle,
        type: metaOrFactory.type,
        interface: metaOrFactory.interface,
        options: metaOrFactory.options,
        uiSchema: metaOrFactory.uiSchema,
        paths,
        parentTitles: parentTitles.length > 0 ? parentTitles : undefined,
        disabled,
        disabledReason: reason,
        hidden,
        children: metaOrFactory.properties
          ? this.#createChildNodes(metaOrFactory.properties, paths, [...parentTitles, nodeTitle], metaOrFactory)
          : undefined,
      };
    }
    // 缓存节点
    this._metaNodeCache.set(metaOrFactory, node);
    return node;
  }
  _getPropertiesMeta() {
    const metaMap = {};
    // 先处理委托链（委托链的 meta 优先级较低）
    for (const delegate of this._delegates) {
      Object.assign(metaMap, delegate._getPropertiesMeta());
    }
    // 处理自身属性（自身属性优先级较高）
    for (const [key, options] of Object.entries(this._props)) {
      if (options.meta) {
        metaMap[key] = typeof options.meta === 'function' ? options.meta : options.meta;
      }
    }
    return metaMap;
  }
  // 只查找自身 _props
  _getOwnProperty(key, currentContext) {
    const options = this._props[key];
    if (!options) return undefined;
    // 静态值
    if ('value' in options) {
      return options.value;
    }
    // get 方法
    if (options.get) {
      if (options.cache === false) {
        return options.get(currentContext);
      }
      const cacheKey = options.observable ? '_observableCache' : '_cache';
      if (key in this[cacheKey]) {
        return this[cacheKey][key];
      }
      if (this._pending[key]) return this._pending[key];
      // 支持 async getter 并发排队
      const result = options.get(this.createProxy());
      // 判断是否为 Promise/thenable
      const isPromise =
        (typeof result === 'object' && result !== null && typeof result.then === 'function') ||
        (typeof result === 'function' && typeof result.then === 'function');
      if (isPromise) {
        this._pending[key] = result.then(
          (v) => {
            this[cacheKey][key] = v;
            delete this._pending[key];
            return v;
          },
          (err) => {
            delete this._pending[key];
            throw err;
          },
        );
        return this._pending[key];
      }
      // sync 直接缓存
      this[cacheKey][key] = result;
      return result;
    }
    return undefined;
  }
  // 只查找自身 _methods
  _getOwnMethod(key, flowContext) {
    const fn = this._methods[key];
    if (typeof fn === 'function') {
      return fn.bind(flowContext);
    }
    return fn;
  }
  _findPropertyInDelegates(delegates, key) {
    for (const delegate of delegates) {
      // 1. 查找委托的 _props
      if (Object.prototype.hasOwnProperty.call(delegate._props, key)) {
        return delegate._props[key];
      }
      // 2. 递归查找更深层的委托链
      const found = this._findPropertyInDelegates(delegate._delegates, key);
      if (found !== undefined) return found;
    }
    return undefined;
  }
  _findInDelegates(delegates, key) {
    for (const delegate of delegates) {
      // 1. 查找委托的 _props
      if (Object.prototype.hasOwnProperty.call(delegate._props, key)) {
        return {
          result: delegate._getOwnProperty(key, this.createProxy()),
        };
      }
      // 2. 查找委托的 _methods
      if (Object.prototype.hasOwnProperty.call(delegate._methods, key)) {
        return {
          result: delegate._getOwnMethod(key, this.createProxy()),
        };
      }
      // 3. 递归查找更深层的委托链
      const found = this._findInDelegates(delegate._delegates, key);
      if (found !== undefined) return found;
    }
    return undefined;
  }
  // 递归查找委托链
  _hasInDelegates(delegates, key) {
    for (const delegate of delegates) {
      if (Object.prototype.hasOwnProperty.call(delegate._props, key)) return true;
      if (Object.prototype.hasOwnProperty.call(delegate._methods, key)) return true;
      if (this._hasInDelegates(delegate._delegates, key)) return true;
    }
    return false;
  }
  /**
   * 获取属性定义选项（包含代理链）。
   *
   * - 优先查找当前上下文自身通过 defineProperty 注册的属性定义
   * - 若自身不存在，则沿委托链（delegates）向上查找第一个命中的定义
   *
   * @param key 顶层属性名（例如 'user'、'view'）
   * @returns 属性定义选项，或 undefined（未定义）
   */
  getPropertyOptions(key) {
    if (Object.prototype.hasOwnProperty.call(this._props, key)) {
      return this._props[key];
    }
    return this._findPropertyInDelegates(this._delegates, key);
  }
}
class BaseFlowEngineContext extends FlowContext {
  constructor() {
    super();
    this.defineMethod('getModel', (modelName, searchInPreviousEngines) => {
      return this.engine.getModel(modelName, searchInPreviousEngines);
    });
    this.defineMethod('request', (options) => {
      return this.api.request(options);
    });
    this.defineMethod('runjs', async function (code, variables, options) {
      const { preprocessTemplates, ...runnerOptions } = options || {};
      const mergedGlobals = { ...(runnerOptions?.globals || {}), ...(variables || {}) };
      const runner = await this.createJSRunner({
        ...(runnerOptions || {}),
        globals: mergedGlobals,
      });
      // Enable by default; use `preprocessTemplates: false` to explicitly disable.
      const shouldPreprocessTemplates = preprocessTemplates !== false;
      const jsCode = await prepareRunJsCode(String(code ?? ''), { preprocessTemplates: shouldPreprocessTemplates });
      return runner.run(jsCode);
    });
  }
}
class BaseFlowModelContext extends BaseFlowEngineContext {}
export class FlowEngineContext extends BaseFlowEngineContext {
  engine;
  // public dataSourceManager: DataSourceManager;
  constructor(engine) {
    if (!(engine instanceof FlowEngine)) {
      throw new Error('Invalid FlowEngine instance');
    }
    super();
    this.engine = engine;
    this.engine = engine;
    const dataSourceManager = new DataSourceManager();
    dataSourceManager.setFlowEngine(this.engine);
    const mainDataSource = new DataSource({
      key: 'main',
      displayName: 'Main',
    });
    dataSourceManager.addDataSource(mainDataSource);
    this.defineProperty('engine', {
      value: this.engine,
      info: {
        description: 'FlowEngine instance.',
        detail: 'FlowEngine',
      },
    });
    this.defineProperty('sql', {
      get: (ctx) => new FlowSQLRepository(ctx),
      cache: false,
      info: {
        description: 'SQL helper (FlowSQLRepository).',
        detail: 'FlowSQLRepository',
      },
    });
    this.defineProperty('dataSourceManager', {
      value: dataSourceManager,
      info: {
        description: 'DataSourceManager instance.',
        detail: 'DataSourceManager',
      },
    });
    const i18n = new FlowI18n(this);
    this.defineMethod('t', (keyOrTemplate, options) => {
      return i18n.translate(keyOrTemplate, options);
    });
    this.defineMethod('renderJson', function (template) {
      return this.resolveJsonTemplate(template);
    });
    this.defineMethod('resolveJsonTemplate', async function (template) {
      // 提取模板使用到的变量及其子路径
      const used = extractUsedVariablePaths(template);
      const usedVarNames = Object.keys(used || {});
      if (!usedVarNames.length) {
        // 模板未包含任何 ctx.* 变量，直接前端解析
        return resolveExpressions(template, this);
      }
      // 分流：根据 resolveOnServer 标记与子路径判断哪些交给后端
      const serverVarPaths = {};
      for (const varName of usedVarNames) {
        const paths = used[varName] || [];
        const opt = this.getPropertyOptions(varName);
        const mark = opt?.resolveOnServer;
        if (mark === true) {
          serverVarPaths[varName] = paths;
        } else if (typeof mark === 'function') {
          const filtered = paths.filter((p) => {
            try {
              return !!mark(p);
            } catch (_) {
              return false;
            }
          });
          if (filtered.length) serverVarPaths[varName] = filtered;
        }
      }
      const needServer = Object.keys(serverVarPaths).length > 0;
      let serverResolved = template;
      if (needServer) {
        const inferRecordRefWithMeta = (ctx) => {
          const ref = inferRecordRef(ctx);
          if (ref) return ref;
          try {
            const tk = ctx?.resource?.getMeta?.('currentFilterByTk');
            if (typeof tk === 'undefined' || tk === null) return undefined;
            const collection =
              ctx?.collection?.name || ctx?.resource?.getResourceName?.()?.split?.('.')?.slice?.(-1)?.[0];
            if (!collection) return undefined;
            const dataSourceKey = ctx?.collection?.dataSourceKey || ctx?.resource?.getDataSourceKey?.();
            return { collection, dataSourceKey, filterByTk: tk };
          } catch (_) {
            return undefined;
          }
        };
        const collectFromMeta = async () => {
          const out = {};
          try {
            const metas = this._getPropertiesMeta?.();
            if (!metas || typeof metas !== 'object') return out;
            for (const [key, metaOrFactory] of Object.entries(metas)) {
              if (!serverVarPaths[key]) continue; // 仅处理需要后端解析的变量
              try {
                let meta;
                if (typeof metaOrFactory === 'function') {
                  const fn = metaOrFactory;
                  meta = await fn();
                } else {
                  meta = metaOrFactory;
                }
                if (!meta || typeof meta !== 'object') continue;
                const builder = meta.buildVariablesParams;
                if (typeof builder !== 'function') continue;
                const built = await builder(this);
                if (!built) continue;
                const neededPaths = serverVarPaths[key] || [];
                const filtered = filterBuilderOutputByPaths(built, neededPaths);
                if (filtered && (typeof filtered !== 'object' || Object.keys(filtered).length)) {
                  out[key] = filtered;
                }
              } catch (_) {
                // 忽略单个属性的错误
              }
            }
          } catch (_) {
            // ignore
          }
          return out;
        };
        const inputFromMeta = await collectFromMeta();
        const autoInput = { ...inputFromMeta };
        // Special-case: formValues
        // If server needs to resolve some formValues paths but meta params only cover association anchors
        // (e.g. formValues.customer) and some top-level paths are missing (e.g. formValues.status),
        // inject a top-level record anchor (formValues -> { collection, filterByTk, fields/appends }) so server can fetch DB values.
        // This anchor MUST be selective (fields/appends derived from serverVarPaths['formValues']) to avoid server overriding
        // client-only values for configured form fields in the same template.
        try {
          const varName = 'formValues';
          const neededPaths = serverVarPaths[varName] || [];
          if (neededPaths.length) {
            const requiredTop = new Set();
            for (const p of neededPaths) {
              const top = topLevelOf(p);
              if (top) requiredTop.add(top);
            }
            const metaOut = inputFromMeta?.[varName];
            const builtTop = new Set();
            if (metaOut && typeof metaOut === 'object' && !Array.isArray(metaOut) && !isRecordRefLike(metaOut)) {
              Object.keys(metaOut).forEach((k) => builtTop.add(k));
            }
            const missing = [...requiredTop].filter((k) => !builtTop.has(k));
            if (missing.length) {
              const ref = inferRecordRefWithMeta(this);
              if (ref) {
                const { generatedFields, generatedAppends } = inferSelectsFromUsage(neededPaths);
                const recordRef = {
                  ...ref,
                  fields: generatedFields,
                  appends: generatedAppends,
                };
                // Preserve existing association anchors by lifting them to dotted keys before overwriting formValues
                const existing = autoInput[varName];
                if (
                  existing &&
                  typeof existing === 'object' &&
                  !Array.isArray(existing) &&
                  !isRecordRefLike(existing)
                ) {
                  for (const [k, v] of Object.entries(existing)) {
                    autoInput[`${varName}.${k}`] = v;
                  }
                  delete autoInput[varName];
                }
                autoInput[varName] = recordRef;
              }
            }
          }
        } catch (_) {
          // ignore
        }
        const autoContextParams = Object.keys(autoInput).length
          ? _buildServerContextParams(this, autoInput)
          : undefined;
        // 优化：若所有需要服务端解析的变量都声明了 “仅当有 contextParams 时才请求服务端”，
        // 且本次未能构建出任何 contextParams，则跳过服务端请求，回退到前端解析。
        if (!autoContextParams) {
          const keys = Object.keys(serverVarPaths);
          const allOptional =
            keys.length > 0 && keys.every((k) => this.getPropertyOptions(k)?.serverOnlyWhenContextParams);
          if (allOptional) {
            return resolveExpressions(template, this);
          }
        }
        if (this.api) {
          try {
            serverResolved = await enqueueVariablesResolve(this, {
              template,
              contextParams: autoContextParams || {},
            });
          } catch (e) {
            this.logger?.warn?.({ err: e }, 'variables:resolve failed, fallback to client-only');
            serverResolved = template;
          }
        }
      }
      return resolveExpressions(serverResolved, this);
    });
    // Helper: resolve a single ctx expression value via resolveJsonTemplate behavior.
    // Example: await ctx.getVar('ctx.record.id')
    this.defineMethod(
      'getVar',
      async function (varPath) {
        const raw = typeof varPath === 'string' ? varPath : String(varPath ?? '');
        const s = raw.trim();
        if (!s) return undefined;
        // Preferred input: 'ctx.xxx.yyy' (expression), consistent with envs.getVar outputs.
        if (s !== 'ctx' && !s.startsWith('ctx.')) {
          throw new Error(`ctx.getVar(path) expects an expression starting with "ctx.", got: "${s}"`);
        }
        return this.resolveJsonTemplate(`{{ ${s} }}`);
      },
      'Resolve a ctx expression value by path (expression starts with "ctx.").',
    );
    this.defineProperty('requirejs', {
      get: () => this.app?.requirejs?.requirejs,
    });
    // Expose API token and current role as top-level variables for VariableInput.
    // Front-end only: no resolveOnServer flag. Mark cache: false to reflect runtime changes.
    this.defineProperty('token', {
      get: () => this.api?.auth?.token,
      cache: false,
      // 注意：使用惰性 meta 工厂，避免在 i18n 尚未注入时提前求值导致无法翻译
      meta: Object.assign(() => ({ type: 'string', title: this.t('API Token'), sort: 980 }), {
        title: 'API Token',
        sort: 980,
        hasChildren: false,
      }),
    });
    this.defineProperty('role', {
      get: () => this.api?.auth?.role,
      cache: false,
      // 注意：使用惰性 meta 工厂，避免在 i18n 尚未注入时提前求值导致无法翻译
      meta: Object.assign(() => ({ type: 'string', title: this.t('Current role'), sort: 990 }), {
        title: escapeT('Current role'),
        sort: 990,
        hasChildren: false,
      }),
    });
    // URL 查询参数（等价于 1.0 的 `$nURLSearchParams`）
    this.defineProperty('urlSearchParams', {
      // 不缓存，确保随 URL 变化实时生效
      cache: false,
      get: () => {
        const search = this.location?.search || '';
        const str = search.startsWith('?') ? search.slice(1) : search;
        return qs.parse(str) || {};
      },
      // 变量选择器中的元信息与动态子项
      meta: Object.assign(
        () => ({
          type: 'object',
          title: this.t('URL search params'),
          sort: 970,
          disabled: () => {
            const search = this.location?.search || '';
            const str = search.startsWith('?') ? search.slice(1) : search;
            const params = qs.parse(str) || {};
            return Object.keys(params).length === 0;
          },
          disabledReason: () =>
            this.t(
              'The value of this variable is derived from the query string of the page URL. This variable can only be used normally when the page has a query string.',
            ),
          properties: async () => {
            const search = this.location?.search || '';
            const str = search.startsWith('?') ? search.slice(1) : search;
            const params = qs.parse(str) || {};
            const props = {};
            for (const key of Object.keys(params)) {
              props[key] = { type: 'string', title: key };
            }
            return props;
          },
        }),
        {
          title: escapeT('URL search params'),
          sort: 970,
          hasChildren: true,
        },
      ),
    });
    this.defineProperty('logger', {
      get: () => {
        return this.engine.logger.child({ module: 'flow-engine' });
      },
    });
    this.defineProperty('auth', {
      get: () => ({
        roleName: this.api.auth.role,
        locale: this.api.auth.locale,
        token: this.api.auth.token,
        user: this.user,
      }),
    });
    this.defineProperty('date', {
      get: () => {
        const createBranch = (prefix) => {
          return new Proxy(
            {},
            {
              get: (_target, prop) => {
                if (typeof prop !== 'string') return undefined;
                const nextPath = [...prefix, prop];
                if (!isCtxDatePathPrefix(nextPath)) {
                  return undefined;
                }
                const resolved = resolveCtxDatePath(nextPath);
                if (typeof resolved !== 'undefined') {
                  return resolved;
                }
                return createBranch(nextPath);
              },
            },
          );
        };
        return createBranch(['date']);
      },
      cache: false,
    });
    this.defineMethod(
      'loadCSS',
      async (href) => {
        const url = resolveModuleUrl(href);
        return new Promise((resolve, reject) => {
          // Check if CSS is already loaded
          const existingLink = document.querySelector(`link[href="${url}"]`);
          if (existingLink) {
            resolve(null);
            return;
          }
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = url;
          link.onload = () => resolve(null);
          link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
          document.head.appendChild(link);
        });
      },
      {
        description: 'Load a CSS file by URL (browser only).',
        params: [{ name: 'href', type: 'string', description: 'CSS URL.' }],
        returns: { type: 'Promise<void>' },
        completion: { insertText: "await ctx.loadCSS('https://example.com/style.css')" },
        examples: ["await ctx.loadCSS('https://example.com/style.css');"],
      },
    );
    this.defineMethod('requireAsync', async (url) => {
      // 判断是否为 CSS 文件（支持 example.css?v=123 等形式）
      if (isCssFile(url)) {
        return this.loadCSS(url);
      }
      const u = resolveModuleUrl(url, { raw: true });
      return await runjsRequireAsync(this.requirejs, u);
    });
    // 动态按 URL 加载 ESM 模块
    // - 使用 Vite / Webpack ignore 注释，避免被预打包或重写
    // - 通常返回模块命名空间对象（包含 default 与命名导出）；
    //   若模块只有 default 一个导出，则会直接返回 default 值以提升易用性（无需再访问 .default）
    this.defineMethod('importAsync', async function (url) {
      // 判断是否为 CSS 文件（支持 example.css?v=123 等形式）
      if (isCssFile(url)) {
        return this.loadCSS(url);
      }
      return await runjsImportModule(this, url, { importer: runjsImportAsync });
    });
    this.defineMethod('createJSRunner', async function (options) {
      try {
        const mod = await import('./runjs-context/setup');
        if (typeof mod?.setupRunJSContexts === 'function') await mod.setupRunJSContexts();
      } catch (_) {
        // ignore if setup is not available
      }
      const version = options?.version || 'v1';
      const modelClass = getModelClassName(this);
      const Ctor = RunJSContextRegistry.resolve(version, modelClass) || FlowRunJSContext;
      const runCtx = new Ctor(this);
      runCtx.defineMethod('t', (key, options) => {
        return this.t(key, { ns: 'runjs', ...options });
      });
      let doc = {};
      try {
        const locale = this?.api?.auth?.locale || this?.i18n?.language || this?.locale;
        if (Ctor?.getDoc?.length) doc = Ctor.getDoc(locale) || {};
        else doc = Ctor?.getDoc?.() || {};
      } catch (_) {
        doc = {};
      }
      const deprecatedCtx = createRunJSDeprecationProxy(runCtx, { doc });
      const globals = { ctx: deprecatedCtx, ...(options?.globals || {}) };
      const { timeoutMs } = options || {};
      return new JSRunner({ globals, timeoutMs });
    });
    // Helper: build server contextParams for variables:resolve
    this.defineMethod('buildServerContextParams', function (input) {
      return _buildServerContextParams(this, input);
    });
    this.defineMethod('getAction', function (name) {
      return this.engine.getAction(name);
    });
    this.defineMethod('getActions', function () {
      return this.engine.getActions();
    });
    this.defineMethod('getEvents', function () {
      return this.engine.getEvents();
    });
    this.defineMethod('runAction', async function (actionName, params) {
      const def = this.engine.getAction(actionName);
      // 使用“临时作用域”上下文，避免将临时定义污染到引擎级上下文，并在创建时应用定义
      const ctx = await createEphemeralContext(this, def);
      if (!def) {
        throw new Error(`Action '${actionName}' not found.`);
      }
      const defaultParams = await resolveDefaultParams(def.defaultParams, ctx);
      let combinedParams = { ...(defaultParams || {}), ...(params || {}) };
      let useRawParams = def.useRawParams;
      if (typeof useRawParams === 'function') {
        useRawParams = await useRawParams(ctx);
      }
      if (!useRawParams) {
        // 先服务端解析，再前端补齐
        combinedParams = await ctx.resolveJsonTemplate(combinedParams);
      }
      if (!def.handler) {
        throw new Error(`Action '${actionName}' has no handler.`);
      }
      return def.handler(ctx, combinedParams);
    });
    this.defineProperty('acl', {
      get: () => {
        const acl = new ACL(this.engine);
        return acl;
      },
    });
    this.defineMethod('aclCheck', function (params) {
      return this.acl.aclCheck(params);
    });
    this.defineMethod('createResource', function (resourceType) {
      return this.engine.createResource(resourceType, {
        context: this.createProxy(),
      });
    });
    this.defineMethod('makeResource', function (resourceType) {
      return this.engine.createResource(resourceType, {
        context: this.createProxy(),
      });
    });
    // Provide useResource in base engine context so RunJS can call it directly
    this.defineMethod('initResource', function (className) {
      if (!this.has('resource')) {
        this.defineProperty('resource', {
          get: () => this.createResource(className),
        });
      }
      return this.resource;
    });
    // @deprecated use `initResource` instead
    this.defineMethod('useResource', function (className) {
      return this.initResource(className);
    });
  }
}
export class FlowModelContext extends BaseFlowModelContext {
  constructor(model) {
    if (!model || typeof model !== 'object') {
      throw new Error('Invalid FlowModel instance');
    }
    super();
    this.addDelegate(model.flowEngine.context);
    this.defineMethod('onRefReady', (ref, cb, timeout) => {
      this.engine.reactView.onRefReady(ref, cb, timeout);
    });
    this.defineProperty('model', {
      value: model,
      info: {
        description: 'Current FlowModel instance.',
        detail: 'FlowModel',
      },
    });
    // 提供稳定的 ref 实例，确保渲染端与运行时上下文使用同一对象
    const stableRef = createRef();
    this.defineProperty('ref', {
      get: () => {
        this.model['_refCreated'] = true;
        return stableRef;
      },
      info: {
        description: 'Stable React ref for the view container.',
        detail: 'React.RefObject<HTMLDivElement>',
      },
    });
    this.defineMethod('openView', async function (uid, options) {
      const opts = { ...options };
      // NOTE: when custom context is passed, route navigation must be disabled to avoid losing it after refresh.
      if (opts.defineProperties || opts.defineMethods) {
        opts.navigation = false; // 强制不使用路由导航, 避免刷新页面时丢失上下文
      }
      let model = null;
      model = await this.engine.loadModel({ uid });
      if (!model) {
        const pickDefined = (src, keys) => {
          const res = {};
          for (const k of keys) {
            if (typeof src?.[k] !== 'undefined') {
              res[k] = src[k];
            }
          }
          return res;
        };
        model = this.engine.createModel({
          uid,
          use: 'PopupActionModel',
          parentId: this.model.uid,
          subType: 'object',
          subKey: uid,
          stepParams: {
            popupSettings: {
              openView: {
                // 仅在创建时持久化一份默认配置；运行时以本次 opts 为准，避免多个 opener 互相覆盖。
                ...pickDefined(opts, ['dataSourceKey', 'collectionName', 'associationName', 'mode', 'size']),
              },
            },
          },
        });
        await model.save();
      }
      model.setParent(this.model);
      // 路由层级的 viewUid：优先使用 routeViewUid（仅用于路由展示）；
      // 否则回退到 opts.viewUid；再否则沿用原有规则（若子模型具备弹窗配置则使用子模型 uid，否则使用发起者 uid）。
      const viewUid =
        opts?.routeViewUid ?? opts?.viewUid ?? (model.stepParams?.popupSettings?.openView ? model.uid : this.model.uid);
      // 不向子模型持久写入 context.inputArgs，避免后续“直接点击子模型按钮”读取到旧的 viewUid 造成路由污染。
      const parentView = this.view;
      // 统一语义：为即将打开的外部视图定义一个 PendingView（占位视图）
      const pendingType = opts?.isMobileLayout ? 'embed' : opts?.mode || 'drawer';
      const pendingInputArgs = { ...opts, viewUid, navigation: opts.navigation };
      pendingInputArgs.filterByTk = pendingInputArgs.filterByTk || this.inputArgs?.filterByTk;
      pendingInputArgs.sourceId = pendingInputArgs.sourceId || this.inputArgs?.sourceId;
      const pendingView = {
        type: pendingType,
        inputArgs: pendingInputArgs,
        navigation: parentView?.navigation,
        preventClose: !!opts?.preventClose,
        engineCtx: this.engine.context,
      };
      model.context.defineProperty('view', { value: pendingView });
      // 默认按 click 打开，但兼容 popupSettings 绑定到其他事件（例如 DuplicateActionModel 监听 openDuplicatePopup）。
      const popupFlow = model.getFlow?.('popupSettings');
      const on = popupFlow?.on;
      let openEventName = 'click';
      if (typeof on === 'string' && on) {
        openEventName = on;
      } else if (on && typeof on === 'object' && typeof on.eventName === 'string' && on.eventName) {
        openEventName = on.eventName;
      }
      await model.dispatchEvent(
        openEventName,
        {
          // navigation: false, // TODO: 路由模式有bug，不支持多层同样viewId的弹窗，因此这里默认先用false
          // ...this.model?.['getInputArgs']?.(), // 避免部分关系字段信息丢失, 仿照 ClickableCollectionField 做法
          ...opts,
        },
        {
          debounce: true,
        },
      );
    });
    this.defineMethod('getEvents', function () {
      return this.model.getEvents();
    });
    this.defineMethod('getAction', function (name) {
      return this.model.getAction(name);
    });
    this.defineMethod('getActions', function () {
      return this.model.getActions();
    });
    this.defineMethod('runAction', async function (actionName, params) {
      const def = this.model.getAction(actionName);
      // 使用“临时作用域”上下文，避免将临时定义污染到模型级上下文，并在创建时应用定义
      const ctx = await createEphemeralContext(this, def);
      if (!def) {
        throw new Error(`Action '${actionName}' not found.`);
      }
      const defaultParams = await resolveDefaultParams(def.defaultParams, ctx);
      let combinedParams = { ...(defaultParams || {}), ...(params || {}) };
      let useRawParams = def.useRawParams;
      if (typeof useRawParams === 'function') {
        useRawParams = await useRawParams(ctx);
      }
      if (!useRawParams) {
        combinedParams = await ctx.resolveJsonTemplate(combinedParams);
      }
      if (!def.handler) {
        throw new Error(`Action '${actionName}' has no handler.`);
      }
      return def.handler(ctx, combinedParams);
    });
  }
}
export class FlowForkModelContext extends BaseFlowModelContext {
  master;
  fork;
  constructor(master, fork) {
    if (!master || typeof master !== 'object') {
      throw new Error('Invalid FlowModel instance');
    }
    super();
    this.master = master;
    this.fork = fork;
    this.addDelegate(this.master.context);
    this.defineMethod('onRefReady', (ref, cb, timeout) => {
      this.engine.reactView.onRefReady(ref, cb, timeout);
    });
    this.defineProperty('model', {
      get: () => this.fork,
      info: {
        description: 'Current ForkFlowModel instance (as model).',
        detail: 'ForkFlowModel',
      },
    });
    // 提供稳定的 ref 实例，确保渲染端与运行时上下文使用同一对象
    const stableRef = createRef();
    this.defineProperty('ref', {
      get: () => {
        this.fork['_refCreated'] = true;
        return stableRef;
      },
      info: {
        description: 'Stable React ref for the view container.',
        detail: 'React.RefObject<HTMLDivElement>',
      },
    });
  }
}
export class FlowRuntimeContext extends BaseFlowModelContext {
  model;
  flowKey;
  _mode;
  stepResults = {};
  constructor(model, flowKey, _mode = 'runtime') {
    super();
    this.model = model;
    this.flowKey = flowKey;
    this._mode = _mode;
    this.addDelegate(this.model.context);
    this.defineMethod('getStepParams', (stepKey) => {
      return model.getStepParams(flowKey, stepKey) || {};
    });
    this.defineMethod('setStepParams', (stepKey, params) => {
      return model.setStepParams(flowKey, stepKey, params);
    });
    this.defineMethod('getStepResults', (stepKey) => {
      return _.get(this.steps, [stepKey, 'result']);
    });
    this.defineMethod('initResource', (className) => {
      if (model.context.has('resource')) {
        console.log(`[FlowRuntimeContext] useResource - resource already defined in context: ${className}`);
        return;
      }
      model.context.defineProperty('resource', {
        get: () => {
          return this.makeResource(className);
        },
      });
      if (!model['resource']) {
        model['resource'] = model.context.resource;
      }
    });
    // @deprecated use `initResource` instead
    this.defineMethod('useResource', (className) => {
      return this.initResource(className);
    });
    this.defineProperty('resource', {
      get: () => model['resource'] || model.context['resource'],
      cache: false,
    });
    this.defineMethod('onRefReady', (ref, cb, timeout) => {
      this.engine.reactView.onRefReady(ref, cb, timeout);
    });
  }
  _getOwnProperty(key) {
    if (this.mode === 'runtime') {
      return super._getOwnProperty(key, this.createProxy());
    }
    const options = this._props[key];
    if (!options) return undefined;
    // 静态值
    if ('value' in options) {
      return ContextPathProxy.create()[key];
    }
    // get 方法
    if (options.get) {
      if (options.cache === false) {
        return ContextPathProxy.create()[key];
      }
      const cacheKey = options.observable ? '_observableCache' : '_cache';
      if (!(key in this[cacheKey])) {
        this[cacheKey][key] = ContextPathProxy.create()[key];
      }
      return this[cacheKey][key];
    }
    return undefined;
  }
  exit() {
    throw new FlowExitAllException(this.flowKey, this.model.uid);
  }
  exitAll() {
    throw new FlowExitAllException(this.flowKey, this.model.uid);
  }
  get mode() {
    return this._mode;
  }
}
const __runjsClassDefaultMeta = new WeakMap();
const __runjsClassLocaleMeta = new WeakMap();
const __runjsDocCache = new WeakMap();
function __runjsDeepMerge(base, patch) {
  if (patch === null) return undefined;
  if (Array.isArray(base) || Array.isArray(patch) || typeof base !== 'object' || typeof patch !== 'object') {
    return patch ?? base;
  }
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    const v = __runjsDeepMerge(base?.[k], patch[k]);
    if (typeof v === 'undefined') delete out[k];
    else out[k] = v;
  }
  return out;
}
function __isPlainObject(val) {
  return !!val && typeof val === 'object' && !Array.isArray(val);
}
function __isPromiseLike(v) {
  return !!v && (typeof v === 'object' || typeof v === 'function') && typeof v.then === 'function';
}
function __normalizeDeprecationDoc(v) {
  if (v === true) return true;
  if (!v) return undefined;
  if (__isPlainObject(v)) return v;
  return undefined;
}
function __addDeprecatedPath(root, path, deprecated) {
  if (!Array.isArray(path) || !path.length) return;
  let cur = root;
  for (const seg of path) {
    if (!seg) return;
    cur.children = cur.children || {};
    cur.children[seg] = cur.children[seg] || {};
    cur = cur.children[seg];
  }
  cur.deprecated = deprecated;
}
function __mergeDeprecatedTree(base, patch) {
  if (patch.deprecated !== undefined) base.deprecated = patch.deprecated;
  const pChildren = patch.children || {};
  const keys = Object.keys(pChildren);
  if (!keys.length) return;
  base.children = base.children || {};
  for (const k of keys) {
    base.children[k] = base.children[k] || {};
    __mergeDeprecatedTree(base.children[k], pChildren[k]);
  }
}
function __buildDeprecatedTreeFromRunJSDoc(doc) {
  const root = {};
  if (!doc) return root;
  const walkProps = (props, parentPath) => {
    if (!__isPlainObject(props)) return;
    for (const [key, raw] of Object.entries(props)) {
      if (!key) continue;
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
      const node = raw;
      const dep = __normalizeDeprecationDoc(node.deprecated);
      if (dep) __addDeprecatedPath(root, [...parentPath, key], dep);
      if (__isPlainObject(node.properties)) {
        walkProps(node.properties, [...parentPath, key]);
      }
    }
  };
  const walkMethods = (methods) => {
    if (!__isPlainObject(methods)) return;
    for (const [key, raw] of Object.entries(methods)) {
      if (!key) continue;
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
      const node = raw;
      const dep = __normalizeDeprecationDoc(node.deprecated);
      if (dep) __addDeprecatedPath(root, [key], dep);
    }
  };
  walkProps(doc.properties, []);
  walkMethods(doc.methods);
  return root;
}
function __buildDeprecatedTreeFromFlowContextInfos(ctx) {
  const root = {};
  const visited = new WeakSet();
  const collectInfoProperties = (basePath, props) => {
    if (!__isPlainObject(props)) return;
    for (const [key, raw] of Object.entries(props)) {
      if (!key) continue;
      if (typeof raw === 'string') continue;
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
      const node = raw;
      const dep = __normalizeDeprecationDoc(node.deprecated);
      if (dep) __addDeprecatedPath(root, [...basePath, key], dep);
      if (__isPlainObject(node.properties)) {
        collectInfoProperties([...basePath, key], node.properties);
      }
    }
  };
  const walk = (c) => {
    if (!c || (typeof c !== 'object' && typeof c !== 'function')) return;
    if (visited.has(c)) return;
    visited.add(c);
    const methodInfos = c._methodInfos;
    if (__isPlainObject(methodInfos)) {
      for (const [name, info] of Object.entries(methodInfos)) {
        if (!name) continue;
        if (!info || typeof info !== 'object' || Array.isArray(info)) continue;
        const dep = __normalizeDeprecationDoc(info.deprecated);
        if (dep) __addDeprecatedPath(root, [name], dep);
      }
    }
    const props = c._props;
    if (__isPlainObject(props)) {
      for (const [name, opt] of Object.entries(props)) {
        if (!name) continue;
        const info = opt?.info;
        if (!info || typeof info !== 'object' || Array.isArray(info)) continue;
        const dep = __normalizeDeprecationDoc(info.deprecated);
        if (dep) __addDeprecatedPath(root, [name], dep);
        if (__isPlainObject(info.properties)) {
          collectInfoProperties([name], info.properties);
        }
      }
    }
    const delegates = c._delegates;
    if (Array.isArray(delegates)) {
      for (const d of delegates) walk(d);
    }
  };
  walk(ctx);
  return root;
}
export function createRunJSDeprecationProxy(ctx, options = {}) {
  const fromDoc = __buildDeprecatedTreeFromRunJSDoc(options.doc);
  const fromInfo = __buildDeprecatedTreeFromFlowContextInfos(ctx);
  __mergeDeprecatedTree(fromDoc, fromInfo);
  const warned = new Set();
  const proxyToTarget = new WeakMap();
  const objectProxyCache = new WeakMap();
  const functionProxyCache = new WeakMap();
  const extractRunJSLocation = (stack) => {
    if (!stack || typeof stack !== 'string') return {};
    const WRAPPER_PREFIX_LINES = 2; // JSRunner.run wraps user code with 2 lines before `${code}`
    const lines = stack.split('\n');
    for (const l of lines) {
      if (!l) continue;
      const m = l.match(/<anonymous>:(\d+):(\d+)/);
      if (!m) continue;
      const rawLine = Number(m[1]);
      const rawColumn = Number(m[2]);
      const line =
        Number.isFinite(rawLine) && rawLine > WRAPPER_PREFIX_LINES ? rawLine - WRAPPER_PREFIX_LINES : rawLine;
      const column = Number.isFinite(rawColumn) ? rawColumn : undefined;
      return { line, column, rawLine, rawColumn };
    }
    return {};
  };
  const collectInfoProperties = (basePath, props) => {
    if (!__isPlainObject(props)) return;
    for (const [key, raw] of Object.entries(props)) {
      if (!key) continue;
      if (typeof raw === 'string') continue;
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
      const node = raw;
      const dep = __normalizeDeprecationDoc(node.deprecated);
      if (dep) __addDeprecatedPath(fromDoc, [...basePath, key], dep);
      if (__isPlainObject(node.properties)) {
        collectInfoProperties([...basePath, key], node.properties);
      }
    }
  };
  const updateTreeFromDefineProperty = (name, options) => {
    if (!name) return;
    const info = options?.info;
    if (!info || typeof info !== 'object' || Array.isArray(info)) return;
    const dep = __normalizeDeprecationDoc(info.deprecated);
    if (dep) __addDeprecatedPath(fromDoc, [name], dep);
    if (__isPlainObject(info.properties)) {
      collectInfoProperties([name], info.properties);
    }
  };
  const updateTreeFromDefineMethod = (name, info) => {
    if (!name) return;
    if (!info || typeof info !== 'object' || Array.isArray(info)) return;
    const dep = __normalizeDeprecationDoc(info.deprecated);
    if (dep) __addDeprecatedPath(fromDoc, [name], dep);
  };
  const unwrapProxy = (val) => {
    let cur = val;
    while (cur && (typeof cur === 'object' || typeof cur === 'function')) {
      const mapped = proxyToTarget.get(cur);
      if (!mapped) break;
      cur = mapped;
    }
    return cur;
  };
  const formatReplacedBy = (replacedBy) => {
    if (!replacedBy) return undefined;
    if (typeof replacedBy === 'string') return replacedBy.trim() || undefined;
    if (Array.isArray(replacedBy)) {
      const parts = replacedBy.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
      return parts.length ? parts.join(', ') : undefined;
    }
    return undefined;
  };
  const warnOnce = (apiPath, deprecated, stack) => {
    if (!apiPath) return;
    if (warned.has(apiPath)) return;
    warned.add(apiPath);
    const logger = ctx?.logger;
    const t =
      typeof ctx?.t === 'function'
        ? (key, options) => ctx.t(key, { ns: [FLOW_ENGINE_NAMESPACE, 'client'], nsMode: 'fallback', ...options })
        : (key, options) => {
            const fallback = options?.defaultValue ?? key;
            if (typeof fallback !== 'string' || !options) return fallback;
            // lightweight interpolation for fallback strings (i18next-style: {{var}})
            return fallback.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, k) => {
              const v = options?.[k];
              return typeof v === 'string' || typeof v === 'number' ? String(v) : '';
            });
          };
    const meta = typeof deprecated === 'object' && deprecated ? deprecated : {};
    const replacedBy = formatReplacedBy(meta.replacedBy);
    const since = typeof meta.since === 'string' ? String(meta.since) : undefined;
    const removedIn = typeof meta.removedIn === 'string' ? String(meta.removedIn) : undefined;
    const message = typeof meta.message === 'string' ? String(meta.message) : '';
    const loc = extractRunJSLocation(stack);
    const locText = loc.line ? `（line ${loc.line}${loc.column ? `:${loc.column}` : ''}）` : '';
    const msg = message.trim();
    const mainText = msg
      ? t('RunJS deprecated warning with message', {
          defaultValue: '[RunJS][Deprecated] {{api}} {{message}}{{location}}',
          api: apiPath,
          message: msg,
          location: locText,
        })
      : t('RunJS deprecated warning', {
          defaultValue: '[RunJS][Deprecated] {{api}} is deprecated{{location}}',
          api: apiPath,
          location: locText,
        });
    const separator = t('RunJS deprecated separator', { defaultValue: '; ' });
    const textParts = [mainText];
    if (replacedBy)
      textParts.push(t('RunJS deprecated replacedBy', { defaultValue: 'Use {{replacedBy}} instead', replacedBy }));
    if (since) textParts.push(t('RunJS deprecated since', { defaultValue: 'since {{since}}', since }));
    if (removedIn)
      textParts.push(t('RunJS deprecated removedIn', { defaultValue: 'will be removed in {{removedIn}}', removedIn }));
    const text = textParts.filter(Boolean).join(separator);
    try {
      if (logger && typeof logger.warn === 'function') {
        logger.warn(text);
      } else {
        // fail-open: avoid breaking runjs execution when logger is missing
        console.warn(text);
      }
    } catch (_) {
      // ignore logger failures
    }
  };
  const createFunctionProxy = (fn, node, path) => {
    const dep = node.deprecated;
    if (!dep) return fn;
    const cacheByPath = functionProxyCache.get(fn) || new Map();
    functionProxyCache.set(fn, cacheByPath);
    if (cacheByPath.has(path)) return cacheByPath.get(path);
    const proxied = new Proxy(fn, {
      apply(target, thisArg, argArray) {
        const stack = warned.has(path) ? undefined : new Error().stack;
        warnOnce(path, dep, stack);
        const realThis = unwrapProxy(thisArg);
        return Reflect.apply(target, realThis, argArray);
      },
      get(target, key, receiver) {
        return Reflect.get(target, key, receiver);
      },
    });
    cacheByPath.set(path, proxied);
    return proxied;
  };
  const createObjectProxy = (target, node, path) => {
    if (!target || (typeof target !== 'object' && typeof target !== 'function')) return target;
    if (__isPromiseLike(target)) return target;
    const hasChildren = !!node.children && Object.keys(node.children).length > 0;
    if (!hasChildren && path !== 'ctx') return target;
    const cacheByPath = objectProxyCache.get(target) || new Map();
    objectProxyCache.set(target, cacheByPath);
    if (cacheByPath.has(path)) return cacheByPath.get(path);
    const proxied = new Proxy(target, {
      get(t, key, receiver) {
        if (typeof key === 'symbol') {
          return Reflect.get(t, key, unwrapProxy(receiver));
        }
        const prop = String(key);
        const value = Reflect.get(t, key, unwrapProxy(receiver));
        // Support dynamic deprecation registration via ctx.defineProperty/defineMethod during RunJS execution.
        // - This is especially useful when the deprecated API is introduced after JSRunner is created.
        if (path === 'ctx' && prop === 'defineProperty' && typeof value === 'function') {
          return (...args) => {
            const result = value(...args);
            try {
              updateTreeFromDefineProperty(String(args?.[0] ?? ''), args?.[1]);
            } catch (_) {
              // ignore
            }
            return result;
          };
        }
        if (path === 'ctx' && prop === 'defineMethod' && typeof value === 'function') {
          return (...args) => {
            const result = value(...args);
            try {
              updateTreeFromDefineMethod(String(args?.[0] ?? ''), args?.[2]);
            } catch (_) {
              // ignore
            }
            return result;
          };
        }
        const child = node.children?.[prop];
        if (!child) return value;
        const childPath = `${path}.${prop}`;
        if (typeof value === 'function' && child.deprecated) {
          return createFunctionProxy(value, child, childPath);
        }
        if (child.deprecated) {
          // For non-callable APIs, "use" happens on access (there is no apply step).
          const stack = warned.has(childPath) ? undefined : new Error().stack;
          warnOnce(childPath, child.deprecated, stack);
        }
        if (value && (typeof value === 'object' || typeof value === 'function') && child.children) {
          return createObjectProxy(value, child, childPath);
        }
        return value;
      },
      has(t, key) {
        return Reflect.has(t, key);
      },
    });
    proxyToTarget.set(proxied, target);
    cacheByPath.set(path, proxied);
    return proxied;
  };
  return createObjectProxy(ctx, fromDoc, 'ctx');
}
function __mergeRunJSDocDocRecord(base, patch, mergeDoc) {
  if (!__isPlainObject(patch)) return base;
  // Important: preserve `null` markers when base is not an object (e.g. child class wants to delete parent keys).
  // If we eagerly delete them here, the deletion intent is lost for later merges in the inheritance chain.
  if (!__isPlainObject(base)) return patch;
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    const pv = patch[k];
    if (pv === null) {
      delete out[k];
      continue;
    }
    const bv = __isPlainObject(base) ? base[k] : undefined;
    const merged = mergeDoc(bv, pv);
    if (typeof merged === 'undefined') delete out[k];
    else out[k] = merged;
  }
  return out;
}
function __mergeRunJSDocPropertyDoc(base, patch) {
  if (patch === null) return undefined;
  const baseIsObj = __isPlainObject(base);
  const patchIsObj = __isPlainObject(patch);
  const baseIsStr = typeof base === 'string';
  const patchIsStr = typeof patch === 'string';
  // Treat string docs as { description: string } when merging with object docs,
  // to avoid "whole replacement" that drops base hidden/properties/completion.
  if (patchIsStr) {
    if (baseIsObj) {
      return __mergeRunJSDocPropertyDoc(base, { description: patch });
    }
    return patch;
  }
  if (patchIsObj) {
    const baseObj = baseIsObj ? base : baseIsStr ? { description: base } : undefined;
    const out = { ...(baseObj || {}) };
    for (const k of Object.keys(patch)) {
      if (k === 'properties') {
        const pv = patch.properties;
        if (pv === null) {
          delete out.properties;
          continue;
        }
        const mergedProps = __mergeRunJSDocDocRecord(baseObj?.properties, pv, __mergeRunJSDocPropertyDoc);
        if (typeof mergedProps === 'undefined') delete out.properties;
        else out.properties = mergedProps;
        continue;
      }
      const mergedVal = __runjsDeepMerge(baseObj?.[k], patch[k]);
      if (typeof mergedVal === 'undefined') delete out[k];
      else out[k] = mergedVal;
    }
    return out;
  }
  return patch ?? base;
}
function __mergeRunJSDocMethodDoc(base, patch) {
  if (patch === null) return undefined;
  const baseIsObj = __isPlainObject(base);
  const patchIsObj = __isPlainObject(patch);
  const baseIsStr = typeof base === 'string';
  const patchIsStr = typeof patch === 'string';
  if (patchIsStr) {
    if (baseIsObj) {
      return __mergeRunJSDocMethodDoc(base, { description: patch });
    }
    return patch;
  }
  if (patchIsObj) {
    const baseObj = baseIsObj ? base : baseIsStr ? { description: base } : undefined;
    const out = { ...(baseObj || {}) };
    for (const k of Object.keys(patch)) {
      const mergedVal = __runjsDeepMerge(baseObj?.[k], patch[k]);
      if (typeof mergedVal === 'undefined') delete out[k];
      else out[k] = mergedVal;
    }
    return out;
  }
  return patch ?? base;
}
function __mergeRunJSDocMeta(base, patch) {
  const baseObj = __isPlainObject(base) ? base : {};
  const patchObj = __isPlainObject(patch) ? patch : {};
  const out = { ...baseObj };
  for (const k of Object.keys(patchObj)) {
    if (k === 'properties') {
      const mergedProps = __mergeRunJSDocDocRecord(baseObj.properties, patchObj.properties, __mergeRunJSDocPropertyDoc);
      if (typeof mergedProps === 'undefined') delete out.properties;
      else out.properties = mergedProps;
      continue;
    }
    if (k === 'methods') {
      const mergedMethods = __mergeRunJSDocDocRecord(baseObj.methods, patchObj.methods, __mergeRunJSDocMethodDoc);
      if (typeof mergedMethods === 'undefined') delete out.methods;
      else out.methods = mergedMethods;
      continue;
    }
    const mergedVal = __runjsDeepMerge(baseObj[k], patchObj[k]);
    if (typeof mergedVal === 'undefined') delete out[k];
    else out[k] = mergedVal;
  }
  return out;
}
export class FlowRunJSContext extends FlowContext {
  constructor(delegate) {
    super();
    this.addDelegate(delegate);
    this.defineProperty('React', { value: React });
    this.defineProperty('antd', { value: antd });
    this.defineProperty('dayjs', {
      value: dayjs,
    });
    // 为 JS 运行时代码提供带有 antd/App/ConfigProvider 包裹的 React 根
    // 保持与 ReactDOMClient 接口一致，优先覆盖 createRoot，其余方法透传
    const ReactDOMShim = {
      ...ReactDOMClient,
      createRoot: (container, options) => {
        // 兼容 ElementProxy：若传入的是代理对象，取其底层原生元素
        const realContainer = container?.__el || container;
        // 使用引擎自带的 reactView.createRoot，以继承应用内的 ConfigProvider/App 上下文与主题
        return this.engine.reactView.createRoot(realContainer, options);
      },
    };
    ReactDOMShim.__nbRunjsInternalShim = true;
    this.defineProperty('ReactDOM', { value: ReactDOMShim });
    setupRunJSLibs(this);
    // Convenience: ctx.render(<App />[, container])
    // - container defaults to ctx.element if available
    // - internally uses engine.reactView.createRoot to inherit app context
    // - caches root per container via global WeakMap
    this.defineMethod('render', function (vnode, container) {
      const el = container || this.element;
      if (!el) throw new Error('ctx.render: container not provided and ctx.element is not available');
      const containerEl = el?.__el || el; // unwrap ElementProxy
      const globalRef = globalThis;
      globalRef.__nbRunjsRoots = globalRef.__nbRunjsRoots || new WeakMap();
      const rootMap = globalRef.__nbRunjsRoots;
      const disposeEntry = (entry) => {
        if (!entry) return;
        if (entry.disposeTheme && typeof entry.disposeTheme === 'function') {
          try {
            entry.disposeTheme();
          } catch (_) {
            // ignore
          }
          entry.disposeTheme = undefined;
        }
        const root = entry.root || entry;
        if (root && typeof root.unmount === 'function') {
          try {
            root.unmount();
          } catch (_) {
            // ignore
          }
        }
      };
      const unmountContainerRoot = () => {
        const existing = rootMap.get(containerEl);
        if (existing) {
          disposeEntry(existing);
          rootMap.delete(containerEl);
        }
      };
      // If vnode is string (HTML), unmount react root and set sanitized HTML
      if (typeof vnode === 'string') {
        unmountContainerRoot();
        const proxy = new ElementProxy(containerEl);
        proxy.innerHTML = String(vnode ?? '');
        return null;
      }
      // If vnode is a DOM Node or DocumentFragment, unmount and replace content
      if (vnode && vnode.nodeType && (vnode.nodeType === 1 || vnode.nodeType === 3 || vnode.nodeType === 11)) {
        unmountContainerRoot();
        while (containerEl.firstChild) containerEl.removeChild(containerEl.firstChild);
        containerEl.appendChild(vnode);
        return null;
      }
      // 注意：rootMap 是“全局按容器复用”的（key=containerEl）。
      // 若不同 RunJS ctx 复用同一个 containerEl，且 ReactDOM 实例引用也相同，
      // 则会复用到旧 entry，进而复用旧 ctx 创建的 autorun（闭包捕获旧 ctx），造成：
      // 1) 旧 ctx 的 reaction 继续驱动新渲染（跨 ctx 复用风险）
      // 2) 新 ctx 的主题变化不再触发 rerender
      // 3) 旧 ctx 被 entry/autorun 间接持有，无法被 GC（内存泄漏）
      // 因此这里把 ownerKey（当前 ctx）也纳入复用判断；owner 变化时必须重建 entry。
      const rendererKey = this.ReactDOM;
      const ownerKey = this;
      let entry = rootMap.get(containerEl);
      if (!entry || entry.rendererKey !== rendererKey || entry.ownerKey !== ownerKey) {
        if (entry) {
          disposeEntry(entry);
          rootMap.delete(containerEl);
        }
        const root = this.ReactDOM.createRoot(containerEl);
        entry = { rendererKey, ownerKey, root, disposeTheme: undefined, lastVnode: undefined };
        rootMap.set(containerEl, entry);
      }
      return externalReactRender({
        ctx: this,
        entry,
        vnode,
        containerEl,
        rootMap,
        unmountContainerRoot,
        internalReact: React,
        internalAntd: antd,
      });
    });
  }
  exit() {
    throw new FlowExitAllException(this.flowKey, this.model?.uid || 'runjs');
  }
  exitAll() {
    throw new FlowExitAllException(this.flowKey, this.model?.uid || 'runjs');
  }
  static define(meta, options) {
    const locale = options?.locale;
    if (locale) {
      const map = __runjsClassLocaleMeta.get(this) || new Map();
      const prev = map.get(locale) || {};
      map.set(locale, __mergeRunJSDocMeta(prev, meta));
      __runjsClassLocaleMeta.set(this, map);
    } else {
      const prev = __runjsClassDefaultMeta.get(this) || {};
      __runjsClassDefaultMeta.set(this, __mergeRunJSDocMeta(prev, meta));
    }
    __runjsDocCache.delete(this);
  }
  static getDoc(locale) {
    const self = this;
    let cacheForClass = __runjsDocCache.get(self);
    const cacheKey = String(locale || 'default');
    if (cacheForClass && cacheForClass.has(cacheKey)) return cacheForClass.get(cacheKey);
    const chain = [];
    let cur = self;
    while (cur && cur.prototype) {
      chain.unshift(cur);
      cur = Object.getPrototypeOf(cur);
    }
    let merged = {};
    for (const cls of chain) {
      merged = __mergeRunJSDocMeta(merged, __runjsClassDefaultMeta.get(cls) || {});
    }
    if (locale) {
      for (const cls of chain) {
        const lmap = __runjsClassLocaleMeta.get(cls);
        if (lmap && lmap.has(locale)) {
          merged = __mergeRunJSDocMeta(merged, lmap.get(locale));
        }
      }
    }
    if (!cacheForClass) {
      cacheForClass = new Map();
      __runjsDocCache.set(self, cacheForClass);
    }
    cacheForClass.set(cacheKey, merged);
    return merged;
  }
}
//# sourceMappingURL=flowContext.js.map
