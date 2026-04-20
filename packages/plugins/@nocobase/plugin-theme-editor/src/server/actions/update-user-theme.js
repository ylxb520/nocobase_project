/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export async function updateTheme(ctx, next) {
    const { themeId } = ctx.action.params.values || {};
    const { currentUser } = ctx.state;
    if (!currentUser) {
        ctx.throw(401);
    }
    const userRepo = ctx.db.getRepository('users');
    const user = await userRepo.findOne({ filter: { id: currentUser.id } });
    await userRepo.update({
        filterByTk: currentUser.id,
        values: {
            systemSettings: {
                ...user.systemSettings,
                themeId,
            },
        },
    });
    await next();
}
//# sourceMappingURL=update-user-theme.js.map