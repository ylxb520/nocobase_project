/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BlockModel } from '@nocobase/client';
import React from 'react';
export declare class NestedSub1BlockModel extends BlockModel {
  renderComponent(): React.JSX.Element;
}
export declare class NestedSub2BlockModel extends BlockModel {
  renderComponent(): React.JSX.Element;
}
export declare class NestedBlockModel extends BlockModel {
  static defineChildren(ctx: any): Promise<import('../../../../../../core/flow-engine/src').SubModelItem[]>;
}
