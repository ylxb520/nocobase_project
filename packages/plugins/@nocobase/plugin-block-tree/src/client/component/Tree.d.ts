/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { FC } from 'react';
import type { TreeProps as AntdTreeProps } from 'antd';
import type { BasicDataNode, DataNode } from 'rc-tree/lib/interface';
export interface FilterComponentProps {
  value: any;
  onChange: (value: any) => void;
}
export interface TreeProps<T extends BasicDataNode = DataNode> extends AntdTreeProps<T> {
  /**
   * @default true
   */
  searchable?: boolean;
  onSearch?: (value: string) => void;
  loading?: boolean;
  FilterComponent?: React.ComponentType<FilterComponentProps>;
}
export declare const Tree: FC<TreeProps>;
