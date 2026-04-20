/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
function getRunJSSafeGlobalsRegistry() {
  const g = globalThis;
  if (g.__nocobaseRunJSSafeGlobalsRegistry?.windowAllow && g.__nocobaseRunJSSafeGlobalsRegistry?.documentAllow) {
    return g.__nocobaseRunJSSafeGlobalsRegistry;
  }
  const reg = {
    windowAllow: new Set(),
    documentAllow: new Set(),
  };
  g.__nocobaseRunJSSafeGlobalsRegistry = reg;
  return reg;
}
export function registerRunJSSafeWindowGlobals(keys) {
  if (!keys) return;
  const reg = getRunJSSafeGlobalsRegistry();
  for (const k of keys) {
    if (typeof k !== 'string') continue;
    const key = k.trim();
    if (!key) continue;
    reg.windowAllow.add(key);
  }
}
export function registerRunJSSafeDocumentGlobals(keys) {
  if (!keys) return;
  const reg = getRunJSSafeGlobalsRegistry();
  for (const k of keys) {
    if (typeof k !== 'string') continue;
    const key = k.trim();
    if (!key) continue;
    reg.documentAllow.add(key);
  }
}
export function __resetRunJSSafeGlobalsRegistryForTests() {
  const g = globalThis;
  if (g.__nocobaseRunJSSafeGlobalsRegistry) {
    try {
      g.__nocobaseRunJSSafeGlobalsRegistry.windowAllow?.clear?.();
      g.__nocobaseRunJSSafeGlobalsRegistry.documentAllow?.clear?.();
    } catch {
      // ignore
    }
  }
}
function isAllowedDynamicWindowKey(key) {
  return getRunJSSafeGlobalsRegistry().windowAllow.has(key);
}
function isAllowedDynamicDocumentKey(key) {
  return getRunJSSafeGlobalsRegistry().documentAllow.has(key);
}
export function createSafeWindow(extra) {
  // 解析相对 URL 使用脱敏 base（不含 query/hash），避免在解析时泄露敏感信息
  const getSafeBaseHref = () => `${window.location.origin}${window.location.pathname}`;
  // 安全的 window.open 代理
  const safeOpen = (url, target, features) => {
    // 仅允许 http/https 和 about:blank
    const isSafeUrl = (u) => {
      try {
        const parsed = new URL(u, getSafeBaseHref()); // 使用脱敏 base
        const protocol = parsed.protocol.toLowerCase();
        if (protocol === 'about:') return parsed.href === 'about:blank';
        return protocol === 'http:' || protocol === 'https:';
      } catch {
        return false;
      }
    };
    if (!isSafeUrl(url)) {
      throw new Error('Unsafe URL: window.open only allows http/https/about:blank.');
    }
    // 强制在新标签页打开，避免覆盖当前页或父窗口
    const sanitizedTarget = '_blank';
    // 合并并强制加上安全特性
    const enforceFeatures = (f) => {
      const set = new Set();
      if (f) {
        f.split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((part) => {
            const key = part.split('=')[0].trim().toLowerCase();
            if (key !== 'noopener' && key !== 'noreferrer') set.add(part);
          });
      }
      set.add('noopener');
      set.add('noreferrer');
      return Array.from(set).join(',');
    };
    const sanitizedFeatures = enforceFeatures(features);
    // 调用原生 window.open
    const newWin = window.open.call(window, url, sanitizedTarget, sanitizedFeatures);
    // 双重保险：禁用 opener（部分浏览器/场景下 features 可能不生效）
    if (newWin && 'opener' in newWin) {
      try {
        newWin.opener = null;
      } catch {
        // ignore
      }
    }
    return newWin;
  };
  // 同源在当前页导航；跨域强制用新标签页 + noreferrer/noopener
  const guardedNavigate = (rawUrl, opts) => {
    const parsed = new URL(rawUrl, getSafeBaseHref());
    const protocol = parsed.protocol.toLowerCase();
    const isAboutBlank = protocol === 'about:' && parsed.href === 'about:blank';
    const isHttp = protocol === 'http:' || protocol === 'https:';
    if (!isHttp && !isAboutBlank) {
      throw new Error('Unsafe URL: only http/https/about:blank are allowed.');
    }
    if (isAboutBlank) {
      return opts?.replace ? window.location.replace('about:blank') : window.location.assign('about:blank');
    }
    const sameOrigin =
      parsed.protocol === window.location.protocol &&
      parsed.hostname === window.location.hostname &&
      parsed.port === window.location.port;
    if (sameOrigin) {
      return opts?.replace ? window.location.replace(parsed.href) : window.location.assign(parsed.href);
    }
    const win = safeOpen(parsed.href);
    if (!win) throw new Error('Popup blocked: cross-origin navigation is opened in a new tab.');
  };
  // 只读/脱敏的 location 代理；支持安全的 href 赋值和 assign/replace
  const safeLocation = new Proxy(
    {},
    {
      get(_t, prop) {
        switch (prop) {
          case 'origin':
            return window.location.origin;
          case 'protocol':
            return window.location.protocol;
          case 'host':
            return window.location.host;
          case 'hostname':
            return window.location.hostname;
          case 'port':
            return window.location.port;
          case 'pathname':
            return window.location.pathname;
          case 'assign':
            return (u) => guardedNavigate(u, { replace: false });
          case 'replace':
            return (u) => guardedNavigate(u, { replace: true });
          case 'reload':
            return window.location.reload.bind(window.location);
          case 'href':
            throw new Error('Reading location.href is not allowed.');
          default:
            throw new Error(`Access to location property "${prop}" is not allowed.`);
        }
      },
      set(_t, prop, value) {
        if (prop === 'href') {
          guardedNavigate(String(value), { replace: false });
          return true;
        }
        throw new Error('Mutation on location is not allowed.');
      },
    },
  );
  const allowedGlobals = {
    // 需绑定到原始 window，避免严格模式下触发 Illegal invocation
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    setInterval: window.setInterval.bind(window),
    clearInterval: window.clearInterval.bind(window),
    console,
    Math,
    Date,
    FormData,
    ...(typeof Blob !== 'undefined' ? { Blob } : {}),
    ...(typeof URL !== 'undefined' ? { URL } : {}),
    // 事件侦听仅绑定到真实 window，便于少量需要的全局监听
    addEventListener: addEventListener.bind(window),
    // 安全的 window.open 代理
    open: safeOpen,
    // 安全的 location 代理
    location: safeLocation,
    ...(extra || {}),
  };
  const target = Object.create(null);
  return new Proxy(target, {
    get(t, prop) {
      if (typeof prop !== 'string') {
        return Reflect.get(t, prop);
      }
      if (prop in allowedGlobals) return allowedGlobals[prop];
      if (Object.prototype.hasOwnProperty.call(t, prop)) return t[prop];
      if (isAllowedDynamicWindowKey(prop)) {
        const v = window[prop];
        // Bind functions to the real window to avoid Illegal invocation
        if (typeof v === 'function') return v.bind(window);
        return v;
      }
      throw new Error(`Access to global property "${prop}" is not allowed.`);
    },
    set(t, prop, value) {
      if (typeof prop !== 'string') {
        Reflect.set(t, prop, value);
        return true;
      }
      if (prop in allowedGlobals) {
        throw new Error(`Mutation of global property "${prop}" is not allowed.`);
      }
      t[prop] = value;
      return true;
    },
    has(t, prop) {
      if (typeof prop !== 'string') return Reflect.has(t, prop);
      if (prop in allowedGlobals) return true;
      if (Object.prototype.hasOwnProperty.call(t, prop)) return true;
      if (isAllowedDynamicWindowKey(prop)) return true;
      return false;
    },
  });
}
export function createSafeDocument(extra) {
  const allowed = {
    createElement: document.createElement.bind(document),
    querySelector: document.querySelector.bind(document),
    querySelectorAll: document.querySelectorAll.bind(document),
    ...(extra || {}),
  };
  const target = Object.create(null);
  return new Proxy(target, {
    get(t, prop) {
      if (typeof prop !== 'string') {
        return Reflect.get(t, prop);
      }
      if (prop in allowed) return allowed[prop];
      if (Object.prototype.hasOwnProperty.call(t, prop)) return t[prop];
      if (isAllowedDynamicDocumentKey(prop)) {
        const v = document[prop];
        // Bind functions to the real document to avoid Illegal invocation
        if (typeof v === 'function') return v.bind(document);
        return v;
      }
      throw new Error(`Access to document property "${prop}" is not allowed.`);
    },
    set(t, prop, value) {
      if (typeof prop !== 'string') {
        Reflect.set(t, prop, value);
        return true;
      }
      if (prop in allowed) {
        throw new Error(`Mutation of document property "${prop}" is not allowed.`);
      }
      t[prop] = value;
      return true;
    },
    has(t, prop) {
      if (typeof prop !== 'string') return Reflect.has(t, prop);
      if (prop in allowed) return true;
      if (Object.prototype.hasOwnProperty.call(t, prop)) return true;
      if (isAllowedDynamicDocumentKey(prop)) return true;
      return false;
    },
  });
}
export function createSafeNavigator(extra) {
  const nav = (typeof window !== 'undefined' && window.navigator) || undefined;
  // 始终提供 clipboard 对象，避免可选链访问时抛错
  const clipboard = {};
  const writeText = nav?.clipboard?.writeText;
  if (typeof writeText === 'function') {
    clipboard.writeText = writeText.bind(nav.clipboard);
  }
  const allowed = {
    clipboard,
  };
  // 只读常用标识，避免泄露更多指纹信息
  Object.defineProperty(allowed, 'onLine', {
    get: () => !!nav?.onLine,
    enumerable: true,
    configurable: false,
  });
  Object.defineProperty(allowed, 'language', {
    get: () => nav?.language,
    enumerable: true,
    configurable: false,
  });
  Object.defineProperty(allowed, 'languages', {
    get: () => (nav?.languages ? [...nav.languages] : undefined),
    enumerable: true,
    configurable: false,
  });
  // 允许额外注入（例如自定义能力的受控暴露）
  Object.assign(allowed, extra || {});
  return new Proxy(
    {},
    {
      get(_t, prop) {
        if (prop in allowed) return allowed[prop];
        throw new Error(`Access to navigator property "${String(prop)}" is not allowed.`);
      },
    },
  );
}
/**
 * Create a safe globals object for RunJS execution.
 *
 * - Always tries to provide `navigator`
 * - Best-effort provides `window` and `document` in browser environments
 * - Never throws (so callers can decide how to handle missing globals)
 */
export function createSafeRunJSGlobals(extraGlobals) {
  const globals = {};
  try {
    const navigator = createSafeNavigator();
    globals.navigator = navigator;
    try {
      globals.window = createSafeWindow({ navigator });
    } catch {
      // ignore when window is not available (e.g. SSR/tests)
    }
  } catch {
    // ignore
  }
  try {
    globals.document = createSafeDocument();
  } catch {
    // ignore when document is not available (e.g. SSR/tests)
  }
  return extraGlobals ? { ...globals, ...extraGlobals } : globals;
}
/**
 * Execute RunJS with safe globals (window/document/navigator).
 *
 * Keeps `this` binding by calling `ctx.runjs(...)` instead of passing bare function references.
 */
export async function runjsWithSafeGlobals(ctx, code, options, extraGlobals) {
  if (!ctx || (typeof ctx !== 'object' && typeof ctx !== 'function')) return undefined;
  const runjs = ctx.runjs;
  if (typeof runjs !== 'function') return undefined;
  return ctx.runjs(code, createSafeRunJSGlobals(extraGlobals), options);
}
//# sourceMappingURL=safeGlobals.js.map
