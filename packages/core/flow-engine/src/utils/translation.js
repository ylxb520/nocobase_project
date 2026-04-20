/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FLOW_ENGINE_NAMESPACE } from './constants';
/**
 * 获取带有 flow-engine 命名空间的翻译函数
 * @param model FlowModel 实例
 * @returns 翻译函数，自动使用 flow-engine 命名空间
 */
export function getT(model) {
  if (model.flowEngine?.translate) {
    return (key, options) => {
      // 自动添加 flow-engine 命名空间
      return model.flowEngine.translate(key, { ns: [FLOW_ENGINE_NAMESPACE, 'client'], nsMode: 'fallback', ...options });
    };
  }
  // 回退到原始键值
  return (key) => key;
}
export function tExpr(text, options) {
  if (options) {
    return `{{t(${JSON.stringify(text)}, ${JSON.stringify(options)})}}`;
  }
  return `{{t(${JSON.stringify(text)})}}`;
}
/**
 * @deprecated use tExpr from `@nocobase/flow-engine` instead
 */
export function escapeT(text, options) {
  return tExpr(text, options);
}
//# sourceMappingURL=translation.js.map
