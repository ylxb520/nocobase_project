/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ChildPageTabModel, BlockGridModel } from '@nocobase/client';
import React from 'react';
export declare class BulkEditBlockGridModel extends BlockGridModel {
  onInit(options: any): void;
  get subModelBaseClasses(): string[];
}
export declare class BulkEditChildPageTabModel extends ChildPageTabModel {
  renderChildren(): React.JSX.Element;
}
