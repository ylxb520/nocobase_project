/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BaseEventRegistry } from './BaseEventRegistry';
export class ModelEventRegistry extends BaseEventRegistry {
  modelClass;
  parentRegistry;
  // 本类变更标记（变更即更新引用，用于缓存命中判断）
  changeMarker = {};
  // 合并缓存：父类合并快照引用 + 本类标记 + 合并后的 Map
  mergedCache;
  constructor(modelClass, parentRegistry) {
    super();
    this.modelClass = modelClass;
    this.parentRegistry = parentRegistry ?? null;
  }
  // 标记本类有变更（用于缓存命中判断）
  onEventRegistered() {
    this.changeMarker = {};
  }
  /**
   * 获取“包含继承”的合并事件（父 → 子），内部带缓存。
   */
  getEvents() {
    const parentMap = this.parentRegistry?.getEvents();
    if (
      this.mergedCache &&
      this.mergedCache.parentSnapshot === parentMap &&
      this.mergedCache.localMarker === this.changeMarker
    ) {
      return this.mergedCache.mergedMap;
    }
    const mergedMap = new Map(parentMap ?? []);
    for (const [k, v] of this.events) mergedMap.set(k, v);
    this.mergedCache = { parentSnapshot: parentMap, localMarker: this.changeMarker, mergedMap };
    return mergedMap;
  }
  /**
   * 解析指定名称的事件（优先本类，未命中递归父类）。
   */
  getEvent(name) {
    const own = this.events.get(name);
    if (own) return own;
    return this.parentRegistry?.getEvent(name);
  }
}
//# sourceMappingURL=ModelEventRegistry.js.map
