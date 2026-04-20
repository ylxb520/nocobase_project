/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
export const predicate = {
  own: {
    filter: {
      createdById: '{{ ctx.state.currentUser.id }}',
    },
  },
  all: {},
};
export class ACLAvailableStrategy {
  acl;
  options;
  actionsAsObject;
  allowConfigure;
  constructor(acl, options) {
    this.acl = acl;
    this.options = options;
    this.allowConfigure = options.allowConfigure;
    let actions = this.options.actions;
    if (lodash.isString(actions) && actions != '*') {
      actions = [actions];
    }
    if (lodash.isArray(actions)) {
      this.actionsAsObject = actions.reduce((carry, action) => {
        const [actionName, predicate] = action.split(':');
        carry[actionName] = predicate;
        return carry;
      }, {});
    }
  }
  matchAction(actionName) {
    if (this.options.actions == '*') {
      return true;
    }
    if (Object.prototype.hasOwnProperty.call(this.actionsAsObject || {}, actionName)) {
      const predicateName = this.actionsAsObject[actionName];
      if (predicateName) {
        return lodash.cloneDeep(predicate[predicateName]);
      }
      return true;
    }
    return false;
  }
  allow(resourceName, actionName) {
    return this.matchAction(this.acl.resolveActionAlias(actionName));
  }
}
//# sourceMappingURL=acl-available-strategy.js.map
