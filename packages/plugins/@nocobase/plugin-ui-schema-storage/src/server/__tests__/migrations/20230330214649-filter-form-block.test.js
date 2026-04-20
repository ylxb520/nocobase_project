/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import Migration from '../../migrations/20230330214649-filter-form-block';
import { createMockServer } from '@nocobase/test';
describe.skip('migration-20230330214649-filter-form-block', () => {
    let app;
    let db;
    let uiSchemaRepository;
    afterEach(async () => {
        await app.destroy();
    });
    beforeEach(async () => {
        app = await createMockServer({
            registerActions: true,
            plugins: ['ui-schema-storage'],
        });
        db = app.db;
        uiSchemaRepository = db.getCollection('uiSchemas').repository;
    });
    test('update x-decorator', async () => {
        await uiSchemaRepository.create({
            values: {
                'x-uid': '78bijc1kw1q',
                name: 'xbixv9hl42i',
                schema: {
                    type: 'void',
                    'x-decorator': 'FormBlockProvider',
                    'x-decorator-props': { resource: 'tt_org', collection: 'tt_org' },
                    'x-designer': 'FormV2.FilterDesigner',
                    'x-component': 'CardItem',
                    'x-filter-targets': [],
                    'x-filter-operators': {},
                },
            },
        });
        const migration = new Migration({ db: app.db });
        migration.context.app = {
            version: {
                satisfies: async (v) => true,
            },
        };
        await migration.up();
        const instance = await uiSchemaRepository.findById('78bijc1kw1q');
        expect(instance.schema['x-decorator']).toBe('FilterFormBlockProvider');
    });
});
//# sourceMappingURL=20230330214649-filter-form-block.test.js.map