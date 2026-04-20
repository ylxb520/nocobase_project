/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import jwt from 'jsonwebtoken';
export class JwtService {
  options;
  constructor(options) {
    this.options = options;
    const { secret, expiresIn } = options;
    this.options = {
      secret,
      expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '7d',
    };
  }
  blacklist;
  expiresIn() {
    return this.options.expiresIn;
  }
  secret() {
    return this.options.secret;
  }
  /* istanbul ignore next -- @preserve */
  sign(payload, options) {
    const opt = { expiresIn: this.expiresIn(), ...options };
    if (opt.expiresIn === 'never') {
      opt.expiresIn = '1000y';
    }
    return jwt.sign(payload, this.secret(), opt);
  }
  /* istanbul ignore next -- @preserve */
  decode(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret(), (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }
  /**
   * @description Block a token so that this token can no longer be used
   */
  async block(token) {
    if (!this.blacklist) {
      return null;
    }
    try {
      const { exp, jti } = await this.decode(token);
      return this.blacklist.add({
        token: jti ?? token,
        expiration: new Date(exp * 1000).toString(),
      });
    } catch {
      return null;
    }
  }
}
//# sourceMappingURL=jwt-service.js.map
