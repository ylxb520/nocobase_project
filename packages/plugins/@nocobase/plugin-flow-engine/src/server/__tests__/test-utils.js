/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { variables, inferSelectsFromUsage } from '../variables/registry';
/**
 * 重置变量注册表：
 * - 清空所有已注册的变量定义
 * - 恢复内置变量（当前仅内置 user）
 */
export function resetVariablesRegistryForTest() {
    const reg = variables;
    // 清空已注册变量
    if (reg && reg.vars && typeof reg.vars.clear === 'function') {
        reg.vars.clear();
    }
    // 恢复内置变量：user
    reg.register({
        name: 'user',
        scope: 'request',
        attach: (flowCtx, koaCtx, _params, usage) => {
            const paths = usage?.['user'] || [];
            const { generatedAppends, generatedFields } = inferSelectsFromUsage(paths);
            flowCtx.defineProperty('user', {
                get: async () => {
                    try {
                        const uid = koaCtx?.auth?.user?.id;
                        if (uid === undefined || uid === null)
                            return undefined;
                        const ds = koaCtx.app.dataSourceManager.get('main');
                        const cm = ds.collectionManager;
                        const repo = cm.db.getRepository('users');
                        const rec = await repo.findOne({
                            filterByTk: uid,
                            fields: generatedFields,
                            appends: generatedAppends,
                        });
                        return rec ? rec.toJSON?.() : undefined;
                    }
                    catch (_) {
                        return undefined;
                    }
                },
                cache: true,
            });
        },
    });
}
//# sourceMappingURL=test-utils.js.map