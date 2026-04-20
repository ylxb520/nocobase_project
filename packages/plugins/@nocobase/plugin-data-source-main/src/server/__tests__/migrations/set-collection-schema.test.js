/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { isPg } from '@nocobase/test';
import Migrator from '../../migrations/20230918024546-set-collection-schema';
import { createApp } from '../index';
const pgOnly = () => (isPg() ? describe : describe.skip);
pgOnly()('set collection schema', () => {
  let app;
  let db;
  beforeEach(async () => {
    app = await createApp({});
    db = app.db;
  });
  afterEach(async () => {
    await app.destroy();
  });
  it('should set collection schema', async () => {
    const collection = await db.getRepository('collections').create({
      values: {
        name: 'testCollection',
      },
    });
    await collection.set('schema', undefined);
    await collection.save();
    expect(collection.options.schema).toBeUndefined();
    const migration = new Migrator({ db });
    migration.context.app = app;
    await migration.up();
    const collection2 = await db.getRepository('collections').findOne({});
    expect(collection2.options.schema).toEqual(
      process.env.COLLECTION_MANAGER_SCHEMA || app.db.options.schema || 'public',
    );
  });
});
//# sourceMappingURL=set-collection-schema.test.js.map
