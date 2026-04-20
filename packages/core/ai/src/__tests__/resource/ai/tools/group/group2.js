/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { defineTools } from '@nocobase/ai';
export default defineTools({
  scope: 'GENERAL',
  definition: {
    name: 'group2',
    description: 'hallow group2',
    schema: null,
  },
  invoke: async (ctx, args, id) => {
    return { status: 'success' };
  },
});
//# sourceMappingURL=group2.js.map
