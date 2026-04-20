/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export const setDepartmentsInfo = async (ctx, next) => {
    const currentUser = ctx.state.currentUser;
    if (!currentUser) {
        return next();
    }
    const cache = ctx.cache;
    const repo = ctx.db.getRepository('users.departments', currentUser.id);
    const departments = (await cache.wrap(`departments:${currentUser.id}`, () => repo.find({
        appends: ['owners', 'roles', 'parent(recursively=true)'],
        raw: true,
    })));
    if (!departments.length) {
        return next();
    }
    ctx.state.currentUser.departments = departments;
    // Use mainDepartmentId instead of isMain
    ctx.state.currentUser.mainDeparmtent = departments.find((dept) => dept.id === currentUser.mainDepartmentId);
    const departmentIds = departments.map((dept) => dept.id);
    const roleRepo = ctx.db.getRepository('roles');
    const roles = await roleRepo.find({
        filter: {
            'departments.id': {
                $in: departmentIds,
            },
        },
    });
    if (!roles.length) {
        return next();
    }
    const rolesMap = new Map();
    roles.forEach((role) => rolesMap.set(role.name, role));
    ctx.state.attachRoles = Array.from(rolesMap.values());
    await next();
};
//# sourceMappingURL=set-departments-roles.js.map