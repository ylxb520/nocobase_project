/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * @experimental
 */
export class LockCounter {
  cache;
  lockManager;
  constructor(cache, lockManager) {
    this.cache = cache;
    this.lockManager = lockManager;
  }
  async get(key) {
    return (await this.cache.get(key)) || 0;
  }
  async incr(key, ttl) {
    return this.incrby(key, 1, ttl);
  }
  async incrby(key, value, ttl) {
    const lockKey = `lock:${key}`;
    const release = await this.lockManager.acquire(lockKey, 3000);
    try {
      const v = await this.cache.get(key);
      const n = v || 0;
      const newValue = n + value;
      await this.cache.set(key, newValue, ttl);
      return newValue;
    } catch (error) {
      throw error;
    } finally {
      await release();
    }
  }
  async reset(key) {
    return this.cache.del(key);
  }
}
//# sourceMappingURL=lock-counter.js.map
