/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
const script = `
local key = KEYS[1]
local value = tonumber(ARGV[1]) or 1
local ttl = tonumber(ARGV[2])
local current = redis.call('INCRBY', key, value)
if tonumber(current) == value and ttl then
  redis.call('PEXPIRE', key, ttl)
end
return current
`;
/**
 * @experimental
 */
export class RedisCounter {
  cache;
  scriptSha;
  constructor(cache) {
    this.cache = cache;
  }
  get store() {
    return this.cache.store.store;
  }
  async get(key) {
    return (await this.cache.get(key)) || 0;
  }
  async incr(key, ttl) {
    return this.incrby(key, 1, ttl);
  }
  async incrby(key, value, ttl) {
    if (!this.scriptSha) {
      this.scriptSha = await this.store.client.scriptLoad(script);
    }
    const result = await this.store.client.evalSha(this.scriptSha, {
      keys: [this.cache.key(key)],
      arguments: [value, ttl].map((v) => (v ? v.toString() : '')),
    });
    return Number(result);
  }
  async reset(key) {
    return this.cache.del(key);
  }
}
//# sourceMappingURL=redis-counter.js.map
