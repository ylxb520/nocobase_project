/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export function pageArgsToLimitArgs(page, pageSize) {
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };
}
//# sourceMappingURL=utils.js.map
