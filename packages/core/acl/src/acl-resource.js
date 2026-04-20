/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
export class ACLResource {
  actions = new Map();
  acl;
  role;
  name;
  constructor(options) {
    this.acl = options.role.acl;
    this.role = options.role;
    this.name = options.name;
    const actionsOption = options.actions || {};
    for (const actionName of Object.keys(actionsOption)) {
      this.actions.set(actionName, actionsOption[actionName]);
    }
  }
  getActions() {
    return Array.from(this.actions.keys()).reduce((carry, key) => {
      carry[key] = this.actions.get(key);
      return carry;
    }, {});
  }
  getAction(name) {
    const result = this.actions.get(name) || this.actions.get(this.acl.resolveActionAlias(name));
    if (!result) {
      return null;
    }
    if (Array.isArray(result.fields) && result.fields.length > 0) {
      result.fields = lodash.uniq(result.fields);
    }
    return lodash.cloneDeep(result);
  }
  setAction(name, params) {
    const context = {
      role: this.role,
      acl: this.role.acl,
      params: params || {},
      path: `${this.name}:${name}`,
      resourceName: this.name,
      actionName: name,
    };
    this.acl.emit('beforeGrantAction', context);
    this.actions.set(name, context.params);
  }
  setActions(actions) {
    for (const actionName of Object.keys(actions)) {
      this.setAction(actionName, actions[actionName]);
    }
  }
  removeAction(name) {
    this.actions.delete(name);
  }
}
//# sourceMappingURL=acl-resource.js.map
