/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowContext } from '../flowContext';
export async function createEphemeralContext(parent, contextDefs) {
  // 若未提供任何上下文定义，直接复用父级上下文，避免不必要的代理包装
  if (contextDefs == null || (!contextDefs.defineProperties && !contextDefs.defineMethods)) {
    return parent;
  }
  // 1) 创建一个新的 FlowContext，专门承载“临时定义”（defineProperty/defineMethod）
  const scoped = new FlowContext();
  // 2) 读取优先：先从 scoped 自身取（_props/_methods），否则委托到 parent（仅 _props/_methods）
  scoped.addDelegate(parent);
  // 3) 先创建 scoped 的代理，用于注入阶段（define* 直达 scoped；读写行为与最终代理一致）
  const scopedProxy = scoped.createProxy();
  const scopedObj = scopedProxy;
  const parentObj = parent;
  const getFromParent = (key) => {
    const val = Reflect.get(parentObj, key, parentObj);
    return typeof val === 'function' ? val.bind(parent) : val;
  };
  const hasInScopedOrParent = (key) =>
    key === 'defineProperty' || key === 'defineMethod' || Reflect.has(scopedObj, key) || Reflect.has(parentObj, key);
  const injectionProxy = new Proxy(scopedProxy, {
    get(_t, key, receiver) {
      if (typeof key === 'string') {
        // 注入阶段：允许在 defLike 的函数体中调用 ctx.defineProperty/defineMethod 写入 scoped
        if (key === 'defineProperty') {
          return (propKey, options) => scoped.defineProperty(propKey, options);
        }
        if (key === 'defineMethod') {
          return (name, fn, info) => scoped.defineMethod(name, fn, info);
        }
        if (Reflect.has(scopedObj, key)) {
          return Reflect.get(scopedObj, key, receiver);
        }
        return getFromParent(key);
      }
      return Reflect.get(scopedObj, key, receiver);
    },
    set(_t, key, value) {
      return Reflect.set(parentObj, key, value);
    },
    has(_t, key) {
      return hasInScopedOrParent(key);
    },
    getOwnPropertyDescriptor(_t, key) {
      return Object.getOwnPropertyDescriptor(scopedObj, key) || Object.getOwnPropertyDescriptor(parentObj, key);
    },
  });
  // 如果提供了 contextDefs，则在创建时即注入定义，便于外部更简洁地使用
  if (contextDefs) {
    const defs = Array.isArray(contextDefs) ? contextDefs : [contextDefs];
    for (const defLike of defs) {
      if (!defLike) continue;
      // 1) defineProperties -> 写入到 scoped（避免污染父级）
      const dp = defLike.defineProperties;
      if (dp) {
        const raw = typeof dp === 'function' ? await dp(injectionProxy) : dp;
        if (!raw || typeof raw !== 'object') {
          throw new TypeError('defineProperties must return an object of PropertyOptions');
        }
        const propsDef = raw;
        for (const [key, options] of Object.entries(propsDef)) {
          if (!options || typeof options !== 'object') {
            throw new TypeError(`defineProperties['${key}'] must be a PropertyOptions object`);
          }
          // 直接在 scoped 上定义，确保仅限本次临时作用域
          scoped.defineProperty(key, options);
        }
      }
      // 2) defineMethods -> 写入到 scoped（避免污染父级）
      const dm = defLike.defineMethods;
      if (dm) {
        const raw = typeof dm === 'function' ? await dm(injectionProxy) : dm;
        if (!raw || typeof raw !== 'object') {
          throw new TypeError('defineMethods must return an object of functions');
        }
        const methodsDef = raw;
        for (const [key, fn] of Object.entries(methodsDef)) {
          if (typeof fn !== 'function') {
            throw new TypeError(`defineMethods['${key}'] must be a function`);
          }
          scoped.defineMethod(key, fn);
        }
      }
    }
  }
  // 4) 创建最终对外代理：读取优先 scoped，兜底父级，且后续 define* 写入父级
  const outerProxy = new Proxy(scopedProxy, {
    get(_t, key, receiver) {
      if (typeof key === 'string') {
        if (key === 'defineProperty') {
          return (propKey, options) => parent.defineProperty(propKey, options);
        }
        if (key === 'defineMethod') {
          return (name, fn, info) => parent.defineMethod(name, fn, info);
        }
        if (Reflect.has(scopedObj, key)) {
          return Reflect.get(scopedObj, key, receiver);
        }
        return getFromParent(key);
      }
      return Reflect.get(scopedObj, key, receiver);
    },
    set(_t, key, value) {
      return Reflect.set(parentObj, key, value);
    },
    has(_t, key) {
      return hasInScopedOrParent(key);
    },
    getOwnPropertyDescriptor(_t, key) {
      return Object.getOwnPropertyDescriptor(scopedObj, key) || Object.getOwnPropertyDescriptor(parentObj, key);
    },
  });
  return outerProxy;
}
//# sourceMappingURL=createEphemeralContext.js.map
