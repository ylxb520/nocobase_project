/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
// Since the memory store of cache-manager only offers a promise-based API,
// we use a simple memory cache with a synchronous API for the atomic counter.
// The implementation is based on https://github.com/isaacs/node-lru-cache?tab=readme-ov-file#storage-bounds-safety
class Cache {
  data = new Map();
  timers = new Map();
  set(k, v, ttl) {
    if (ttl) {
      if (this.timers.has(k)) {
        clearTimeout(this.timers.get(k));
      }
      this.timers.set(
        k,
        setTimeout(() => this.del(k), ttl),
      );
    }
    this.data.set(k, v);
  }
  get(k) {
    return this.data.get(k);
  }
  del(k) {
    if (this.timers.has(k)) {
      clearTimeout(this.timers.get(k));
    }
    this.timers.delete(k);
    return this.data.delete(k);
  }
}
/**
 * @experimental
 */
export class MemoryCounter {
  cache = new Cache();
  async get(key) {
    return this.cache.get(key) || 0;
  }
  async incr(key, ttl) {
    return this.incrby(key, 1, ttl);
  }
  async incrby(key, value, ttl) {
    const v = this.cache.get(key);
    const n = v || 0;
    const newValue = n + value;
    if (!v) {
      this.cache.set(key, newValue, ttl);
    } else {
      this.cache.set(key, newValue);
    }
    return newValue;
  }
  async reset(key) {
    this.cache.del(key);
  }
}
//# sourceMappingURL=memory-counter.js.map
