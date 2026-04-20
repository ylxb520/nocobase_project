/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BloomFilter } from 'bloom-filters';
/**
 * @experimental
 */
export class MemoryBloomFilter {
  cache;
  constructor(cache) {
    this.cache = cache;
  }
  async reserve(key, errorRate, capacity) {
    const filter = BloomFilter.create(capacity, errorRate);
    await this.cache.set(key, filter);
  }
  async add(key, value) {
    const filter = await this.cache.get(key);
    if (!filter) {
      return;
    }
    filter.add(value);
  }
  async mAdd(key, values) {
    const filter = await this.cache.get(key);
    if (!filter) {
      return;
    }
    values.forEach((value) => filter.add(value));
  }
  async exists(key, value) {
    const filter = await this.cache.get(key);
    if (!filter) {
      return false;
    }
    return filter.has(value);
  }
}
//# sourceMappingURL=memory-bloom-filter.js.map
