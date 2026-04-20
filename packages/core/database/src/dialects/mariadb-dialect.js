/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BaseDialect } from './base-dialect';
export class MariadbDialect extends BaseDialect {
  static dialectName = 'mariadb';
  getSequelizeOptions(options) {
    options.dialectOptions = {
      ...(options.dialectOptions || {}),
      multipleStatements: true,
      supportBigNumbers: true,
      bigNumberStrings: true,
    };
    return options;
  }
  getVersionGuard() {
    return {
      sql: 'select version() as version',
      get: (v) => {
        const m = /([\d+.]+)/.exec(v);
        return m[0];
      },
      version: '>=10.9',
    };
  }
}
//# sourceMappingURL=mariadb-dialect.js.map
