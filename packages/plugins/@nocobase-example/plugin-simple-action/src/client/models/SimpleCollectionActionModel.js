/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionModel, ActionSceneEnum } from '@nocobase/client';
import { tExpr } from '../locale';
export class SimpleCollectionActionModel extends ActionModel {
  static scene = ActionSceneEnum.collection;
  defaultProps = {
    children: tExpr('Simple collection action'),
  };
}
SimpleCollectionActionModel.define({
  label: tExpr('Simple collection action'),
});
//# sourceMappingURL=SimpleCollectionActionModel.js.map
