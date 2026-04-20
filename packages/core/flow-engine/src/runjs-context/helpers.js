/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createRunJSDeprecationProxy } from '../flowContext';
import { JSRunner } from '../JSRunner';
import { RunJSContextRegistry, getModelClassName } from './registry';
function getLocale(ctx) {
  return ctx?.api?.auth?.locale || ctx?.i18n?.language || ctx?.locale;
}
export function getRunJSDocFor(ctx, { version = 'v1' } = {}) {
  const modelClass = getModelClassName(ctx);
  const ctor = RunJSContextRegistry.resolve(version, modelClass) || RunJSContextRegistry.resolve(version, '*');
  const locale = getLocale(ctx);
  if (ctor?.getDoc?.length) {
    // prefer getDoc(locale)
    return ctor.getDoc(locale) || {};
  }
  return ctor?.getDoc?.() || {};
}
export function createJSRunnerWithVersion(options) {
  const version = options?.version || 'v1';
  const modelClass = getModelClassName(this);
  const ensureFlowContext = (obj) => obj;
  const Ctor = RunJSContextRegistry.resolve(version, modelClass) || RunJSContextRegistry.resolve(version, '*');
  if (!Ctor) {
    throw new Error('[RunJS] No RunJSContext registered for version/model.');
  }
  const runCtx = new Ctor(ensureFlowContext(this));
  let doc = {};
  try {
    const locale = getLocale(this);
    if (Ctor?.getDoc?.length) doc = Ctor.getDoc(locale) || {};
    else doc = Ctor?.getDoc?.() || {};
  } catch (_) {
    doc = {};
  }
  const deprecatedCtx = createRunJSDeprecationProxy(runCtx, { doc });
  const globals = { ctx: deprecatedCtx, ...(options?.globals || {}) };
  // 对字段/区块类上下文，默认注入 window/document 以支持在沙箱中访问 DOM API
  if (modelClass === 'JSFieldModel' || modelClass === 'JSBlockModel') {
    if (typeof window !== 'undefined') globals.window = window;
    if (typeof document !== 'undefined') globals.document = document;
  }
  // 透传 JSRunnerOptions 其余配置（如 timeoutMs）
  const { timeoutMs } = options || {};
  return new JSRunner({ globals, timeoutMs });
}
export function getRunJSScenesForModel(modelClass, version = 'v1') {
  const meta = RunJSContextRegistry.getMeta(version, modelClass);
  return Array.isArray(meta?.scenes) ? [...meta.scenes] : [];
}
export function getRunJSScenesForContext(ctx, { version = 'v1' } = {}) {
  const modelClass = getModelClassName(ctx);
  return getRunJSScenesForModel(modelClass, version);
}
//# sourceMappingURL=helpers.js.map
