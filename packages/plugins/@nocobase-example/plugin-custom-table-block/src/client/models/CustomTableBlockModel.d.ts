/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import {
  CollectionActionGroupModel,
  RecordActionGroupModel,
  TableAssociationFieldGroupModel,
  TableBlockModel,
  TableColumnModel,
} from '@nocobase/client';
export declare class CustomTableBlockModel extends TableBlockModel {
  customModelClasses: {
    CollectionActionGroupModel: string;
    RecordActionGroupModel: string;
    TableColumnModel: string;
    TableAssociationFieldGroupModel: any;
  };
}
export declare class CustomTableCollectionActionGroupModel extends CollectionActionGroupModel {}
export declare class CustomTableRecordActionGroupModel extends RecordActionGroupModel {}
export declare class CustomTableColumnModel extends TableColumnModel {}
export declare class CustomTableAssociationFieldGroupModel extends TableAssociationFieldGroupModel {}
