/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CollectionManager, DataSource } from '@nocobase/data-source-manager';
class MockRepository {
  count(options) {
    return Promise.resolve(0);
  }
  findAndCount(options) {
    return Promise.resolve([[], 0]);
  }
  async find() {
    return [];
  }
  async findOne() {
    return {};
  }
  async create() {}
  async update() {}
  async destroy() {}
}
class MockCollectionManager extends CollectionManager {
  getRepository(name, sourceId) {
    return new MockRepository();
  }
}
export class MockDataSource extends DataSource {
  async load() {
    this.collectionManager.defineCollection({
      name: 'posts',
      fields: [
        {
          type: 'string',
          name: 'title',
        },
        {
          type: 'hasMany',
          name: 'comments',
        },
      ],
    });
    this.collectionManager.defineCollection({
      name: 'comments',
      fields: [
        {
          type: 'string',
          name: 'content',
        },
      ],
    });
  }
  createCollectionManager(options) {
    return new MockCollectionManager();
  }
}
//# sourceMappingURL=mock-data-source.js.map
