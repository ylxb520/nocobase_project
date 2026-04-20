/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { model } from '@formily/reactive';
export const dialogController = model({
  shouldHide: false,
  hide() {
    this.shouldHide = true;
  },
  resume() {
    this.shouldHide = false;
  },
});
//# sourceMappingURL=dialog-controller.js.map
