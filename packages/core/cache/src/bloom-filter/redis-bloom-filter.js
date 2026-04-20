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
export class RedisBloomFilter {
  cache;
  constructor(cache) {
    this.cache = cache;
  }
  get store() {
    return this.cache.store.store;
  }
  async reserve(key, errorRate, capacity) {
    try {
      await this.store.client.bf.reserve(key, errorRate, capacity);
    } catch (error) {
      if (error.message.includes('ERR item exists')) {
        return;
      }
      throw error;
    }
  }
  async add(key, value) {
    await this.store.client.bf.add(key, value);
  }
  async mAdd(key, values) {
    await this.store.client.bf.mAdd(key, values);
  }
  async exists(key, value) {
    return this.store.client.bf.exists(key, value);
  }
}
//# sourceMappingURL=redis-bloom-filter.js.map
