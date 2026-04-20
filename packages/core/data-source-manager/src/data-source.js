/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ACL } from '@nocobase/acl';
import { getNameByParams, parseRequest, ResourceManager } from '@nocobase/resourcer';
import { wrapMiddlewareWithLogging } from '@nocobase/utils';
import EventEmitter from 'events';
import compose from 'koa-compose';
import { loadDefaultActions } from './load-default-actions';
export class DataSource extends EventEmitter {
  options;
  collectionManager;
  resourceManager;
  acl;
  dataSourceManager;
  logger;
  constructor(options) {
    super();
    this.options = options;
    this.init(options);
  }
  _sqlLogger;
  get sqlLogger() {
    return this._sqlLogger || this.logger;
  }
  get name() {
    return this.options.name;
  }
  static testConnection(options) {
    return Promise.resolve(true);
  }
  setDataSourceManager(dataSourceManager) {
    this.dataSourceManager = dataSourceManager;
  }
  setLogger(logger) {
    this.logger = logger;
  }
  setSqlLogger(logger) {
    this._sqlLogger = logger;
  }
  init(options = {}) {
    this.acl = this.createACL();
    this.resourceManager = this.createResourceManager({
      prefix: process.env.API_BASE_PATH,
      ...options.resourceManager,
    });
    this.collectionManager = this.createCollectionManager(options);
    if (this.collectionManager) {
      this.collectionManager.setDataSource(this);
    }
    this.resourceManager.registerActionHandlers(loadDefaultActions());
    if (options.acl !== false) {
      this.resourceManager.use(this.acl.middleware(), { tag: 'acl', after: ['auth'] });
    }
  }
  middleware(middlewares = []) {
    const dataSource = this;
    if (!this['_used']) {
      for (const [fn, options] of middlewares) {
        this.resourceManager.use(fn, options);
      }
      this['_used'] = true;
    }
    return async (ctx, next) => {
      ctx.dataSource = dataSource;
      ctx.getCurrentRepository = () => {
        const { resourceName, resourceOf } = ctx.action;
        return this.collectionManager.getRepository(resourceName, resourceOf);
      };
      const middlewares = [this.collectionToResourceMiddleware(), this.resourceManager.middleware()];
      return compose(middlewares.map((fn) => wrapMiddlewareWithLogging(fn)))(ctx, next);
    };
  }
  createACL() {
    return new ACL();
  }
  createResourceManager(options) {
    return new ResourceManager(options);
  }
  publicOptions() {
    return null;
  }
  emitLoadingProgress(progress) {
    this.emit('loadingProgress', progress);
  }
  async load(options = {}) {}
  async close() {}
  async cleanCache() {}
  collectionToResourceMiddleware() {
    const self = this;
    return async function collectionToResource(ctx, next) {
      const params = parseRequest(
        {
          path: ctx.request.path,
          method: ctx.request.method,
        },
        {
          prefix: self.resourceManager.options.prefix,
          accessors: self.resourceManager.options.accessors,
        },
      );
      if (!params) {
        return next();
      }
      const resourceName = getNameByParams(params);
      // 如果资源名称未被定义
      if (self.resourceManager.isDefined(resourceName)) {
        return next();
      }
      const splitResult = resourceName.split('.');
      const collectionName = splitResult[0];
      if (!self.collectionManager.hasCollection(collectionName)) {
        return next();
      }
      self.resourceManager.define({
        name: resourceName,
      });
      return next();
    };
  }
}
//# sourceMappingURL=data-source.js.map
