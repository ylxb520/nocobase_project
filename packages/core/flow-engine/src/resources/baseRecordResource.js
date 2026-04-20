/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import _ from 'lodash';
import { APIResource } from './apiResource';
import { FilterItem } from './filterItem';
import { ResourceError } from './flowResource';
import { DATA_SOURCE_DIRTY_EVENT } from '../views/viewEvents';
export class BaseRecordResource extends APIResource {
  resourceName;
  sourceId = null;
  // 请求配置 - 与 APIClient 接口保持一致
  request = {
    // url: null as string | null,
    method: 'get',
    params: {
      // filter: {} as Record<string, any>,
      // filterByTk: null as string | number | string[] | number[] | null,
      // appends: null as string[] | null,
      // fields: null as string[] | null,
      // sort: null as string[] | null,
      // except: null as string[] | null,
      // whitelist: null as string[] | null,
      // blacklist: null as string[] | null,
    },
    headers: {},
  };
  updateAssociationValues = [];
  runActionOptions = {};
  filterGroups = new Map();
  _refreshActionName = 'list';
  get supportsFilter() {
    return true;
  }
  setRefreshAction(refreshActionName) {
    this._refreshActionName = refreshActionName;
  }
  mergeRequestConfig(...args) {
    const base = {};
    // 限制到 2 层
    const customizer = (objValue, srcValue, key, object, source, stack) => {
      const depth = stack.size; // lodash 内部 stack 能告诉你当前深度
      if (Array.isArray(srcValue)) {
        // 数组覆盖
        return srcValue;
      }
      if (depth > 1) {
        // 超过 2 层就直接替换
        return srcValue;
      }
    };
    return args.reduce((acc, cur) => _.mergeWith(acc, cur, customizer), base);
  }
  setRunActionOptions(action, options) {
    this.runActionOptions[action] = options;
    return this;
  }
  splitValue(value) {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value) ? value : [];
  }
  buildURL(action) {
    let url = '';
    if (this.resourceName) {
      if (this.sourceId && this.resourceName.includes('.')) {
        // 处理关联资源，如 users.tags 或 users.profile
        const [parentResource, childResource] = this.resourceName.split('.');
        url = `${parentResource}/${this.sourceId}/${childResource}:${action || 'get'}`;
      } else {
        url = `${this.resourceName}:${action || 'get'}`;
      }
    }
    return url;
  }
  async runAction(action, options) {
    const { rawResponse, ...rest } = options;
    const config = this.mergeRequestConfig(
      _.omit(this.request, ['params', 'data', 'method']),
      {
        method: 'post',
        url: this.buildURL(action),
      },
      this.runActionOptions?.[action],
      rest,
    );
    if (['create', 'update', 'firstOrCreate', 'updateOrCreate'].includes(action)) {
      config.params = config.params || {};
      config.params.updateAssociationValues = this.getUpdateAssociationValues();
    }
    try {
      const response = await this.api.request(config);
      if (rawResponse) {
        return response;
      }
      const { data } = response;
      if (!data?.data) {
        return data;
      }
      return { data: data.data, meta: data.meta };
    } catch (err) {
      throw new ResourceError(err);
    }
  }
  setResourceName(resourceName) {
    this.resourceName = resourceName;
    return this;
  }
  getResourceName() {
    return this.resourceName;
  }
  /**
   * Mark current resource as dirty on the root FlowEngine.
   * Used to coordinate "refresh on active" across view stacks.
   */
  markDataSourceDirty(resourceName) {
    const engine = this.context.engine;
    if (!engine) return;
    const dataSourceKey = this.getDataSourceKey() || 'main';
    const resName = resourceName || this.getResourceName();
    if (!resName) return;
    const affectedResourceNames = new Set([String(resName)]);
    // Optional safety: association resources like "users.profile" may impact parent collection views.
    if (typeof resName === 'string' && resName.includes('.')) {
      affectedResourceNames.add(resName.split('.')[0]);
    }
    for (const name of affectedResourceNames) {
      engine.markDataSourceDirty(dataSourceKey, name);
    }
    // Signal current view to re-evaluate dirty blocks (e.g., same-view sibling refresh).
    // This is emitted on the *current* engine emitter (view-scoped) so it won't affect other views.
    engine.emitter?.emit?.(DATA_SOURCE_DIRTY_EVENT, {
      dataSourceKey,
      resourceNames: Array.from(affectedResourceNames),
    });
  }
  setSourceId(sourceId) {
    this.sourceId = sourceId;
    return this;
  }
  getSourceId() {
    return this.sourceId;
  }
  setDataSourceKey(dataSourceKey) {
    return this.addRequestHeader('X-Data-Source', dataSourceKey);
  }
  getDataSourceKey() {
    return this.request.headers['X-Data-Source'];
  }
  setFilter(filter) {
    return this.addRequestParameter('filter', JSON.stringify(filter));
  }
  getFilter() {
    const value = [...this.filterGroups.values()].filter(Boolean);
    if (value.length === 0) {
      return;
    }
    return {
      $and: value,
    };
  }
  resetFilter() {
    this.setFilter(this.getFilter());
  }
  addFilterGroup(key, filter) {
    if (filter instanceof FilterItem) {
      filter = filter.toJSON();
    }
    this.filterGroups.set(key, filter);
    this.resetFilter();
  }
  removeFilterGroup(key) {
    this.filterGroups.delete(key);
    this.resetFilter();
  }
  setAppends(appends) {
    return this.addRequestParameter('appends', appends);
  }
  getAppends() {
    return this.request.params.appends || [];
  }
  addAppends(appends) {
    const currentAppends = this.getAppends();
    const newAppends = this.splitValue(appends);
    newAppends.forEach((append) => {
      if (!currentAppends.includes(append)) {
        currentAppends.push(append);
      }
    });
    this.request.params.appends = currentAppends;
    return this;
  }
  removeAppends(appends) {
    if (!this.request.params.appends) {
      return this;
    }
    const currentAppends = this.getAppends();
    const removeAppends = this.splitValue(appends);
    this.request.params.appends = currentAppends.filter((append) => !removeAppends.includes(append));
    return this;
  }
  getUpdateAssociationValues() {
    return this.updateAssociationValues || [];
  }
  addUpdateAssociationValues(updateAssociationValues) {
    const currentUpdateAssociationValues = this.getUpdateAssociationValues();
    const newUpdateAssociationValues = this.splitValue(updateAssociationValues);
    newUpdateAssociationValues.forEach((append) => {
      if (!currentUpdateAssociationValues.includes(append)) {
        currentUpdateAssociationValues.push(append);
      }
    });
    this.updateAssociationValues = currentUpdateAssociationValues;
    return this;
  }
  jsonStringify(value) {
    if (value !== null && typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  }
  setFilterByTk(filterByTk) {
    return this.addRequestParameter('filterByTk', this.jsonStringify(filterByTk));
  }
  getFilterByTk() {
    return this.request.params.filterByTk;
  }
  setFields(fields) {
    return this.addRequestParameter('fields', this.splitValue(fields));
  }
  getFields() {
    return this.request.params.fields || [];
  }
  setSort(sort) {
    return this.addRequestParameter('sort', this.splitValue(sort));
  }
  getSort() {
    return this.request.params.sort || [];
  }
  setExcept(except) {
    return this.addRequestParameter('except', this.splitValue(except));
  }
  getExcept() {
    return this.request.params.except || [];
  }
  setWhitelist(whitelist) {
    return this.addRequestParameter('whitelist', this.splitValue(whitelist));
  }
  getWhitelist() {
    return this.request.params.whitelist || [];
  }
  setBlacklist(blacklist) {
    return this.addRequestParameter('blacklist', this.splitValue(blacklist));
  }
  getBlacklist() {
    return this.request.params.blacklist || [];
  }
}
//# sourceMappingURL=baseRecordResource.js.map
