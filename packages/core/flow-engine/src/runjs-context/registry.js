/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class RunJSContextRegistry {
  static map = new Map();
  static register(version, modelClass, ctor, meta) {
    this.map.set(`${version}:${modelClass}`, { ctor, meta });
  }
  static resolve(version, modelClass) {
    return this.map.get(`${version}:${modelClass}`)?.ctor || this.map.get(`${version}:*`)?.ctor;
  }
  static getMeta(version, modelClass) {
    return this.map.get(`${version}:${modelClass}`)?.meta || this.map.get(`${version}:*`)?.meta;
  }
}
export function getModelClassName(ctx) {
  return ctx?.model?.constructor?.name || '*';
}
//# sourceMappingURL=registry.js.map
