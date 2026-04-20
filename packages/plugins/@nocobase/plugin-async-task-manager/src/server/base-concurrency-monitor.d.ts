/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { TaskId } from '../common/types';
import { ConcurrencyMonitor } from './interfaces/concurrency-monitor';
export declare class BaseConcurrencyMonitor implements ConcurrencyMonitor {
  private _concurrency;
  constructor(_concurrency: number);
  private taskIds;
  idle(): boolean;
  get concurrency(): number;
  set concurrency(concurrency: number);
  increase(taskId: TaskId): boolean;
  decrease(taskId: TaskId): void;
}
