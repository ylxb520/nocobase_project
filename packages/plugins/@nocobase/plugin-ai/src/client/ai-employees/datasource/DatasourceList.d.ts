/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { ContextItem } from '../types';
export type DatasourceListProps = {
  onSelect: (item: any) => void;
  contextItems?: ContextItem[];
  onAdd: (item: Omit<ContextItem, 'type'>) => void;
  onRemove: (uid: string) => void;
};
export declare const DatasourceList: React.FC<DatasourceListProps>;
