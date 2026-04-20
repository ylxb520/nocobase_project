/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import compose from 'koa-compose';
import { requireModule } from '@nocobase/utils';
export class Middleware {
  options;
  middlewares = [];
  constructor(options) {
    options = requireModule(options);
    if (typeof options === 'function') {
      this.options = { handler: options };
    } else {
      this.options = options;
    }
  }
  getHandler() {
    const handler = requireModule(this.options.handler);
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function!');
    }
    return (ctx, next) => compose([handler, ...this.middlewares])(ctx, next);
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  disuse(middleware) {
    this.middlewares.splice(this.middlewares.indexOf(middleware), 1);
  }
  canAccess(name) {
    const { only = [], except = [] } = this.options;
    if (only.length > 0) {
      return only.includes(name);
    }
    if (except.length > 0) {
      return !except.includes(name);
    }
    return true;
  }
  static toInstanceArray(middlewares) {
    if (!middlewares) {
      return [];
    }
    if (!Array.isArray(middlewares)) {
      middlewares = [middlewares];
    }
    return middlewares.map((middleware) => {
      if (middleware instanceof Middleware) {
        return middleware;
      }
      if (typeof middleware === 'object') {
        return new Middleware(middleware);
      }
      if (typeof middleware === 'function') {
        return new Middleware({ handler: middleware });
      }
    });
  }
}
export default Middleware;
export function branch(map = {}, reducer, options = {}) {
  return (ctx, next) => {
    const key = reducer(ctx);
    if (!key) {
      return options.keyNotFound ? options.keyNotFound(ctx, next) : ctx.throw(404);
    }
    const handler = map[key];
    if (!handler) {
      return options.handlerNotSet ? options.handlerNotSet(ctx, next) : ctx.throw(404);
    }
    return handler(ctx, next);
  };
}
//# sourceMappingURL=middleware.js.map
