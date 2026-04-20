/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class CollectionGroupManager {
  db;
  constructor(db) {
    this.db = db;
  }
  static unifyDumpRules(dumpRules) {
    if (!dumpRules) {
      return undefined;
    }
    if (typeof dumpRules === 'string') {
      return {
        group: dumpRules,
      };
    }
    if ('required' in dumpRules && dumpRules.required) {
      return {
        ...dumpRules,
        group: 'required',
      };
    }
    if ('skipped' in dumpRules && dumpRules.skipped) {
      return {
        ...dumpRules,
        group: 'skipped',
      };
    }
    return dumpRules;
  }
}
//# sourceMappingURL=collection-group-manager.js.map
