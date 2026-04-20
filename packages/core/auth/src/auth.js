/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export const AuthErrorCode = {
  EMPTY_TOKEN: 'EMPTY_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_RENEW_FAILED: 'TOKEN_RENEW_FAILED',
  BLOCKED_TOKEN: 'BLOCKED_TOKEN',
  EXPIRED_SESSION: 'EXPIRED_SESSION',
  NOT_EXIST_USER: 'NOT_EXIST_USER',
  SKIP_TOKEN_RENEW: 'SKIP_TOKEN_RENEW',
};
export class AuthError extends Error {
  code;
  constructor(options) {
    super(options.message);
    this.code = options.code;
  }
}
export class Auth {
  /**
   * options keys that are not allowed to use environment variables
   */
  static optionsKeysNotAllowedInEnv;
  authenticator;
  options;
  ctx;
  constructor(config) {
    const { authenticator, options, ctx } = config;
    this.authenticator = authenticator;
    this.options = options;
    this.ctx = ctx;
  }
  async skipCheck() {
    if (this.ctx.skipAuthCheck === true) {
      return true;
    }
    const token = this.ctx.getBearerToken();
    if (!token && this.ctx.app.options.acl === false) {
      return true;
    }
    const { resourceName, actionName } = this.ctx.action;
    const acl = this.ctx.dataSource.acl;
    const isPublic = await acl.allowManager.isPublic(resourceName, actionName, this.ctx);
    return isPublic;
  }
  // The following methods are mainly designed for user authentications.
  async signIn() {}
  async signUp() {}
  async signOut() {}
}
//# sourceMappingURL=auth.js.map
