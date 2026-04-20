/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createMockServer } from '@nocobase/test';
describe('cli', () => {
  let app;
  beforeEach(async () => {
    app = await createMockServer({
      plugins: ['nocobase', 'backup-restore'],
    });
  });
  afterEach(async () => {
    await app.destroy();
  });
  test('find', async () => {
    try {
      await app.runCommand('restore');
    } catch (error) {
      // skip
    }
    const command = app.findCommand('restore');
    expect(command).toBeDefined();
  });
});
//# sourceMappingURL=cli.test.js.map
