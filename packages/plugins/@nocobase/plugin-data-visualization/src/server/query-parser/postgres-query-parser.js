/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { PostgresFormatter } from '../formatter/postgres-formatter';
import { QueryParser } from './query-parser';
export class PostgresQueryParser extends QueryParser {
  constructor(db) {
    super(db);
    this.formatter = new PostgresFormatter(db.sequelize);
  }
}
//# sourceMappingURL=postgres-query-parser.js.map
