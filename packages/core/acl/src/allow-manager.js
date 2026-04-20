/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class AllowManager {
  acl;
  skipActions = new Map();
  registeredCondition = new Map();
  isPublicCondition = () => {
    return true;
  };
  constructor(acl) {
    this.acl = acl;
    this.registerAllowCondition('loggedIn', (ctx) => {
      return ctx.state.currentUser;
    });
    this.registerAllowCondition('public', this.isPublicCondition);
    this.registerAllowCondition('allowConfigure', async (ctx) => {
      const roleName = ctx.state.currentRole;
      if (!roleName) {
        return false;
      }
      const role = acl.getRole(roleName);
      if (!role) {
        return false;
      }
      return role.getStrategy()?.allowConfigure;
    });
  }
  allow(resourceName, actionName, condition) {
    const actionMap = this.skipActions.get(resourceName) || new Map();
    actionMap.set(actionName, condition || true);
    this.skipActions.set(resourceName, actionMap);
  }
  getAllowedConditions(resourceName, actionName) {
    const fetchActionSteps = ['*', resourceName];
    const results = [];
    for (const fetchActionStep of fetchActionSteps) {
      const resource = this.skipActions.get(fetchActionStep);
      if (resource) {
        for (const fetchActionStep of ['*', actionName]) {
          const condition = resource.get(fetchActionStep);
          if (condition) {
            results.push(typeof condition === 'string' ? this.registeredCondition.get(condition) : condition);
          }
        }
      }
    }
    return results;
  }
  registerAllowCondition(name, condition) {
    this.registeredCondition.set(name, condition);
  }
  async isPublic(resourceName, actionName, ctx) {
    const skippedConditions = this.getAllowedConditions(resourceName, actionName);
    for (const skippedCondition of skippedConditions) {
      if (skippedCondition === this.isPublicCondition) {
        return true;
      }
    }
    return false;
  }
  async isAllowed(resourceName, actionName, ctx) {
    const skippedConditions = this.getAllowedConditions(resourceName, actionName);
    for (const skippedCondition of skippedConditions) {
      if (skippedCondition) {
        let skipResult = false;
        if (typeof skippedCondition === 'function') {
          skipResult = await skippedCondition(ctx);
        } else if (skippedCondition) {
          skipResult = true;
        }
        if (skipResult) {
          return true;
        }
      }
    }
    return false;
  }
  aclMiddleware() {
    return async (ctx, next) => {
      const { resourceName, actionName } = ctx.action;
      const skip = await this.acl.allowManager.isAllowed(resourceName, actionName, ctx);
      if (skip) {
        ctx.permission = {
          ...(ctx.permission || {}),
          skip: true,
        };
      }
      await next();
    };
  }
}
//# sourceMappingURL=allow-manager.js.map
