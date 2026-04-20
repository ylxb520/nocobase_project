/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class LoadAndRegister {
  ai;
  options;
  constructor(ai, options) {
    this.ai = ai;
    this.options = options;
  }
  async load() {
    await this.scan();
    await this.import();
    await this.register();
  }
}
//# sourceMappingURL=types.js.map
