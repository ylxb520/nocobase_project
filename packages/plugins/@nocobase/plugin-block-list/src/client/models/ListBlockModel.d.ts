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
import { ListItemModel } from './ListItemModel';
type ListBlockModelStructure = {
  subModels: {
    item: ListItemModel;
    actions: ActionModel[];
  };
};
export declare class ListBlockModel extends CollectionBlockModel<ListBlockModelStructure> {
  static scene: import('@nocobase/client').BlockSceneType;
  _defaultCustomModelClasses: {
    CollectionActionGroupModel: string;
    RecordActionGroupModel: string;
    TableColumnModel: string;
    TableAssociationFieldGroupModel: string;
    TableCustomColumnModel: string;
  };
  get resource(): MultiRecordResource<any>;
  createResource(ctx: any, params: any): MultiRecordResource<unknown>;
  renderConfigureActions(): React.JSX.Element;
  pagination():
    | {
        current: number;
        pageSize: number;
        total: any;
        showTotal: (total: any) => any;
        showSizeChanger: boolean;
        onChange: (page: any, pageSize: any) => Promise<void>;
        simple?: undefined;
        showTitle?: undefined;
        hideOnSinglePage?: undefined;
        className?: undefined;
        itemRender?: undefined;
      }
    | {
        simple: boolean;
        showTitle: boolean;
        showSizeChanger: boolean;
        hideOnSinglePage: boolean;
        pageSize: number;
        total: number;
        className: string;
        itemRender: (_: any, type: any, originalElement: any) => any;
        current?: undefined;
        showTotal?: undefined;
        onChange?: undefined;
      };
  renderActions(): React.JSX.Element;
  renderComponent(): React.JSX.Element;
}
export {};
