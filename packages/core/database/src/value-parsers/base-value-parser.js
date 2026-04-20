/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class BaseValueParser {
  ctx;
  field;
  value;
  errors = [];
  constructor(field, ctx) {
    this.field = field;
    this.ctx = ctx;
    this.value = null;
  }
  trim(value) {
    return typeof value === 'string' ? value.trim() : value;
  }
  toArr(value, splitter) {
    let values = [];
    if (!value) {
      values = [];
    } else if (typeof value === 'string') {
      values = value.split(splitter || /,|，|、/);
    } else if (Array.isArray(value)) {
      values = value;
    }
    return values.map((v) => this.trim(v)).filter(Boolean);
  }
  toString() {
    return this.value;
  }
  getValue() {
    return this.value;
  }
  async setValue(value) {
    this.value = value;
  }
}
//# sourceMappingURL=base-value-parser.js.map
