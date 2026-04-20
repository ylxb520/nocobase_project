/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class FullDataRepository {
  data = [];
  constructor(data) {
    this.data = data;
  }
  async count(countOptions) {
    return this.data.length;
  }
  async find(options) {
    const { limit, offset } = options || {};
    let results = this.data;
    // Handle offset
    if (offset) {
      results = results.slice(offset);
    }
    // Handle limit
    if (limit) {
      results = results.slice(0, limit);
    }
    return results;
  }
  async findAndCount(options = {}) {
    const count = await this.count();
    const results = count ? await this.find(options) : [];
    return [results, count];
  }
}
//# sourceMappingURL=full-data-repository.js.map
