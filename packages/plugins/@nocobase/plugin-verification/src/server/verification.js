/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class Verification {
    verifier;
    ctx;
    options;
    constructor({ ctx, verifier, options }) {
        this.ctx = ctx;
        this.verifier = verifier;
        this.options = options;
    }
    get throughRepo() {
        return this.ctx.db.getRepository('usersVerifiers');
    }
    async onActionComplete(options) { }
    async bind(userId, resource, action) {
        throw new Error('Not implemented');
    }
    async getBoundInfo(userId) {
        return this.throughRepo.findOne({
            filter: {
                verifier: this.verifier.name,
                userId,
            },
        });
    }
    async getPublicBoundInfo(userId) {
        const boundInfo = await this.getBoundInfo(userId);
        return {
            bound: boundInfo ? true : false,
        };
    }
    async validateBoundInfo(boundInfo) {
        return true;
    }
}
//# sourceMappingURL=verification.js.map