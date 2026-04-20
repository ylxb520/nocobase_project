/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { namespace } from '../../preset';
export default {
  lostPassword: async (ctx, next) => {
    ctx.body = await ctx.auth.lostPassword();
    await next();
  },
  resetPassword: async (ctx, next) => {
    ctx.body = await ctx.auth.resetPassword();
    await next();
  },
  checkResetToken: async (ctx, next) => {
    const { resetToken } = ctx.action.params.values;
    ctx.body = await ctx.auth.checkResetToken(resetToken);
    await next();
  },
  changePassword: async (ctx, next) => {
    const systemSettings = ctx.db.getRepository('systemSettings');
    const settings = await systemSettings.findOne();
    const enableChangePassword = settings.get('enableChangePassword');
    if (enableChangePassword === false) {
      ctx.throw(403, ctx.t('Password is not allowed to be changed', { ns: namespace }));
    }
    const {
      values: { oldPassword, newPassword, confirmPassword },
    } = ctx.action.params;
    if (newPassword !== confirmPassword) {
      ctx.throw(400, ctx.t('The password is inconsistent, please re-enter', { ns: namespace }));
    }
    const currentUser = ctx.auth.user;
    if (!currentUser) {
      ctx.throw(401);
    }
    let key;
    if (currentUser.username) {
      key = 'username';
    } else {
      key = 'email';
    }
    const UserRepo = ctx.db.getRepository('users');
    const user = await UserRepo.findOne({
      where: {
        [key]: currentUser[key],
      },
    });
    const pwd = ctx.db.getCollection('users').getField('password');
    const isValid = await pwd.verify(oldPassword, user.password);
    if (!isValid) {
      ctx.throw(401, ctx.t('The password is incorrect, please re-enter', { ns: namespace }));
    }
    await UserRepo.update({
      filterByTk: user.id,
      values: {
        password: newPassword,
      },
    });
    ctx.body = currentUser;
    await next();
  },
};
//# sourceMappingURL=auth.js.map
