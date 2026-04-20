import { createApp } from '../index';
import Migrator from '../../migrations/20250123000001-remove-schema-options';
describe.runIf(process.env.DB_DIALECT === 'postgres')('remove schema options', () => {
  let app;
  let db;
  beforeEach(async () => {
    app = await createApp({});
    db = app.db;
  });
  afterEach(async () => {
    await app.destroy();
  });
  it('should remove schema options', async () => {
    await db.getRepository('collections').create({
      values: {
        name: 'test',
        from: 'db2cm',
        schema: db.options.schema || 'public',
      },
    });
    const migration = new Migrator({ db });
    migration.context.app = app;
    await migration.up();
    const collection = await db.getRepository('collections').findOne({
      filter: {
        'options.from': 'db2cm',
      },
    });
    expect(collection?.get('schema')).toBeUndefined();
  });
});
//# sourceMappingURL=remove-schema-options.test.js.map
