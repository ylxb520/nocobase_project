/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
export declare const getCollectionState: (
  dm: any,
  t: any,
  dataSourceKey: any,
  displayType?: boolean,
) => {
  getEnableFieldTree: (collectionName: string) => {
    role: string;
    title: React.FunctionComponentElement<any>;
    key: any;
    isLeaf: boolean;
    field: any;
    type: string;
    tag: any;
  }[];
  getOnLoadData: (dataSource: any, setDataSource: any) => (node: any) => Promise<unknown>;
  getOnCheck: (fields: any) => (checkedKeys: any) => void;
};
export declare const getSyncFromForm: (
  dm: any,
  t: any,
  dataSourceKey: any,
  collectionName: any,
  callBack: any,
) => {
  run(model: any): Promise<void>;
};
