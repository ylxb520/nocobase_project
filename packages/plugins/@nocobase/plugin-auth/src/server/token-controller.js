/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AuthError, AuthErrorCode } from '@nocobase/auth';
import { randomUUID } from 'crypto';
import ms from 'ms';
import { Op } from '@nocobase/database';
import {
  issuedTokensCollectionName,
  tokenPolicyCollectionName,
  tokenPolicyRecordKey,
  RENEWED_JTI_CACHE_MS,
} from '../constants';
const JTICACHEKEY = 'token-jti';
export class TokenController {
  cache;
  app;
  db;
  logger;
  constructor({ cache, app, logger }) {
    this.cache = cache;
    this.app = app;
    this.logger = logger;
  }
  async setTokenInfo(id, value) {
    const repo = this.app.db.getRepository(issuedTokensCollectionName);
    await repo.updateOrCreate({ filterKeys: ['id'], values: value });
    return;
  }
  getConfig() {
    return this.cache.wrap('config', async () => {
      const repo = this.app.db.getRepository(tokenPolicyCollectionName);
      const configRecord = await repo.findOne({ filterByTk: tokenPolicyRecordKey });
      if (!configRecord) return null;
      const config = configRecord.config;
      return {
        tokenExpirationTime: ms(config.tokenExpirationTime),
        sessionExpirationTime: ms(config.sessionExpirationTime),
        expiredTokenRenewLimit: ms(config.expiredTokenRenewLimit),
      };
    });
  }
  setConfig(config) {
    return this.cache.set('config', {
      tokenExpirationTime: ms(config.tokenExpirationTime),
      sessionExpirationTime: ms(config.sessionExpirationTime),
      expiredTokenRenewLimit: ms(config.expiredTokenRenewLimit),
    });
  }
  async removeSessionExpiredTokens(userId) {
    const config = await this.getConfig();
    const model = this.app.db.getModel(issuedTokensCollectionName);
    const currTS = Date.now();
    return model.destroy({
      where: {
        userId,
        signInTime: {
          [Op.lt]: currTS - config.sessionExpirationTime,
        },
      },
    });
  }
  async add({ userId }) {
    const jti = randomUUID();
    const currTS = Date.now();
    const data = {
      jti,
      issuedTime: currTS,
      signInTime: currTS,
      renewed: false,
      userId,
    };
    await this.setTokenInfo(jti, data);
    try {
      if (process.env.DB_DIALECT === 'sqlite') {
        // SQLITE does not support concurrent operations
        await this.removeSessionExpiredTokens(userId);
      } else {
        this.removeSessionExpiredTokens(userId);
      }
    } catch (err) {
      this.logger.error(err, { module: 'auth', submodule: 'token-controller', method: 'removeSessionExpiredTokens' });
    }
    return data;
  }
  renew = async (jti) => {
    const repo = this.app.db.getRepository(issuedTokensCollectionName);
    const model = this.app.db.getModel(issuedTokensCollectionName);
    const newId = randomUUID();
    const issuedTime = Date.now();
    const [count] = await model.update({ jti: newId, issuedTime }, { where: { jti } });
    if (count === 1) {
      await this.cache.set(`jti-renewed-cahce:${jti}`, { jti: newId, issuedTime }, RENEWED_JTI_CACHE_MS);
      this.logger.info('jti renewed', { oldJti: jti, newJti: newId, issuedTime });
      return { jti: newId, issuedTime };
    } else {
      const cachedJtiData = await this.cache.get(`jti-renewed-cahce:${jti}`);
      if (cachedJtiData) {
        return cachedJtiData;
      }
      this.logger.error('jti renew failed', {
        module: 'auth',
        submodule: 'token-controller',
        method: 'renew',
        jti,
        code: AuthErrorCode.TOKEN_RENEW_FAILED,
      });
      throw new AuthError({
        message: 'Your session has expired. Please sign in again.',
        code: AuthErrorCode.TOKEN_RENEW_FAILED,
      });
    }
  };
}
//# sourceMappingURL=token-controller.js.map
