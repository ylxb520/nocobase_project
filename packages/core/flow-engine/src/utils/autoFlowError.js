/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
const map = new WeakMap();
export function setAutoFlowError(model, err) {
  map.set(model, err ?? null);
}
export function getAutoFlowError(model) {
  return map.get(model) ?? null;
}
export function clearAutoFlowError(model) {
  map.delete(model);
}
//# sourceMappingURL=autoFlowError.js.map
