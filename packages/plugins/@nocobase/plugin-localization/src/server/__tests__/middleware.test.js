/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createMockServer } from '@nocobase/test';
describe('middleware', () => {
    let app;
    let agent;
    let plugin;
    beforeEach(async () => {
        app = await createMockServer({
            plugins: ['localization', 'client', 'ui-schema-storage', 'system-settings', 'field-sort'],
        });
        await app.localeManager.load();
        agent = app.agent();
        plugin = app.pm.get('localization');
    });
    afterEach(async () => {
        await app.destroy();
    });
    it('should merge resources', async () => {
        vi.spyOn(plugin.resources, 'getResources').mockResolvedValue({
            'test-resource': {
                'test-text': 'text Translation',
            },
        });
        const res = await agent.resource('app').getLang();
        const data = JSON.parse(res.text);
        const resources = data.data.resources;
        expect(resources['test-resource']).toBeDefined();
        expect(resources['test-resource']['test-text']).toBe('text Translation');
    });
});
//# sourceMappingURL=middleware.test.js.map