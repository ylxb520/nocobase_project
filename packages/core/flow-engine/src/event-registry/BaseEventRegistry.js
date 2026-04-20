/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class BaseEventRegistry {
  events = new Map();
  // 子类可覆盖：当事件被注册（含覆盖）时触发，可用于缓存失效等
  onEventRegistered() {}
  registerEvents(defs) {
    for (const [, def] of Object.entries(defs || {})) {
      this.registerEvent(def);
    }
  }
  registerEvent(def) {
    if (!def?.name) throw new Error('Event must have a name.');
    if (this.events.has(def.name)) {
      console.warn(`Event '${def.name}' is already registered. It will be overwritten.`);
    }
    this.events.set(def.name, def);
    this.onEventRegistered();
  }
}
//# sourceMappingURL=BaseEventRegistry.js.map
