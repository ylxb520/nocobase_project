/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createMockServer } from '@nocobase/test';
describe('destroy department check', () => {
  let app;
  let db;
  let repo;
  let agent;
  beforeAll(async () => {
    app = await createMockServer({
      plugins: ['error-handler', 'field-sort', 'users', 'departments'],
    });
    db = app.db;
    repo = db.getRepository('departments');
    agent = app.agent();
  });
  afterAll(async () => {
    await app.destroy();
  });
  afterEach(async () => {
    await repo.destroy({ truncate: true });
  });
  it('should check if it has sub departments', async () => {
    const dept = await repo.create({
      values: {
        title: 'Department',
        children: [{ title: 'Sub department' }],
      },
    });
    const res = await agent.resource('departments').destroy({
      filterByTk: dept.id,
    });
    expect(res.status).toBe(400);
  });
  it('should check if it has members', async () => {
    const dept = await repo.create({
      values: {
        title: 'Department',
        members: [1],
      },
    });
    const res = await agent.resource('departments').destroy({
      filterByTk: dept.id,
    });
    expect(res.status).toBe(400);
  });
});
//# sourceMappingURL=destroy-department-check.test.js.map
