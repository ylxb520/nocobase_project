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
    .command('migrator')
    .preload()
    .action(async (opts) => {
      console.log('migrating...');
      await app.emitAsync('cli.beforeMigrator', opts);
      await app.db.migrator.runAsCLI(process.argv.slice(3));
      await app.stop();
    });
};
//# sourceMappingURL=migrator.js.map
