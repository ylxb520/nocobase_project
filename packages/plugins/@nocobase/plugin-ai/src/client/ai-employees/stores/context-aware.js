/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { model } from '@formily/reactive';
export const contextAware = model({
  aiEmployees: [],
  showed: [],
  setAIEmployees(aiEmployees) {
    this.aiEmployees = aiEmployees;
  },
  isShowed(uid) {
    return this.showed.includes(uid);
  },
  addShowed(uid) {
    this.showed.push(uid);
  },
  clearShowed() {
    this.showed = [];
  },
});
//# sourceMappingURL=context-aware.js.map
