/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { assign, parseFilter, Toposort } from '@nocobase/utils';
import EventEmitter from 'events';
import compose from 'koa-compose';
import lodash from 'lodash';
import { ACLAvailableAction } from './acl-available-action';
import { ACLAvailableStrategy, predicate } from './acl-available-strategy';
import { ACLRole } from './acl-role';
import { AllowManager } from './allow-manager';
import { NoPermissionError } from './errors/no-permission-error';
import FixedParamsManager from './fixed-params-manager';
import SnippetManager from './snippet-manager';
import { mergeAclActionParams, removeEmptyParams } from './utils';
export class ACL extends EventEmitter {
  /**
   * @internal
   */
  availableStrategy = new Map();
  /**
   * @internal
   */
  allowManager = new AllowManager(this);
  /**
   * @internal
   */
  snippetManager = new SnippetManager();
  /**
   * @internal
   */
  roles = new Map();
  /**
   * @internal
   */
  actionAlias = new Map();
  availableActions = new Map();
  fixedParamsManager = new FixedParamsManager();
  middlewares;
  strategyResources = null;
  constructor() {
    super();
    this.middlewares = new Toposort();
    this.beforeGrantAction((ctx) => {
      if (lodash.isPlainObject(ctx.params) && ctx.params.own) {
        ctx.params = lodash.merge(ctx.params, predicate.own);
      }
    });
    this.beforeGrantAction((ctx) => {
      const actionName = this.resolveActionAlias(ctx.actionName);
      if (lodash.isPlainObject(ctx.params)) {
        if ((actionName === 'create' || actionName === 'update') && ctx.params.fields) {
          ctx.params = {
            ...lodash.omit(ctx.params, 'fields'),
            whitelist: ctx.params.fields,
          };
        }
      }
    });
    this.use(this.allowManager.aclMiddleware(), {
      tag: 'allow-manager',
      before: 'core',
    });
    this.addCoreMiddleware();
  }
  setStrategyResources(resources) {
    this.strategyResources = new Set(resources);
  }
  getStrategyResources() {
    return this.strategyResources ? [...this.strategyResources] : null;
  }
  appendStrategyResource(resource) {
    if (!this.strategyResources) {
      this.strategyResources = new Set();
    }
    this.strategyResources.add(resource);
  }
  removeStrategyResource(resource) {
    this.strategyResources.delete(resource);
  }
  define(options) {
    const roleName = options.role;
    const role = new ACLRole(this, roleName);
    if (options.strategy) {
      role.strategy = options.strategy;
    }
    const actions = options.actions || {};
    for (const [actionName, actionParams] of Object.entries(actions)) {
      role.grantAction(actionName, actionParams);
    }
    this.roles.set(roleName, role);
    return role;
  }
  getRole(name) {
    return this.roles.get(name);
  }
  getRoles(names) {
    return names.map((name) => this.getRole(name)).filter((x) => Boolean(x));
  }
  removeRole(name) {
    return this.roles.delete(name);
  }
  setAvailableAction(name, options = {}) {
    this.availableActions.set(name, new ACLAvailableAction(name, options));
    if (options.aliases) {
      const aliases = lodash.isArray(options.aliases) ? options.aliases : [options.aliases];
      for (const alias of aliases) {
        this.actionAlias.set(alias, name);
      }
    }
  }
  getAvailableAction(name) {
    const actionName = this.actionAlias.get(name) || name;
    return this.availableActions.get(actionName);
  }
  getAvailableActions() {
    return this.availableActions;
  }
  setAvailableStrategy(name, options) {
    this.availableStrategy.set(name, new ACLAvailableStrategy(this, options));
  }
  beforeGrantAction(listener) {
    this.addListener('beforeGrantAction', listener);
  }
  can(options) {
    if (options.role) {
      return lodash.cloneDeep(this.getCanByRole(options));
    }
    if (options.roles?.length) {
      if (options.roles.includes('root')) {
        options.roles = ['root'];
      }
      return lodash.cloneDeep(this.getCanByRoles(options));
    }
    return null;
  }
  getCanByRoles(options) {
    let canResult = null;
    for (const role of options.roles) {
      const result = this.getCanByRole({
        role,
        ...options,
      });
      if (!canResult) {
        canResult = result;
        canResult && removeEmptyParams(canResult.params);
      } else if (canResult && result) {
        canResult.params = mergeAclActionParams(canResult.params, result.params);
      }
    }
    return canResult;
  }
  getCanByRole(options) {
    const { role, resource, action, rawResourceName } = options;
    const aclRole = this.roles.get(role);
    if (!aclRole) {
      return null;
    }
    if (role === 'root') {
      return {
        resource,
        action,
        role,
      };
    }
    const actionPath = `${rawResourceName ? rawResourceName : resource}:${action}`;
    const snippetAllowed = aclRole.snippetAllowed(actionPath);
    const fixedParams = this.fixedParamsManager.getParams(rawResourceName ? rawResourceName : resource, action);
    const mergeParams = (result) => {
      const params = result['params'] || {};
      const mergedParams = assign(params, fixedParams);
      if (Object.keys(mergedParams).length) {
        result['params'] = mergedParams;
      } else {
        delete result['params'];
      }
      return result;
    };
    const aclResource = aclRole.getResource(resource);
    if (aclResource) {
      const actionParams = aclResource.getAction(action);
      if (actionParams) {
        // handle single action config
        return mergeParams({
          role,
          resource,
          action,
          params: actionParams,
        });
      } else {
        return null;
      }
    }
    const roleStrategy = aclRole.getStrategy();
    if (!roleStrategy && !snippetAllowed) {
      return null;
    }
    let roleStrategyParams;
    if (this.strategyResources === null || this.strategyResources.has(resource)) {
      roleStrategyParams = roleStrategy?.allow(resource, this.resolveActionAlias(action));
    }
    if (!roleStrategyParams && snippetAllowed) {
      roleStrategyParams = {};
    }
    if (roleStrategyParams) {
      const result = { role, resource, action, params: {} };
      if (lodash.isPlainObject(roleStrategyParams)) {
        result['params'] = roleStrategyParams;
      }
      return mergeParams(result);
    }
    return null;
  }
  /**
   * @internal
   */
  resolveActionAlias(action) {
    return this.actionAlias.get(action) ? this.actionAlias.get(action) : action;
  }
  use(fn, options) {
    this.middlewares.add(fn, {
      group: 'prep',
      ...options,
    });
  }
  allow(resourceName, actionNames, condition) {
    return this.skip(resourceName, actionNames, condition);
  }
  /**
   * @deprecated
   */
  skip(resourceName, actionNames, condition) {
    if (!condition) {
      condition = 'public';
    }
    if (!Array.isArray(actionNames)) {
      actionNames = [actionNames];
    }
    for (const actionName of actionNames) {
      this.allowManager.allow(resourceName, actionName, condition);
    }
  }
  middleware() {
    const acl = this;
    return async function ACLMiddleware(ctx, next) {
      ctx.acl = acl;
      const roleName = ctx.state.currentRole || 'anonymous';
      const { resourceName: rawResourceName, actionName } = ctx.action;
      let resourceName = rawResourceName;
      if (rawResourceName.includes('.')) {
        resourceName = rawResourceName.split('.').pop();
      }
      if (ctx.getCurrentRepository) {
        const currentRepository = ctx.getCurrentRepository();
        if (currentRepository && currentRepository.targetCollection) {
          resourceName = ctx.getCurrentRepository().targetCollection.name;
        }
      }
      ctx.can = (options) => {
        const roles = ctx.state.currentRoles || [roleName];
        const can = acl.can({ roles, ...options });
        if (!can) {
          return null;
        }
        return can;
      };
      ctx.permission = {
        can: ctx.can({ resource: resourceName, action: actionName, rawResourceName }),
        resourceName,
        actionName,
      };
      return await compose(acl.middlewares.nodes)(ctx, next);
    };
  }
  /**
   * @internal
   */
  async getActionParams(ctx) {
    const roleNames = ctx.state.currentRoles?.length ? ctx.state.currentRoles : 'anonymous';
    const { resourceName: rawResourceName, actionName } = ctx.action;
    let resourceName = rawResourceName;
    if (rawResourceName.includes('.')) {
      resourceName = rawResourceName.split('.').pop();
    }
    if (ctx.getCurrentRepository) {
      const currentRepository = ctx.getCurrentRepository();
      if (currentRepository && currentRepository.targetCollection) {
        resourceName = ctx.getCurrentRepository().targetCollection.name;
      }
    }
    ctx.can = (options) => {
      const can = this.can({ roles: roleNames, ...options });
      if (can) {
        return lodash.cloneDeep(can);
      }
      return null;
    };
    ctx.permission = {
      can: ctx.can({ resource: resourceName, action: actionName, rawResourceName }),
      resourceName,
      actionName,
    };
    await compose(this.middlewares.nodes)(ctx, async () => {});
  }
  addGeneralFixedParams(merger) {
    this.fixedParamsManager.addGeneralParams(merger);
  }
  addFixedParams(resource, action, merger) {
    this.fixedParamsManager.addParams(resource, action, merger);
  }
  registerSnippet(snippet) {
    this.snippetManager.register(snippet);
  }
  addCoreMiddleware() {
    const acl = this;
    this.middlewares.add(
      async (ctx, next) => {
        const resourcerAction = ctx.action;
        const { resourceName, actionName } = ctx.permission;
        const permission = ctx.permission;
        ctx.log?.debug && ctx.log.debug('ctx permission', permission);
        if ((!permission.can || typeof permission.can !== 'object') && !permission.skip) {
          ctx.throw(403, 'No permissions');
          return;
        }
        const params = permission.can?.params || acl.fixedParamsManager.getParams(resourceName, actionName);
        ctx.log?.debug && ctx.log.debug('acl params', params);
        try {
          if (params && resourcerAction.mergeParams) {
            const db = ctx.database ?? ctx.db;
            const collection = db?.getCollection?.(resourceName);
            checkFilterParams(collection, params?.filter);
            const parsedFilter = await parseJsonTemplate(params.filter, {
              state: ctx.state,
              timezone: getTimezone(ctx),
              userProvider: createUserProvider({
                db: ctx.db,
                currentUser: ctx.state?.currentUser,
              }),
            });
            const parsedParams = params.filter ? { ...params, filter: parsedFilter ?? params.filter } : params;
            ctx.permission.parsedParams = parsedParams;
            ctx.log?.debug && ctx.log.debug('acl parsedParams', parsedParams);
            ctx.permission.rawParams = lodash.cloneDeep(resourcerAction.params);
            if (parsedParams.appends && resourcerAction.params.fields) {
              for (const queryField of resourcerAction.params.fields) {
                if (parsedParams.appends.indexOf(queryField) !== -1) {
                  // move field to appends
                  if (!resourcerAction.params.appends) {
                    resourcerAction.params.appends = [];
                  }
                  resourcerAction.params.appends.push(queryField);
                  resourcerAction.params.fields = resourcerAction.params.fields.filter((f) => f !== queryField);
                }
              }
            }
            const isEmptyFields = resourcerAction.params.fields && resourcerAction.params.fields.length === 0;
            resourcerAction.mergeParams(parsedParams, {
              appends: (x, y) => {
                if (!x) {
                  return [];
                }
                if (!y) {
                  return x;
                }
                return x.filter((i) => y.includes(i.split('.').shift()));
              },
            });
            if (isEmptyFields) {
              resourcerAction.params.fields = [];
            }
            ctx.permission.mergedParams = lodash.cloneDeep(resourcerAction.params);
          }
        } catch (e) {
          if (e instanceof NoPermissionError) {
            ctx.throw(403, 'No permissions');
            return;
          }
          throw e;
        }
        await next();
      },
      {
        tag: 'core',
        group: 'core',
      },
    );
  }
  isAvailableAction(actionName) {
    return this.availableActions.has(this.resolveActionAlias(actionName));
  }
}
function getTimezone(ctx) {
  return ctx?.request?.get?.('x-timezone') ?? ctx?.request?.header?.['x-timezone'] ?? ctx?.req?.headers?.['x-timezone'];
}
export function createUserProvider(options) {
  const db = options.db ?? options.dataSourceManager?.dataSources?.get?.('main')?.collectionManager?.db;
  const currentUser = options.currentUser;
  return async ({ fields }) => {
    if (!db) {
      return;
    }
    if (!currentUser) {
      return;
    }
    const userFields = fields.filter((f) => f && db.getFieldByPath('users.' + f));
    if (!userFields.length) {
      return;
    }
    const user = await db.getRepository('users').findOne({
      filterByTk: currentUser.id,
      fields: userFields,
    });
    return user;
  };
}
function containsCreatedByIdFilter(input, seen = new Set()) {
  if (!input) {
    return false;
  }
  if (Array.isArray(input)) {
    return input.some((item) => containsCreatedByIdFilter(item, seen));
  }
  if (!lodash.isPlainObject(input)) {
    return false;
  }
  if (seen.has(input)) {
    return false;
  }
  seen.add(input);
  for (const [key, value] of Object.entries(input)) {
    if (isCreatedByIdKey(key)) {
      return true;
    }
    if (containsCreatedByIdFilter(value, seen)) {
      return true;
    }
  }
  return false;
}
function isCreatedByIdKey(key) {
  return key === 'createdById' || key.startsWith('createdById.') || key.startsWith('createdById$');
}
/**
 * @internal
 */
export async function parseJsonTemplate(filter, options) {
  if (!filter) {
    return filter;
  }
  const timezone = options?.timezone;
  const state = JSON.parse(JSON.stringify(options?.state || {}));
  const parsedFilter = await parseFilter(filter, {
    timezone,
    now: new Date().toISOString(),
    vars: {
      ctx: {
        state,
      },
      $user: options?.userProvider || (async () => undefined),
      $nRole: () => state.currentRole,
    },
  });
  return parsedFilter;
}
/**
 * @internal
 */
export function checkFilterParams(collection, filter) {
  if (!filter) {
    return;
  }
  if (!containsCreatedByIdFilter(filter)) {
    return;
  }
  if (!collection || !collection.getField('createdById')) {
    throw new NoPermissionError('createdById field not found');
  }
}
//# sourceMappingURL=acl.js.map
