/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DropdownProps } from 'antd';
import React from 'react';
export type Item = {
  key?: string;
  type?: 'group' | 'divider';
  label?: React.ReactNode;
  children?: Item[] | (() => Item[] | Promise<Item[]>);
  searchable?: boolean;
  searchPlaceholder?: string;
  keepDropdownOpen?: boolean;
  /**
   * 开关状态标记（内部使用）
   */
  isToggled?: boolean;
  /**
   * 原始菜单项数据（内部使用）
   */
  originalItem?: any;
  /**
   * 是否为唯一项标记（内部使用）
   */
  unique?: boolean;
  [key: string]: any;
};
export type ItemsType = Item[] | (() => Item[] | Promise<Item[]>);
interface LazyDropdownMenuProps extends Omit<DropdownProps['menu'], 'items'> {
  items: ItemsType;
  keepDropdownOpen?: boolean;
  /**
   * 在父节点短暂重建（卸载/重挂载）时用于恢复打开状态的持久键。
   * 不需要手动传入，调用方（如 AddSubModelButton）会自动生成。
   */
  persistKey?: string;
  /**
   * 仅用于“状态刷新”的版本号。变化时会重新计算根 items，
   * 但不会清空已加载的 children，避免 UI 闪烁。
   */
  stateVersion?: number;
  /**
   * 额外刷新目标（多路径）：每条路径的祖先都会被刷新
   */
  refreshKeys?: string[];
}
declare const LazyDropdown: React.FC<
  Omit<DropdownProps, 'menu'> & {
    menu: LazyDropdownMenuProps;
  }
>;
export default LazyDropdown;
