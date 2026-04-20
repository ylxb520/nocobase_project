/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { importModule } from '@nocobase/utils';
import _ from 'lodash';
export class Migration {
  name;
  context;
  constructor(context) {
    this.context = context;
  }
  get db() {
    return this.context.db;
  }
  get sequelize() {
    return this.context.db.sequelize;
  }
  get queryInterface() {
    return this.context.db.sequelize.getQueryInterface();
  }
  async up() {
    // todo
  }
  async down() {
    // todo
  }
}
export class Migrations {
  items = [];
  context;
  constructor(context) {
    this.context = context;
  }
  clear() {
    this.items = [];
  }
  add(item) {
    const Migration = item.migration;
    if (Migration && typeof Migration === 'function') {
      const migration = new Migration({ ...this.context, ...item.context });
      migration.name = item.name;
      this.items.push(migration);
    } else {
      this.items.push(item);
    }
  }
  callback() {
    return async (ctx) => {
      return await Promise.all(
        _.sortBy(this.items, (item) => {
          const keys = item.name.split('/');
          return keys.pop() || item.name;
        }).map(async (item) => {
          if (typeof item.migration === 'string') {
            // use es module to import migration
            const Migration = await importModule(item.migration);
            const migration = new Migration({ ...this.context, ...item.context });
            migration.name = item.name;
            return migration;
          }
          return item;
        }),
      );
    };
  }
}
//# sourceMappingURL=migration.js.map
