/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { vi } from 'vitest';
import { CacheManager } from '../cache-manager';
describe('cache-manager', () => {
  let cacheManager;
  beforeEach(() => {
    cacheManager = new CacheManager();
  });
  afterEach(() => {
    cacheManager = null;
  });
  it('create with default config', async () => {
    cacheManager.registerStore({ name: 'memory', store: 'memory' });
    const cache = await cacheManager.createCache({ name: 'test', store: 'memory' });
    expect(cache).toBeDefined();
    expect(cache.name).toBe('test');
    expect(cacheManager.caches.has('test')).toBeTruthy();
  });
  it('create with custom config', async () => {
    cacheManager.registerStore({ name: 'memory', store: 'memory' });
    const cache = await cacheManager.createCache({ name: 'test', store: 'memory', ttl: 100 });
    expect(cache).toBeDefined();
    expect(cache.name).toBe('test');
    expect(cacheManager.caches.has('test')).toBeTruthy();
  });
  it('should close store', async () => {
    const close = vi.fn();
    cacheManager.registerStore({
      name: 'memory',
      store: 'memory',
      close,
    });
    await cacheManager.createCache({ name: 'test', store: 'memory' });
    await cacheManager.close();
    expect(close).toBeCalled();
  });
});
//# sourceMappingURL=cache-manager.test.js.map
