/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { buildSubModelItems, tExpr } from '@nocobase/flow-engine';
import { DataBlockModel, BlockModel } from '@nocobase/client';
export class BulkEditDataBlockModel extends DataBlockModel {}
BulkEditDataBlockModel.define({
  hide: true,
  label: tExpr('Data blocks'),
  async children(ctx) {
    const children = await buildSubModelItems(DataBlockModel)(ctx);
    const { scene } = ctx.view.inputArgs;
    return children.filter((item) => {
      if (item.useModel === 'BulkEditFormModel') {
        return true;
      }
      const M = ctx.engine.getModelClass(item.useModel);
      if (scene === 'bulkEditForm') {
        return M['_isScene']?.('bulkEditForm');
      }
      return false;
    });
  },
});
export class BulkEditBlockModel extends BlockModel {}
BulkEditBlockModel.define({
  hide: true,
  label: tExpr('Data blocks'),
  async children(ctx) {
    const children = await buildSubModelItems(BlockModel)(ctx);
    return children.filter((item) => {
      return item.useModel === 'MarkdownBlockModel';
    });
  },
});
//# sourceMappingURL=BulkEditDataBlockModel.js.map
