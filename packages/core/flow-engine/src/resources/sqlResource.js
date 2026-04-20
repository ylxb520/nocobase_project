/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observable } from '@formily/reactive';
import _ from 'lodash';
import { FlowContext } from '../flowContext';
import { BaseRecordResource } from './baseRecordResource';
import { parseLiquidContext, transformSQL } from '@nocobase/utils/client';
export class FlowSQLRepository {
  ctx;
  constructor(ctx) {
    this.ctx = new FlowContext();
    this.ctx.addDelegate(ctx);
    this.ctx.defineProperty('offset', {
      get: () => 0,
      cache: false,
    });
    this.ctx.defineProperty('limit', {
      get: () => 20,
      cache: false,
    });
  }
  async run(sql, options = {}) {
    const { sql: transformedSQL, bind, liquidContext } = await transformSQL(sql);
    const resolved = await this.ctx.resolveJsonTemplate({ bind, liquidContext });
    const parsedSQL = await parseLiquidContext(transformedSQL, resolved.liquidContext);
    const { data } = await this.ctx.api.request({
      method: 'POST',
      url: 'flowSql:run',
      data: {
        sql: parsedSQL,
        ...options,
        bind: {
          ...resolved.bind,
          ...options.bind,
        },
      },
    });
    return data?.data;
  }
  async save(data) {
    await this.ctx.api.request({
      method: 'POST',
      url: 'flowSql:save',
      data: {
        ...data,
      },
    });
  }
  async runById(uid, options) {
    const response = await this.ctx.api.request({
      method: 'GET',
      url: 'flowSql:getBind',
      params: {
        uid,
      },
    });
    const { bind, liquidContext } = await this.ctx.resolveJsonTemplate(response.data.data || {});
    const { data } = await this.ctx.api.request({
      method: 'POST',
      url: 'flowSql:runById',
      data: {
        uid,
        ...options,
        bind: {
          ...bind,
          ...options?.bind,
        },
        liquidContext,
      },
    });
    return data?.data;
  }
  async destroy(uid) {
    await this.ctx.api.request({
      url: 'flowSql:destroy',
      params: {
        filterByTk: uid,
      },
    });
  }
}
export class SQLResource extends BaseRecordResource {
  _data = observable.ref(null);
  _meta = observable.ref({});
  refreshTimer = null;
  refreshWaiters = [];
  _debugEnabled = false;
  _sql;
  // 请求配置 - 与 APIClient 接口保持一致
  request = {
    // url: null as string | null,
    method: 'post',
    params: {},
    data: {},
    headers: {},
  };
  get refreshActionName() {
    return this._debugEnabled ? 'run' : 'runById';
  }
  get supportsFilter() {
    return true;
  }
  constructor(context) {
    super(context);
    context.defineProperty('limit', {
      get: () => this.getPageSize(),
      cache: false,
    });
    context.defineProperty('offset', {
      get: () => {
        const page = this.getPage();
        const pageSize = this.getPageSize();
        return (page - 1) * pageSize;
      },
      cache: false,
    });
  }
  buildURL(action) {
    return `flowSql:${action || this.refreshActionName}`;
  }
  setPage(page) {
    this.addRequestParameter('page', page);
    return this.setMeta({ page });
  }
  getPage() {
    return this.getMeta('page') || 1;
  }
  setPageSize(pageSize) {
    this.addRequestParameter('pageSize', pageSize);
    return this.setMeta({ pageSize });
  }
  setDebug(enabled) {
    this._debugEnabled = enabled;
    return this;
  }
  getPageSize() {
    return this.getMeta('pageSize') || 20;
  }
  async next() {
    this.setPage(this.getPage() + 1);
    await this.refresh();
  }
  async previous() {
    if (this.getPage() > 1) {
      this.setPage(this.getPage() - 1);
      await this.refresh();
    }
  }
  async goto(page) {
    if (page > 0) {
      this.request.params.page = page;
      await this.refresh();
    }
  }
  setDataSourceKey(dataSourceKey) {
    this.request.data.dataSourceKey = dataSourceKey;
    return this;
  }
  setSQLType(type) {
    this.request.data.type = type;
    return this;
  }
  setSQL(sql) {
    this._sql = sql;
    return this;
  }
  setFilterByTk(filterByTk) {
    this.request.data.uid = filterByTk;
    return this;
  }
  setFilter(filter) {
    this.request.data.filter = filter;
    return this;
  }
  setBind(bind) {
    this.request.data.bind = bind;
    return this;
  }
  setLiquidContext(liquidContext) {
    this.request.data.liquidContext = liquidContext;
    return this;
  }
  async run() {
    return this._debugEnabled ? await this.runBySQL() : await this.runById();
  }
  async runBySQL() {
    const sql = this._sql;
    const { sql: transformedSQL, bind, liquidContext } = await transformSQL(sql);
    const resolved = await this.context.resolveJsonTemplate({ bind, liquidContext });
    const options = _.cloneDeep({
      method: 'post',
      ...this.getRefreshRequestOptions(),
    });
    options.data.sql = await parseLiquidContext(transformedSQL, resolved.liquidContext);
    options.data.bind = resolved.bind;
    return await this.runAction('run', options);
  }
  async runById() {
    const { data } = await this.runAction('getBind', {
      method: 'get',
      params: {
        uid: this.request.data.uid,
      },
    });
    const { bind, liquidContext } = await this.context.resolveJsonTemplate(data);
    this.setBind(bind);
    this.setLiquidContext(liquidContext);
    return await this.runAction('runById', {
      method: 'post',
      ...this.getRefreshRequestOptions(),
    });
  }
  /**
   * 在同一个事件循环内多次调用 refresh 方法时，只有最后一次调用会生效。避免触发多次相同的接口请求。
   * @returns
   */
  async refresh() {
    // 清除之前的定时器，确保只有最后一次调用生效
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    // 设置新的定时器，在下一个事件循环执行
    return new Promise((resolve, reject) => {
      this.refreshWaiters.push({ resolve, reject });
      this.refreshTimer = setTimeout(async () => {
        const waiters = this.refreshWaiters;
        this.refreshWaiters = [];
        this.refreshTimer = null;
        try {
          this.clearError();
          this.loading = true;
          this.emit('loading');
          const { data, meta } = await this.run();
          this.setData(data).setMeta(meta);
          this.loading = false;
          this.emit('refresh');
          waiters.forEach((w) => w.resolve());
        } catch (error) {
          this.setError(error);
          const err = error instanceof Error ? error : new Error(String(error));
          waiters.forEach((w) => w.reject(err));
        } finally {
          this.loading = false;
        }
      });
    });
  }
}
//# sourceMappingURL=sqlResource.js.map
