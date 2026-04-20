/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Migration } from '@nocobase/server';
import { adminProfileCreateFormSchema, adminProfileEditFormSchema, userProfileEditFormSchema, } from '../profile/edit-form-schema';
export default class extends Migration {
    on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
    async up() {
        const repo = this.db.getRepository('uiSchemas');
        const adminCreateSchema = await repo.findOne({
            filter: {
                'x-uid': 'nocobase-admin-profile-create-form',
            },
        });
        if (!adminCreateSchema) {
            await repo.insert(adminProfileCreateFormSchema);
        }
        const adminEditSchema = await repo.findOne({
            filter: {
                'x-uid': 'nocobase-admin-profile-edit-form',
            },
        });
        if (!adminEditSchema) {
            await repo.insert(adminProfileEditFormSchema);
        }
        const userSchema = await repo.findOne({
            filter: {
                'x-uid': 'nocobase-user-profile-edit-form',
            },
        });
        if (!userSchema) {
            await repo.insert(userProfileEditFormSchema);
        }
    }
}
//# sourceMappingURL=20241117112824-profile-schema.js.map