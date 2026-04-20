/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { MultiRecordResource } from '@nocobase/flow-engine';
import { CollectionBlockModel, ActionModel } from '@nocobase/client';
import React from 'react';
import { GridCardItemModel } from './GridCardItemModel';
type GridBlockModelStructure = {
  subModels: {
    item: GridCardItemModel;
    actions: ActionModel[];
  };
};
export declare class GridCardBlockModel extends CollectionBlockModel<GridBlockModelStructure> {
  static scene: import('@nocobase/client').BlockSceneType;
  _screens: any;
  _defaultCustomModelClasses: {
    CollectionActionGroupModel: string;
    RecordActionGroupModel: string;
    TableColumnModel: string;
    TableAssociationFieldGroupModel: string;
    TableCustomColumnModel: string;
  };
  get resource(): MultiRecordResource<any>;
  useHooksBeforeRender(): void;
  createResource(ctx: any, params: any): MultiRecordResource<unknown>;
  renderConfiguireActions(): React.JSX.Element;
  pagination(): import('antd').PaginationProps;
  renderComponent(): React.JSX.Element;
}
export {};
