/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BaseAuth } from '@nocobase/auth';
import { namespace } from '../constants';
export class SMSAuth extends BaseAuth {
  constructor(config) {
    const { ctx } = config;
    super({
      ...config,
      userCollection: ctx.db.getCollection('users'),
    });
  }
  async validate() {
    const ctx = this.ctx;
    const verificationPlugin = ctx.app.getPlugin('verification');
    if (!verificationPlugin) {
      ctx.log.error('auth-sms: @nocobase/plugin-verification is required', { method: 'validate' });
      ctx.throw(500);
    }
    let user;
    ctx.action.mergeParams({
      values: {
        verifier: this.options.public?.verifier,
      },
    });
    await verificationPlugin.verificationManager.verify(ctx, async () => {
      const {
        values: { uuid: phone },
      } = ctx.action.params;
      try {
        // History data compatible processing
        user = await this.userRepository.findOne({
          filter: { phone },
        });
        if (user) {
          await this.authenticator.addUser(user, {
            through: {
              uuid: phone,
            },
          });
          return;
        }
        // New data
        const { autoSignup } = this.authenticator.options?.public || {};
        const authenticator = this.authenticator;
        if (autoSignup) {
          user = await authenticator.findOrCreateUser(phone, {
            nickname: phone,
            phone,
          });
          return;
        }
        user = await authenticator.findUser(phone);
        if (!user) {
          throw new Error(ctx.t('The phone number is not registered, please register first', { ns: namespace }));
        }
      } catch (err) {
        ctx.log.error(err, { method: 'validate' });
        throw new Error(err.message);
      }
    });
    return user;
  }
}
//# sourceMappingURL=sms-auth.js.map
