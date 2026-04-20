/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
const destroyCheck = async (ctx) => {
    const { filterByTk } = ctx.action.params;
    const repo = ctx.db.getRepository('departments');
    const children = await repo.count({
        filter: {
            parentId: filterByTk,
        },
    });
    if (children) {
        ctx.throw(400, ctx.t('The department has sub-departments, please delete them first', { ns: 'departments' }));
    }
    const members = await ctx.db.getRepository('departmentsUsers').count({
        filter: {
            departmentId: filterByTk,
        },
    });
    if (members) {
        ctx.throw(400, ctx.t('The department has members, please remove them first', { ns: 'departments' }));
    }
};
export const destroyDepartmentCheck = async (ctx, next) => {
    const { resourceName, actionName } = ctx.action.params;
    if (resourceName === 'departments' && actionName === 'destroy') {
        await destroyCheck(ctx);
    }
    await next();
};
//# sourceMappingURL=destroy-department-check.js.map