/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DatabaseDataSource } from './database-data-source';
import { SequelizeCollectionManager } from './sequelize-collection-manager';
export class SequelizeDataSource extends DatabaseDataSource {
  constructor(options) {
    super(options);
    this.introspector = this.createDatabaseIntrospector(this.collectionManager.db);
  }
  createCollectionManager(options) {
    return new SequelizeCollectionManager(options.collectionManager);
  }
  async readTables() {
    return;
  }
  async loadTables(ctx, tables) {
    return;
  }
}
//# sourceMappingURL=sequelize-data-source.js.map
