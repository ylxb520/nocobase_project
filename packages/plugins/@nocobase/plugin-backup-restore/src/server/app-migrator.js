/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { applyMixins, AsyncEmitter } from '@nocobase/utils';
import crypto from 'crypto';
import EventEmitter from 'events';
import fsPromises from 'fs/promises';
import * as os from 'os';
import path from 'path';
class AppMigrator extends EventEmitter {
  workDir;
  app;
  constructor(app, options) {
    super();
    this.app = app;
    this.workDir = options?.workDir || this.tmpDir();
  }
  tmpDir() {
    return path.resolve(os.tmpdir(), `nocobase-${crypto.randomUUID()}`);
  }
  async rmDir(dir) {
    await fsPromises.rm(dir, { recursive: true, force: true });
  }
  async clearWorkDir() {
    await this.rmDir(this.workDir);
  }
}
applyMixins(AppMigrator, [AsyncEmitter]);
export { AppMigrator };
//# sourceMappingURL=app-migrator.js.map
