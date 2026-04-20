/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class Cache {
  name;
  prefix;
  store;
  constructor({ name, prefix, store }) {
    this.name = name;
    this.prefix = prefix;
    this.store = store;
  }
  key(key) {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }
  async set(key, value, ttl) {
    await this.store.set(this.key(key), value, ttl);
  }
  async get(key) {
    return await this.store.get(this.key(key));
  }
  async del(key) {
    await this.store.del(this.key(key));
  }
  async reset() {
    await this.store.reset();
  }
  async wrap(key, fn, ttl) {
    return await this.store.wrap(this.key(key), fn, ttl);
  }
  async wrapWithCondition(key, fn, options) {
    const { useCache, isCacheable, ttl } = options || {};
    if (useCache === false) {
      return await fn();
    }
    const value = await this.get(key);
    if (value) {
      return value;
    }
    const result = await fn();
    const cacheable = isCacheable ? await isCacheable(result) : result;
    if (!cacheable) {
      return result;
    }
    await this.set(key, result, ttl);
    return result;
  }
  async mset(args, ttl) {
    await this.store.store.mset(
      args.map(([key, value]) => [this.key(key), value]),
      ttl,
    );
  }
  async mget(...args) {
    args = args.map((key) => this.key(key));
    return await this.store.store.mget(...args);
  }
  async mdel(...args) {
    args = args.map((key) => this.key(key));
    await this.store.store.mdel(...args);
  }
  async keys(pattern) {
    const keys = await this.store.store.keys(pattern);
    return keys.map((key) => key.replace(`${this.name}:`, ''));
  }
  async ttl(key) {
    return await this.store.store.ttl(this.key(key));
  }
  async setValueInObject(key, objectKey, value) {
    const object = (await this.get(key)) || {};
    object[objectKey] = value;
    await this.set(key, object);
  }
  async getValueInObject(key, objectKey) {
    const object = (await this.get(key)) || {};
    return object[objectKey];
  }
  async delValueInObject(key, objectKey) {
    const object = (await this.get(key)) || {};
    delete object[objectKey];
    await this.set(key, object);
  }
}
//# sourceMappingURL=cache.js.map
