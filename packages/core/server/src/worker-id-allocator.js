/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class WorkerIdAllocator {
  adapter;
  setAdapter(adapter) {
    this.adapter = adapter;
  }
  async getWorkerId() {
    if (this.adapter) {
      return this.adapter.getWorkerId();
    }
    return Math.floor(Math.random() * 32);
  }
  async release() {
    if (this.adapter) {
      return this.adapter.release();
    }
    return;
  }
}
//# sourceMappingURL=worker-id-allocator.js.map
