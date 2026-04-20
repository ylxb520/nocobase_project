/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Auth, AuthManager } from '@nocobase/auth';
class MockStorer {
  elements = new Map();
  async set(name, value) {
    this.elements.set(name, value);
  }
  async get(name) {
    return this.elements.get(name);
  }
}
class BasicAuth extends Auth {
  user;
  async check() {
    return null;
  }
  async getIdentity() {
    return null;
  }
}
describe('auth-manager', () => {
  let authManager;
  let storer;
  beforeEach(() => {
    authManager = new AuthManager({
      authKey: 'X-Authenticator',
    });
    storer = new MockStorer();
    const authenticator = {
      name: 'basic-test',
      authType: 'basic',
      options: {},
    };
    storer.set(authenticator.name, authenticator);
    authManager.setStorer(storer);
  });
  it('should get authenticator', async () => {
    authManager.registerTypes('basic', { auth: BasicAuth });
    const authenticator = await authManager.get('basic-test', {});
    expect(authenticator).toBeInstanceOf(BasicAuth);
    storer.set('basic2-test', { name: 'basic2-test', authType: 'basic2', options: {} });
    expect(authManager.get('basic2-test', {})).rejects.toThrowError('AuthType [basic2] is not found.');
    await expect(authManager.get('not-exists', {})).rejects.toThrowError('Authenticator [not-exists] is not found.');
    authManager.setStorer(null);
    await expect(authManager.get('any', {})).rejects.toThrowError('AuthManager.storer is not set.');
  });
  it('should list types', () => {
    authManager.registerTypes('basic', { auth: BasicAuth, title: 'Basic' });
    expect(authManager.listTypes()).toEqual([{ name: 'basic', title: 'Basic' }]);
  });
  it('should get auth config', () => {
    authManager.registerTypes('basic', { auth: BasicAuth, title: 'Basic' });
    expect(authManager.getAuthConfig('basic')).toEqual({ auth: BasicAuth, title: 'Basic' });
  });
});
//# sourceMappingURL=auth-manager.test.js.map
