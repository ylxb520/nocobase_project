/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowModel } from '@nocobase/flow-engine';
import React from 'react';
import { DetailsGridModel, ActionModel } from '@nocobase/client';
type ListItemModelStructure = {
  subModels: {
    grid: DetailsGridModel;
    actions: ActionModel[];
  };
};
export declare class ListItemModel extends FlowModel<ListItemModelStructure> {
  onInit(options: any): void;
  renderConfigureAction(): React.JSX.Element;
  render(): React.JSX.Element;
}
export {};
