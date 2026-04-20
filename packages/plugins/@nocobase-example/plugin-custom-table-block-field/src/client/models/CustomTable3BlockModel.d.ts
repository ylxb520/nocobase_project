/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ClickableFieldModel, TableBlockModel, TableColumnModel } from '@nocobase/client';
import React from 'react';
export declare class CustomTable3BlockModel extends TableBlockModel {
  customModelClasses: {
    TableColumnModel: string;
    TableAssociationFieldGroupModel: any;
  };
}
export declare class CustomTable3ColumnModel extends TableColumnModel {}
export declare class CustomTable3NicknameFieldModel extends ClickableFieldModel {
  renderComponent(value: any): React.JSX.Element;
}
