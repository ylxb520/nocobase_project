/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
export interface VirtualListRef {
  scrollTo: (
    arg:
      | number
      | {
          index?: number;
          key?: React.Key;
          align?: 'top' | 'bottom' | 'auto';
          offset?: number;
        },
  ) => void;
}
export interface VirtualListProps<T> {
  data: T[];
  itemKey: string | ((item: T) => React.Key);
  itemHeight?: number;
  children: (
    item: T,
    index: number,
    props: {
      style?: React.CSSProperties;
    },
  ) => React.ReactNode;
}
export declare const VirtualList: <T>(
  props: VirtualListProps<T> & {
    ref?: React.Ref<VirtualListRef>;
  },
) => React.ReactElement;
