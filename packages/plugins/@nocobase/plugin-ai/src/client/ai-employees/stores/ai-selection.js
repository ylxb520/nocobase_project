/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { model } from '@formily/reactive';
export const aiSelection = model({
  selectable: '',
  selector: null,
  startSelect(selectType, selector) {
    this.selectable = selectType;
    this.selector = selector;
  },
  stopSelect() {
    this.selectable = '';
    this.selector = null;
  },
});
//# sourceMappingURL=ai-selection.js.map
