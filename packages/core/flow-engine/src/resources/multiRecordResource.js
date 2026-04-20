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
import { BaseRecordResource } from './baseRecordResource';
export class MultiRecordResource extends BaseRecordResource {
  _data = observable.ref([]);
  _meta = observable.ref({});
  refreshTimer = null;
  refreshWaiters = [];
  createActionOptions = {};
  updateActionOptions = {};
  _refreshActionName = 'list';
  // 请求配置 - 与 APIClient 接口保持一致
  request = {
    // url: null as string | null,
    method: 'get',
    params: {
      filter: {},
      filterByTk: null,
      appends: [],
      fields: [],
      sort: null,
      except: null,
      whitelist: null,
      blacklist: null,
      page: 1,
      pageSize: 20,
    },
    headers: {},
  };
  get supportsFilter() {
    return true;
  }
  setCreateActionOptions(options) {
    this.createActionOptions = options;
    return this;
  }
  setUpdateActionOptions(options) {
    this.updateActionOptions = options;
    return this;
  }
  setSelectedRows(selectedRows) {
    this.setMeta({ selectedRows });
    return this;
  }
  getSelectedRows() {
    return this.getMeta('selectedRows') || [];
  }
  getCount() {
    return this.getMeta('count');
  }
  setPage(page) {
    this.addRequestParameter('page', page);
    return this.setMeta({ page });
  }
  getPage() {
    return this.getMeta('page');
  }
  setPageSize(pageSize) {
    this.addRequestParameter('pageSize', pageSize);
    return this.setMeta({ pageSize });
  }
  getPageSize() {
    return this.getMeta('pageSize');
  }
  getTotalPage() {
    return this.getMeta('totalPage');
  }
  getCell(rowIndex, columnKey) {
    const data = this.getData();
    return data?.[rowIndex]?.[columnKey];
  }
  async next() {
    this.request.params.page += 1;
    await this.refresh();
  }
  async previous() {
    if (this.request.params.page > 1) {
      this.request.params.page -= 1;
      await this.refresh();
    }
  }
  async goto(page) {
    if (page > 0) {
      this.request.params.page = page;
      await this.refresh();
    }
  }
  async create(data, options) {
    const config = this.mergeRequestConfig({ data }, this.createActionOptions, options);
    const res = await this.runAction('create', config);
    this.markDataSourceDirty();
    this.emit('saved', data);
    if (options?.refresh !== false) {
      await this.refresh();
    }
    return res;
  }
  async get(filterByTk) {
    const options = {
      params: {
        filterByTk,
      },
    };
    const { data } = await this.runAction('get', {
      ...options,
    });
    return data;
  }
  async update(filterByTk, data, options) {
    const result = data;
    const config = this.mergeRequestConfig(
      {
        params: {
          filterByTk,
        },
        data: result,
      },
      this.updateActionOptions,
      options,
    );
    await this.runAction('update', config);
    this.markDataSourceDirty();
    this.emit('saved', data);
    await this.refresh();
  }
  async destroySelectedRows() {
    const selectedRows = this.getSelectedRows();
    if (selectedRows.length === 0) {
      throw new Error('No rows selected for deletion.');
    }
    await this.destroy(selectedRows);
  }
  async destroy(filterByTk, options) {
    const config = this.mergeRequestConfig(
      {
        params: {
          filterByTk: this.jsonStringify(filterByTk),
        },
      },
      options,
    );
    await this.runAction('destroy', config);
    this.markDataSourceDirty();
    const currentPage = this.getPage();
    const lastPage = Math.ceil((this.getCount() - _.castArray(filterByTk).length) / this.getPageSize());
    if (currentPage > lastPage) {
      this.setPage(lastPage || 1);
    }
    await this.refresh();
  }
  setItem(index, newDataItem) {
    const oldData = this.getData();
    const newData = oldData.slice(); // 浅拷贝
    newData[index] = { ...newDataItem };
    this.setData(newData);
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
          const { data, meta } = await this.runAction(this._refreshActionName, {
            method: 'get',
            ...this.getRefreshRequestOptions(),
          });
          this.setData(data).setMeta(meta);
          if (meta?.page) {
            this.setPage(meta.page);
          }
          if (meta?.pageSize) {
            this.setPageSize(meta.pageSize);
          }
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
//# sourceMappingURL=multiRecordResource.js.map
