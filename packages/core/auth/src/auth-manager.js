/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils';
import { JwtService } from './base/jwt-service';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
export class AuthManager {
  /**
   * @internal
   */
  jwt;
  tokenController;
  options;
  authTypes = new Registry();
  // authenticators collection manager.
  storer;
  constructor(options) {
    this.options = options;
    const jwtOptions = options.jwt || {};
    if (!jwtOptions.secret) {
      jwtOptions.secret = this.getDefaultJWTSecret();
    }
    this.jwt = new JwtService(jwtOptions);
  }
  setStorer(storer) {
    this.storer = storer;
  }
  setTokenBlacklistService(service) {
    this.jwt.blacklist = service;
  }
  setTokenControlService(service) {
    this.tokenController = service;
  }
  /**
   * registerTypes
   * @description Add a new authenticate type and the corresponding authenticator.
   * The types will show in the authenticators list of the admin panel.
   *
   * @param authType - The type of the authenticator. It is required to be unique.
   * @param authConfig - Configurations of the kind of authenticator.
   */
  registerTypes(authType, authConfig) {
    this.authTypes.register(authType, authConfig);
  }
  listTypes() {
    return Array.from(this.authTypes.getEntities()).map(([authType, authConfig]) => ({
      name: authType,
      title: authConfig.title,
    }));
  }
  getAuthConfig(authType) {
    return this.authTypes.get(authType);
  }
  /**
   * get
   * @description Get authenticator instance by name.
   * @param name - The name of the authenticator.
   * @return authenticator instance.
   */
  async get(name, ctx) {
    if (!this.storer) {
      throw new Error('AuthManager.storer is not set.');
    }
    const authenticator = await this.storer.get(name);
    if (!authenticator) {
      throw new Error(`Authenticator [${name}] is not found.`);
    }
    const { auth } = this.authTypes.get(authenticator.authType) || {};
    if (!auth) {
      throw new Error(`AuthType [${authenticator.authType}] is not found.`);
    }
    return new auth({ authenticator, options: authenticator.options, ctx });
  }
  /**
   * middleware
   * @description Auth middleware, used to check the user status.
   */
  middleware() {
    const self = this;
    return async function AuthManagerMiddleware(ctx, next) {
      const name = ctx.get(self.options.authKey) || self.options.default;
      let authenticator;
      try {
        authenticator = await ctx.app.authManager.get(name, ctx);
        ctx.auth = authenticator;
      } catch (err) {
        ctx.auth = {};
        ctx.logger.warn(err.message, { method: 'check', authenticator: name });
        return next();
      }
      if (!authenticator) {
        return next();
      }
      if (await ctx.auth.skipCheck()) {
        return next();
      }
      const user = await ctx.auth.check();
      if (user) {
        ctx.auth.user = user;
      }
      await next();
    };
  }
  getDefaultJWTSecret() {
    if (process.env.UNSAFE_USE_DEFAULT_JWT_SECRET === 'true') {
      return process.env.APP_KEY;
    }
    const jwtSecretPath = path.resolve(process.cwd(), 'storage', 'apps', 'main', 'jwt_secret.dat');
    const jwtSecretExists = fs.existsSync(jwtSecretPath);
    if (jwtSecretExists) {
      const key = fs.readFileSync(jwtSecretPath);
      if (key.length !== 32) {
        throw new Error('Invalid api key length in file');
      }
      return key;
    }
    const envKey = process.env.APP_KEY;
    if (envKey && envKey !== 'your-secret-key' && envKey !== 'test-key') {
      return envKey;
    }
    const key = crypto.randomBytes(32);
    fs.mkdirSync(path.dirname(jwtSecretPath), { recursive: true });
    fs.writeFileSync(jwtSecretPath, key, { mode: 0o600 });
    return key;
  }
}
//# sourceMappingURL=auth-manager.js.map
