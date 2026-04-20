/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/* istanbul ignore file -- @preserve */
import { Migration as DbMigration } from '@nocobase/database';
export class Migration extends DbMigration {
  appVersion = '';
  pluginVersion = '';
  on = 'afterLoad';
  get app() {
    return this.context.app;
  }
  get pm() {
    return this.context.app.pm;
  }
  get plugin() {
    return this.context.plugin;
  }
}
//# sourceMappingURL=migration.js.map
