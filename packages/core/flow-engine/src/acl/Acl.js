/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import _, { omit } from 'lodash';
export class ACL {
  flowEngine;
  data = {};
  meta = {};
  loaded = false;
  loadingPromise = null;
  // 用于识别当前鉴权状态（例如切换登录用户后应重新加载）
  // 记录上一次用于鉴权的 token，用于识别登录态变更
  lastToken = null;
  constructor(flowEngine) {
    this.flowEngine = flowEngine;
  }
  setData(data) {
    this.data = _.cloneDeep(data);
  }
  setMeta(data) {
    this.meta = _.cloneDeep(data);
  }
  async load() {
    // 基于 token 识别登录态是否发生变化
    const currentToken = this.flowEngine?.context?.api?.auth?.token || '';
    // 已加载但登录态变更：强制重载
    if (this.loaded && this.lastToken !== currentToken) {
      this.loaded = false;
      this.loadingPromise = null;
      this.data = {};
      this.meta = {};
    }
    const { data } = await this.flowEngine.context.api.request({
      url: 'roles:check',
    });
    this.data = data?.data || {};
    this.meta = data?.meta || {};
    this.loaded = true;
    this.lastToken = currentToken;
    await this.loadingPromise;
  }
  getActionAlias(actionName) {
    return this.data.actionAlias?.[actionName] || actionName;
  }
  inResources(resourceName, dataSourceName) {
    const { dataSources: dataSourcesAcl } = this?.meta || {};
    const data = { ...this.data, ...omit(dataSourcesAcl?.[dataSourceName], 'snippets') };
    return data.resources?.includes?.(resourceName);
  }
  getResourceActionParams(resourceName, actionName, dataSourceName) {
    const actionAlias = this.getActionAlias(actionName);
    const { dataSources: dataSourcesAcl } = this?.meta || {};
    const data = { ...this.data, ...omit(dataSourcesAcl?.[dataSourceName], 'snippets') };
    return data.actions?.[`${resourceName}:${actionAlias}`] || data.actions?.[actionName];
  }
  getStrategyActionParams(actionName, dataSourceName) {
    const actionAlias = this.getActionAlias(actionName);
    const { dataSources: dataSourcesAcl } = this?.meta || {};
    const data = { ...this.data, ...omit(dataSourcesAcl?.[dataSourceName], 'snippets') };
    const strategyAction = data?.strategy?.actions?.find((action) => {
      const [value] = action.split(':');
      return value === actionAlias;
    });
    return strategyAction ? {} : null;
  }
  getIgnoreScope = (options = {}) => {
    const { recordPkValue, allowedActions, actionName } = options;
    let ignoreScope = false;
    if (options.ignoreScope) {
      ignoreScope = true;
    }
    if (actionName === 'create') {
      ignoreScope = true;
    }
    if (!recordPkValue || !allowedActions) {
      ignoreScope = true;
    }
    return ignoreScope;
  };
  verifyScope = (actionName, recordPkValue, allowedActions) => {
    const actionAlias = this.getActionAlias(actionName);
    const scopeValues = allowedActions?.[actionAlias];
    if (!Array.isArray(scopeValues)) {
      return null;
    }
    return scopeValues.map((v) => String(v)).includes(String(recordPkValue));
  };
  parseAction(options) {
    const { resourceName, actionName, dataSourceKey = 'main', recordPkValue, allowedActions } = options;
    const targetResource =
      resourceName?.includes('.') &&
      this.flowEngine.context.dataSourceManager
        .getDataSource(dataSourceKey)
        .collectionManager.getAssociation(resourceName)?.target;
    if (!this.getIgnoreScope(options)) {
      const r = this.verifyScope(actionName, recordPkValue, allowedActions);
      if (!r) {
        return null;
      }
    }
    if (this.inResources(targetResource, dataSourceKey)) {
      return this.getResourceActionParams(targetResource, actionName, dataSourceKey);
    }
    if (this.inResources(resourceName, dataSourceKey)) {
      return this.getResourceActionParams(resourceName, actionName, dataSourceKey);
    }
    return this.getStrategyActionParams(actionName, dataSourceKey);
  }
  parseField(options) {
    const { fields } = options;
    const params = this.parseAction(options);
    const whitelist = []
      .concat(params?.whitelist || [])
      .concat(params?.fields || [])
      .concat(params?.appends || []);
    if (params && !Object.keys(params).length) {
      return true;
    }
    const allowed = whitelist.includes(fields[0]);
    return allowed;
  }
  async aclCheck(options) {
    // await this.load();
    const { allowAll } = this.data;
    if (allowAll) {
      return true;
    }
    if (options.fields) {
      return this.parseField(options);
    }
    return this.parseAction(options);
  }
}
//# sourceMappingURL=Acl.js.map
