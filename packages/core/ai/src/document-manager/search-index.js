/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Index as BaseIndex } from 'flexsearch';
import { IdMapper } from './id-mapper';
export class Index {
  index;
  ids = new IdMapper();
  constructor(options) {
    this.index = new BaseIndex(options);
  }
  async add(id, text) {
    const numericId = this.ids.toNumeric(id);
    return this.index.addAsync(numericId, text);
  }
  async remove(id) {
    const numericId = this.ids.getNumeric(id);
    if (numericId === undefined) {
      return;
    }
    await this.index.removeAsync(numericId);
    this.ids.remove(id);
  }
  async search(query, options) {
    const result = await this.index.searchAsync(query, options);
    return result.map((id) => this.ids.toExternal(id));
  }
  export(handler) {
    return this.index.export(handler);
  }
  import(key, data) {
    return this.index.import(key, data);
  }
}
//# sourceMappingURL=search-index.js.map
