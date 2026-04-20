/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class ConditionalRegistry {
    rules = [];
    defaultHandler;
    register(when, run, priority = 0) {
        this.rules.push({ when, run, priority });
        this.rules.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    }
    setDefault(run) {
        this.defaultHandler = run;
    }
    async run(ctx) {
        for (const rule of this.rules) {
            if (await rule.when(ctx)) {
                return await rule.run(ctx);
            }
        }
        if (this.defaultHandler) {
            return await this.defaultHandler(ctx);
        }
        throw new Error('No handler matched and no default handler defined');
    }
}
//# sourceMappingURL=condition-registry.js.map