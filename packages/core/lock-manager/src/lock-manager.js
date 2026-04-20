/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils';
import { Mutex, E_CANCELED } from 'async-mutex';
export class LockAbortError extends Error {
  constructor(message, options) {
    super(message, options);
  }
}
export class LockAcquireError extends Error {
  constructor(message, options) {
    super(message, options);
  }
}
class LocalLockAdapter {
  static locks = new Map();
  async connect() {}
  async close() {}
  getLock(key) {
    let lock = this.constructor.locks.get(key);
    if (!lock) {
      lock = new Mutex();
      this.constructor.locks.set(key, lock);
    }
    return lock;
  }
  async acquire(key, ttl) {
    const lock = this.getLock(key);
    const release = await lock.acquire();
    const timer = setTimeout(() => {
      if (lock.isLocked()) {
        release();
      }
    }, ttl);
    return () => {
      release();
      clearTimeout(timer);
    };
  }
  async runExclusive(key, fn, ttl) {
    const lock = this.getLock(key);
    let timer;
    try {
      timer = setTimeout(() => {
        if (lock.isLocked()) {
          lock.release();
        }
      }, ttl);
      return lock.runExclusive(fn);
    } catch (e) {
      if (e === E_CANCELED) {
        throw new LockAbortError('Lock aborted', { cause: E_CANCELED });
      } else {
        throw e;
      }
    } finally {
      clearTimeout(timer);
    }
  }
  async tryAcquire(key) {
    const lock = this.getLock(key);
    if (lock.isLocked()) {
      throw new LockAcquireError('lock is locked');
    }
    return {
      acquire: async (ttl) => {
        return this.acquire(key, ttl);
      },
      runExclusive: async (fn, ttl) => {
        return this.runExclusive(key, fn, ttl);
      },
    };
  }
}
export class LockManager {
  options;
  registry = new Registry();
  adapters = new Map();
  constructor(options = {}) {
    this.options = options;
    this.registry.register('local', {
      Adapter: LocalLockAdapter,
    });
  }
  registerAdapter(name, adapterConfig) {
    this.registry.register(name, adapterConfig);
  }
  async getAdapter() {
    const type = this.options.defaultAdapter || 'local';
    let client = this.adapters.get(type);
    if (!client) {
      const adapter = this.registry.get(type);
      if (!adapter) {
        throw new Error(`Lock adapter "${type}" not registered`);
      }
      const { Adapter, options } = adapter;
      client = new Adapter(options);
      await client.connect();
      this.adapters.set(type, client);
    }
    return client;
  }
  async close() {
    for (const client of this.adapters.values()) {
      await client.close();
    }
  }
  async acquire(key, ttl = 500) {
    const client = await this.getAdapter();
    return client.acquire(key, ttl);
  }
  async runExclusive(key, fn, ttl = 500) {
    const client = await this.getAdapter();
    return client.runExclusive(key, fn, ttl);
  }
  async tryAcquire(key) {
    const client = await this.getAdapter();
    return client.tryAcquire(key);
  }
}
export default LockManager;
//# sourceMappingURL=lock-manager.js.map
