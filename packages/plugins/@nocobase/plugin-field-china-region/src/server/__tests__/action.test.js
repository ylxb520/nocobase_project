/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createMockServer } from '@nocobase/test';
describe('actions test', () => {
  let app;
  let db;
  beforeEach(async () => {
    app = await createMockServer({
      plugins: ['field-china-region'],
    });
    db = app.db;
  });
  afterEach(async () => {
    await app.destroy();
  });
  it('should only call list action on chinaRegions resource', async () => {
    const listResponse = await app.agent().resource('chinaRegions').list();
    expect(listResponse.statusCode).toEqual(200);
    const createResponse = await app.agent().resource('chinaRegions').create();
    expect(createResponse.statusCode).toEqual(404);
  });
});
//# sourceMappingURL=action.test.js.map
