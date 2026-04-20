/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Model } from '@nocobase/database';
export class DataSourcesRolesModel extends Model {
  async writeToAcl(options) {
    const { acl, transaction } = options;
    const roleName = this.get('roleName');
    let role = acl.getRole(roleName);
    if (!role) {
      role = acl.define({
        role: roleName,
      });
    }
    role.setStrategy({
      ...(this.get('strategy') || {}),
    });
    const resources = await this.db.getRepository('dataSourcesRolesResources').find({
      filter: {
        roleName,
        dataSourceKey: this.get('dataSourceKey'),
      },
      transaction,
    });
    for (const resource of resources) {
      await resource.writeToACL({
        acl,
        transaction,
      });
    }
  }
}
//# sourceMappingURL=data-sources-roles-model.js.map
