/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Model } from '@nocobase/database';
export class TaskModel extends Model {
  id;
  origin;
  type;
  title;
  params;
  tags;
  status;
  progressTotal;
  progressCurrent;
  createdAt;
  startedAt;
  doneAt;
  createdById;
}
//# sourceMappingURL=task.js.map
