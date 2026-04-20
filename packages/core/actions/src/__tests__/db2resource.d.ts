/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import Database from '@nocobase/database';
import { ResourcerContext } from '@nocobase/resourcer';
export declare function db2resource(
  ctx: ResourcerContext & {
    db: Database;
  },
  next: () => Promise<any>,
): Promise<any>;
export default db2resource;
