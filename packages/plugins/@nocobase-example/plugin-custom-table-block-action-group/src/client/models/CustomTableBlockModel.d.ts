/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionGroupModel, ActionModel, TableBlockModel } from '@nocobase/client';
export declare class CustomActionGroupTableBlockModel extends TableBlockModel {
  customModelClasses: {
    CollectionActionGroupModel: string;
    RecordActionGroupModel: string;
  };
}
export declare class CustomActionGroupTableCollectionActionGroupModel extends ActionGroupModel {}
export declare class CustomActionGroupTableRecordActionGroupModel extends ActionGroupModel {}
export declare class CustomActionGroupTableAction1Model extends ActionModel {}
export declare class CustomActionGroupTableAction2Model extends ActionModel {}
