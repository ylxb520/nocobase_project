/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { caching } from 'cache-manager';
import { Cache } from './cache';
import lodash from 'lodash';
import { redisStore } from 'cache-manager-redis-yet';
import deepmerge from 'deepmerge';
import { MemoryBloomFilter } from './bloom-filter/memory-bloom-filter';
import { RedisBloomFilter } from './bloom-filter/redis-bloom-filter';
import { MemoryCounter, RedisCounter, LockCounter } from './counter';
export class CacheManager {
  defaultStore;
  prefix;
  stores = new Map();
  /**
   * @internal
   */
  storeTypes = new Map();
  /**
   * @internal
   */
  caches = new Map();
  constructor(options) {
    const defaultOptions = {
      defaultStore: 'memory',
      stores: {
        memory: {
          store: 'memory',
          // global config
          max: 2000,
        },
        redis: {
          store: redisStore,
          close: async (redis) => {
            if (!redis.client?.isOpen) {
              return;
            }
            await redis.client.quit();
          },
        },
      },
    };
    const cacheOptions = deepmerge(defaultOptions, options || {});
    const { defaultStore = 'memory', stores, prefix } = cacheOptions;
    this.defaultStore = defaultStore;
    this.prefix = prefix;
    for (const [name, store] of Object.entries(stores)) {
      const { store: s, ...globalConfig } = store;
      this.registerStore({ name, store: s, ...globalConfig });
    }
  }
  async createStore(options) {
    const { name, storeType: type, ...config } = options;
    const storeType = this.storeTypes.get(type);
    if (!storeType) {
      throw new Error(`Create cache failed, store type [${type}] is unavailable or not registered`);
    }
    const { store: s, close, ...globalConfig } = storeType;
    const store = await caching(s, { ...globalConfig, ...config });
    this.stores.set(name, { close, store });
    return store;
  }
  registerStore(options) {
    const { name, ...rest } = options;
    this.storeTypes.set(name, rest);
  }
  newCache(options) {
    const { name, prefix, store } = options;
    const cache = new Cache({ name, prefix, store });
    this.caches.set(name, cache);
    return cache;
  }
  async createCache(options) {
    const { name, store = this.defaultStore, ...config } = options;
    let { prefix } = options;
    prefix = this.prefix ? (prefix ? `${this.prefix}:${prefix}` : this.prefix) : prefix;
    if (!lodash.isEmpty(config) || store === 'memory') {
      const newStore = await this.createStore({ name, storeType: store, ...config });
      return this.newCache({ name, prefix, store: newStore });
    }
    const s = this.stores.get(store);
    if (!s) {
      const defaultStore = await this.createStore({ name: store, storeType: store });
      return this.newCache({ name, prefix, store: defaultStore });
    }
    return this.newCache({ name, prefix, store: s.store });
  }
  getCache(name) {
    const cache = this.caches.get(name);
    if (!cache) {
      throw new Error(`Get cache failed, ${name} is not found`);
    }
    return cache;
  }
  async flushAll() {
    const promises = [];
    for (const cache of this.caches.values()) {
      promises.push(cache.reset());
    }
    await Promise.all(promises);
  }
  async close() {
    const promises = [];
    for (const s of this.stores.values()) {
      const { close, store } = s;
      close && promises.push(close(store.store));
    }
    await Promise.all(promises);
  }
  /**
   * @experimental
   */
  async createBloomFilter(options) {
    const name = 'bloom-filter';
    const { store = this.defaultStore, ...opts } = options || {};
    let cache;
    try {
      cache = this.getCache(name);
    } catch (error) {
      cache = await this.createCache({ name, store, ...opts });
    }
    switch (store) {
      case 'memory':
        return new MemoryBloomFilter(cache);
      case 'redis':
        return new RedisBloomFilter(cache);
      default:
        throw new Error(`BloomFilter store [${store}] is not supported`);
    }
  }
  /**
   * @experimental
   */
  async createCounter(options, lockManager) {
    const { store = this.defaultStore, name, prefix } = options || {};
    let cache;
    if (store !== 'memory') {
      try {
        cache = this.getCache(name);
      } catch (error) {
        cache = await this.createCache({ name, store, prefix });
      }
    }
    switch (store) {
      case 'memory':
        return new MemoryCounter();
      case 'redis':
        return new RedisCounter(cache);
      default:
        if (!lockManager) {
          throw new Error(`Counter store [${store}] is not supported`);
        }
        return new LockCounter(cache, lockManager);
    }
  }
}
//# sourceMappingURL=cache-manager.js.map
