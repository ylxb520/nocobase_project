/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export default (app) => {
  app
    .command('db:auth')
    .option('-r, --retry [retry]')
    .action(async (opts) => {
      await app.db.auth({ retry: opts.retry || 10 });
    });
};
//# sourceMappingURL=db-auth.js.map
