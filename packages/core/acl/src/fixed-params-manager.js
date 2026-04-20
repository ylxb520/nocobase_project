/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { assign } from '@nocobase/utils';
const SPLIT = ':';
export default class FixedParamsManager {
  merger = new Map();
  generalMergers = [];
  addParams(resource, action, merger) {
    const path = this.getActionPath(resource, action);
    this.merger.set(path, [...this.getParamsMerger(resource, action), merger]);
  }
  addGeneralParams(merger) {
    this.generalMergers.push(merger);
  }
  getParamsMerger(resource, action) {
    const path = this.getActionPath(resource, action);
    return this.merger.get(path) || [];
  }
  getActionPath(resource, action) {
    return `${resource}${SPLIT}${action}`;
  }
  getParams(resource, action, extraParams = {}) {
    const results = {};
    for (const merger of this.generalMergers) {
      FixedParamsManager.mergeParams(results, merger(resource, action));
    }
    for (const merger of this.getParamsMerger(resource, action)) {
      FixedParamsManager.mergeParams(results, merger());
    }
    if (extraParams) {
      FixedParamsManager.mergeParams(results, extraParams);
    }
    return results;
  }
  static mergeParams(a, b) {
    assign(a, b, {
      filter: 'andMerge',
      fields: 'intersect',
      appends: 'union',
      except: 'union',
      whitelist: 'intersect',
      blacklist: 'intersect',
      sort: 'overwrite',
    });
  }
}
//# sourceMappingURL=fixed-params-manager.js.map
