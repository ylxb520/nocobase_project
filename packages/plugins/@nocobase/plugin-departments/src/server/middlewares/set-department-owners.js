/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
const setOwners = async (ctx, filterByTk, owners) => {
    const throughRepo = ctx.db.getRepository('departmentsUsers');
    await ctx.db.sequelize.transaction(async (t) => {
        await throughRepo.update({
            filter: {
                departmentId: filterByTk,
            },
            values: {
                isOwner: false,
            },
            transaction: t,
        });
        await throughRepo.update({
            filter: {
                departmentId: filterByTk,
                userId: {
                    $in: owners.map((owner) => owner.id),
                },
            },
            values: {
                isOwner: true,
            },
            transaction: t,
        });
    });
};
export const setDepartmentOwners = async (ctx, next) => {
    const { filterByTk, values = {}, resourceName, actionName } = ctx.action.params;
    const { owners } = values;
    if (resourceName === 'departments' && actionName === 'update' && owners) {
        ctx.action.params.values = lodash.omit(values, ['owners']);
        await next();
        await setOwners(ctx, filterByTk, owners);
    }
    else {
        return next();
    }
};
//# sourceMappingURL=set-department-owners.js.map