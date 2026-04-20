/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class BaseActionRegistry {
  actions = new Map();
  // 子类可覆盖：当动作被注册（含覆盖）时触发，可用于缓存失效等
  onActionRegistered() {}
  registerActions(defs) {
    for (const [, def] of Object.entries(defs || {})) {
      this.registerAction(def);
    }
  }
  registerAction(def) {
    if (!def?.name) throw new Error('Action must have a name.');
    if (this.actions.has(def.name)) {
      console.warn(`Action '${def.name}' is already registered. It will be overwritten.`);
    }
    this.actions.set(def.name, def);
    this.onActionRegistered();
  }
}
//# sourceMappingURL=BaseActionRegistry.js.map
