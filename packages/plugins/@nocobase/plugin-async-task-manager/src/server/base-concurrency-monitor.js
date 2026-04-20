/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class BaseConcurrencyMonitor {
  _concurrency;
  constructor(_concurrency) {
    this._concurrency = _concurrency;
  }
  taskIds = new Set();
  idle() {
    return this.taskIds.size < this.concurrency;
  }
  get concurrency() {
    return this._concurrency;
  }
  set concurrency(concurrency) {
    this._concurrency = concurrency;
  }
  increase(taskId) {
    if (this.taskIds.has(taskId)) {
      return true;
    }
    if (this.taskIds.size + 1 > this.concurrency) {
      return false;
    }
    this.taskIds.add(taskId);
    return true;
  }
  decrease(taskId) {
    this.taskIds.delete(taskId);
  }
}
//# sourceMappingURL=base-concurrency-monitor.js.map
