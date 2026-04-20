/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { importModule, Toposort } from '@nocobase/utils';
import glob from 'glob';
import compose from 'koa-compose';
import { pathToRegexp } from 'path-to-regexp';
import Resource from './resource';
import { getNameByParams, parseQuery, parseRequest } from './utils';
export class ResourceManager {
  /**
   * @internal
   */
  options;
  resources = new Map();
  /**
   * 全局定义的 action handlers
   */
  handlers = new Map();
  actionHandlers = new Map();
  preActionHandlers = new Map();
  middlewareHandlers = new Map();
  middlewares;
  constructor(options = {}) {
    this.options = options;
    this.middlewares = new Toposort();
  }
  /**
   * 载入指定目录下的 resource 配置（配置的文件驱动）
   *
   * TODO: 配置的文件驱动现在会全部初始化，大数据时可能存在性能瓶颈，后续可以加入动态加载
   *
   * @param {object}   [options]
   * @param {string}   [options.directory] 指定配置所在路径
   * @param {array}    [options.extensions = ['js', 'ts', 'json']] 文件后缀
   *
   */
  async import(options) {
    const { extensions = ['js', 'ts', 'json'], directory } = options;
    const patten = `${directory}/*.{${extensions.join(',')}}`;
    const files = glob.sync(patten, {
      ignore: ['**/*.d.ts'],
    });
    const resources = new Map();
    for (const file of files) {
      const options = await importModule(file);
      const table = this.define(typeof options === 'function' ? options(this) : options);
      resources.set(table.getName(), table);
    }
    return resources;
  }
  /**
   * resource 配置
   *
   * @param name
   * @param options
   */
  define(options) {
    const { name } = options;
    const resource = new Resource(options, this);
    this.resources.set(name, resource);
    return resource;
  }
  isDefined(name) {
    return this.resources.has(name);
  }
  /**
   * @internal
   */
  removeResource(name) {
    return this.resources.delete(name);
  }
  /**
   * This method is deprecated and should not be used.
   * Use {@link ResourceManager#registerActionHandler} instead.
   * @deprecated
   */
  registerAction(name, handler) {
    this.registerActionHandler(name, handler);
  }
  /**
   * This method is deprecated and should not be used.
   * Use {@link ResourceManager#registerActionHandlers} instead.
   * @deprecated
   */
  registerActions(handlers) {
    this.registerActionHandlers(handlers);
  }
  /**
   * 注册全局的 action handlers
   *
   * @param handlers
   */
  registerActionHandlers(handlers) {
    for (const [name, handler] of Object.entries(handlers)) {
      this.registerActionHandler(name, handler);
    }
  }
  registerActionHandler(name, handler) {
    this.actionHandlers.set(name, handler);
  }
  /**
   * @internal
   */
  getRegisteredHandler(name) {
    return this.actionHandlers.get(name);
  }
  /**
   * @internal
   */
  getRegisteredHandlers() {
    return this.actionHandlers;
  }
  registerPreActionHandler(name, handler, options = {}) {
    const middlewares = this.preActionHandlers.get(name) || new Toposort();
    middlewares.add(handler, options);
    this.preActionHandlers.set(name, middlewares);
  }
  getRegisteredPreActionHandlers(name, action) {
    let specificAction = action;
    if (!action.includes(':')) {
      specificAction = `${name}:${action}`;
    }
    let middlewares = this.preActionHandlers.get(specificAction);
    if (!middlewares) {
      middlewares = this.preActionHandlers.get(action);
    }
    return middlewares?.nodes || [];
  }
  /**
   * @internal
   */
  getResource(name) {
    if (!this.resources.has(name)) {
      throw new Error(`${name} resource does not exist`);
    }
    return this.resources.get(name);
  }
  /**
   * @internal
   */
  getAction(name, action) {
    // 支持注册局部 action
    if (this.actionHandlers.has(`${name}:${action}`)) {
      return this.getResource(name).getAction(`${name}:${action}`);
    }
    return this.getResource(name).getAction(action);
  }
  /**
   * @internal
   */
  getMiddlewares() {
    return this.middlewares.nodes;
  }
  use(middlewares, options = {}) {
    if (!options.tag && !options.group && !options.before && !options.after) {
      options.tag = 'default';
    }
    this.middlewares.add(middlewares, options);
  }
  middleware({ prefix, accessors, skipIfDataSourceExists = false } = {}) {
    const self = this;
    return async function resourcerMiddleware(ctx, next) {
      if (skipIfDataSourceExists) {
        const dataSource = ctx.get('x-data-source');
        if (dataSource) {
          return next();
        }
      }
      ctx.resourcer = self;
      let params = parseRequest(
        {
          path: ctx.request.path,
          method: ctx.request.method,
        },
        {
          prefix: self.options.prefix || prefix,
          accessors: self.options.accessors || accessors,
        },
      );
      if (!params) {
        return next();
      }
      try {
        const resource = self.getResource(getNameByParams(params));
        // 为关系资源时，暂时需要再执行一遍 parseRequest
        if (resource.options.type && resource.options.type !== 'single') {
          params = parseRequest(
            {
              path: ctx.request.path,
              method: ctx.request.method,
              type: resource.options.type,
            },
            {
              prefix: self.options.prefix || prefix,
              accessors: self.options.accessors || accessors,
            },
          );
          if (!params) {
            return next();
          }
        }
        // action 需要 clone 之后再赋给 ctx
        ctx.action = self.getAction(getNameByParams(params), params.actionName).clone();
        ctx.action.setContext(ctx);
        ctx.action.actionName = params.actionName;
        ctx.action.sourceId = params.associatedIndex;
        ctx.action.resourceOf = params.associatedIndex;
        ctx.action.resourceName = params.associatedName
          ? `${params.associatedName}.${params.resourceName}`
          : params.resourceName;
        ctx.action.params.filterByTk = params.resourceIndex;
        const query = parseQuery(ctx.request.querystring);
        if (pathToRegexp('/resourcer/:rest(.*)').test(ctx.request.path)) {
          ctx.action.mergeParams({
            ...query,
            ...params,
            ...ctx.request.body,
          });
        } else {
          ctx.action.mergeParams({
            ...query,
            ...params,
            values: ctx.request.body,
          });
        }
        return compose(ctx.action.getHandlers())(ctx, next);
      } catch (error) {
        console.log(error);
        return next();
      }
    };
  }
  /**
   * This method is deprecated and should not be used.
   * Use {@link ResourceManager#middleware} instead.
   * @deprecated
   */
  restApiMiddleware(options = {}) {
    return this.middleware(options);
  }
  /**
   * @internal
   */
  async execute(options, context = {}, next) {
    const { resource, action } = options;
    context.resourcer = this;
    context.action = this.getAction(resource, action);
    return await context.action.execute(context, next);
  }
}
/**
 * This class is deprecated and should not be used.
 * Use {@link ResourceManager} instead.
 * @deprecated
 */
export class Resourcer extends ResourceManager {}
export default ResourceManager;
//# sourceMappingURL=resourcer.js.map
