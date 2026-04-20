/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { assign, requireModule, wrapMiddlewareWithLogging } from '@nocobase/utils';
import compose from 'koa-compose';
import _ from 'lodash';
import Middleware from './middleware';
export class Action {
  handler;
  resource;
  name;
  options;
  context = {};
  params = {};
  actionName;
  resourceName;
  /**
   * This method is deprecated and should not be used.
   * Use {@link this.sourceId} instead.
   * @deprecated
   */
  resourceOf;
  sourceId;
  middlewares = [];
  /**
   * @internal
   */
  constructor(options) {
    options = requireModule(options);
    if (typeof options === 'function') {
      options = { handler: options };
    }
    const { middleware, middlewares = [], handler, ...params } = options;
    this.middlewares = Middleware.toInstanceArray(middleware || middlewares);
    this.handler = handler;
    this.options = options;
    this.mergeParams(params);
  }
  /**
   * @internal
   */
  toJSON() {
    return {
      actionName: this.actionName,
      resourceName: this.resourceName,
      resourceOf: this.sourceId,
      sourceId: this.sourceId,
      params: this.params,
    };
  }
  /**
   * @internal
   */
  clone() {
    const options = _.cloneDeep(this.options);
    delete options.middleware;
    delete options.middlewares;
    const action = new Action(options);
    action.setName(this.name);
    action.setResource(this.resource);
    action.middlewares.push(...this.middlewares);
    return action;
  }
  /**
   * @internal
   */
  setContext(context) {
    this.context = context;
  }
  mergeParams(params, strategies = {}) {
    if (!this.params) {
      this.params = {};
    }
    if (!params) {
      return;
    }
    assign(this.params, params, {
      filter: 'andMerge',
      fields: 'intersect',
      appends: 'union',
      except: 'union',
      whitelist: 'intersect',
      blacklist: 'intersect',
      sort: 'overwrite',
      ...strategies,
    });
  }
  /**
   * @internal
   */
  setResource(resource) {
    this.resource = resource;
    return this;
  }
  /**
   * @internal
   */
  getResource() {
    return this.resource;
  }
  /**
   * @internal
   */
  getOptions() {
    return this.options;
  }
  /**
   * @internal
   */
  setName(name) {
    this.name = name;
    return this;
  }
  /**
   * @internal
   */
  getName() {
    return this.name;
  }
  /**
   * @internal
   */
  getMiddlewareHandlers() {
    return this.middlewares
      .filter((middleware) => middleware.canAccess(this.name))
      .map((middleware) => middleware.getHandler());
  }
  /**
   * @internal
   */
  getHandler() {
    const handler = requireModule(this.handler || this.resource.resourcer.getRegisteredHandler(this.name));
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function!');
    }
    return handler;
  }
  /**
   * @internal
   */
  getHandlers() {
    const handlers = [
      ...this.resource.resourcer.getMiddlewares(),
      ...this.getMiddlewareHandlers(),
      ...this.resource.resourcer.getRegisteredPreActionHandlers(this.resource.getName(), this.name),
      this.getHandler(),
    ].filter(Boolean);
    return handlers.map((fn) => wrapMiddlewareWithLogging(fn));
  }
  /**
   * @internal
   */
  async execute(context, next) {
    return await compose(this.getHandlers())(context, next);
  }
  /**
   * @internal
   */
  static toInstanceMap(actions, resource) {
    return new Map(
      Object.entries(actions).map(([key, options]) => {
        let action;
        if (options instanceof Action) {
          action = options;
        } else {
          action = new Action(options);
        }
        action.setName(key);
        action.setResource(resource);
        resource && action.middlewares.unshift(...resource.middlewares);
        return [key, action];
      }),
    );
  }
}
export default Action;
//# sourceMappingURL=action.js.map
