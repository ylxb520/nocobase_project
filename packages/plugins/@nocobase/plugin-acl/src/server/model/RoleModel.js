/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Model } from '@nocobase/database';
export class RoleModel extends Model {
  writeToAcl(options) {
    const { acl } = options;
    const roleName = this.get('name');
    let role = acl.getRole(roleName);
    if (!role) {
      role = acl.define({
        role: roleName,
      });
    }
    if (options.withOutStrategy !== true) {
      role.setStrategy({
        ...(this.get('strategy') || {}),
        allowConfigure: this.get('allowConfigure'),
      });
    }
    role.snippets = new Set(this.get('snippets'));
  }
}
//# sourceMappingURL=RoleModel.js.map
