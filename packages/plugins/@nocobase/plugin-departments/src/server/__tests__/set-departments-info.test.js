/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createMockServer } from '@nocobase/test';
import { setDepartmentsInfo } from '../middlewares';
describe('set departments info', () => {
  let app;
  let db;
  let repo;
  let agent;
  let ctx;
  beforeAll(async () => {
    app = await createMockServer({
      plugins: ['error-handler', 'field-sort', 'users', 'departments', 'acl', 'data-source-manager'],
    });
    db = app.db;
    repo = db.getRepository('departments');
    agent = app.agent();
    ctx = {
      db,
      cache: app.cache,
      state: {},
    };
  });
  afterAll(async () => {
    await app.destroy();
  });
  afterEach(async () => {
    await repo.destroy({ truncate: true });
  });
  it('should set departments roles', async () => {
    const user = await db.getRepository('users').findOne();
    ctx.state.currentUser = await db.getRepository('users').findOne({
      filterByTk: user.id,
    });
    const role = await db.getRepository('roles').create({
      values: {
        name: 'test-role',
        title: 'Test role',
      },
    });
    await repo.create({
      values: {
        title: 'Department',
        roles: [role.name],
        members: [user.id],
      },
    });
    await setDepartmentsInfo(ctx, async () => {});
    expect(ctx.state.attachRoles.length).toBe(1);
    expect(ctx.state.attachRoles[0].name).toBe('test-role');
  });
});
//# sourceMappingURL=set-departments-info.test.js.map
