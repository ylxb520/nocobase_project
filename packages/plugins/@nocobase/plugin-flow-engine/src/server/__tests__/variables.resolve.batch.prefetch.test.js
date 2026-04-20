/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createMockServer } from '@nocobase/test';
import { resetVariablesRegistryForTest } from './test-utils';
describe('variables:resolve batch prefetch merges selects (integration)', () => {
    let app;
    beforeAll(() => {
        resetVariablesRegistryForTest();
    });
    const execResolve = async (values, userId) => {
        const action = app.resourceManager.getAction('variables', 'resolve');
        const ctx = {
            app,
            db: app.db,
            headers: {},
            request: { method: 'POST', path: '/api/variables:resolve', query: {}, body: values },
            auth: userId ? { user: { id: userId }, role: 'root' } : {},
            state: {},
            getCurrentLocale: () => 'en-US',
        };
        ctx.get = (name) => ctx.headers?.[name] || ctx.headers?.[name?.toLowerCase?.()] || undefined;
        ctx.throw = (status, body) => {
            throw { status, body };
        };
        action.mergeParams({ values });
        ctx.action = action;
        try {
            await action.execute(ctx, async () => { });
        }
        catch (e) {
            if (e && typeof e.status === 'number') {
                ctx.status = e.status;
                ctx.body = { error: e.body };
            }
            else {
                throw e;
            }
        }
        return ctx;
    };
    beforeAll(async () => {
        app = await createMockServer({
            plugins: ['error-handler', 'auth', 'users', 'acl', 'data-source-manager', 'field-sort', 'flow-engine'],
        });
    });
    afterAll(async () => {
        await app?.destroy();
    });
    it('merges fields/appends for same record and hits DB only once', async () => {
        // patch users repository to count findOne calls
        const ds = app.dataSourceManager.get('main');
        const cm = ds.collectionManager;
        const db = cm.db;
        const originalGetRepository = db.getRepository.bind(db);
        let calls = 0;
        db.getRepository = (collection) => {
            const repo = originalGetRepository(collection);
            if (collection === 'users') {
                const originalFindOne = repo.findOne.bind(repo);
                repo.findOne = async (opts) => {
                    calls += 1;
                    return await originalFindOne(opts);
                };
            }
            return repo;
        };
        const payload = {
            batch: [
                {
                    id: 't1',
                    template: { a: '{{ ctx.view.record.id }}' },
                    contextParams: { 'view.record': { dataSourceKey: 'main', collection: 'users', filterByTk: 1 } },
                },
                {
                    id: 't2',
                    template: { b: '{{ ctx.view.record.roles[0].name }}' },
                    contextParams: { 'view.record': { dataSourceKey: 'main', collection: 'users', filterByTk: 1 } },
                },
            ],
        };
        const res = await execResolve(payload, 1);
        const results = res.body?.results || [];
        const r1 = results.find((r) => r.id === 't1');
        const r2 = results.find((r) => r.id === 't2');
        expect(r1?.data?.a).toBe(1);
        expect(typeof r2?.data?.b).toBe('string');
        expect((r2?.data?.b || '').length).toBeGreaterThan(0);
        // ensure only one DB call for users collection due to prefetch merge
        expect(calls).toBe(1);
    });
});
//# sourceMappingURL=variables.resolve.batch.prefetch.test.js.map