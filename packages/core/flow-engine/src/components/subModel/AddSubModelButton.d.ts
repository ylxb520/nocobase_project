/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowModelContext } from '../../flowContext';
import { FlowModel } from '../../models';
import { CreateModelOptions, ModelConstructor } from '../../types';
import { ItemsType } from './LazyDropdown';
type CreateModelOptionsStringUse = Omit<CreateModelOptions, 'use'> & {
  use?: string;
};
type CreateModelOptionsFn = (
  ctx: FlowModelContext,
  extra?: any,
) => CreateModelOptionsStringUse | Promise<CreateModelOptionsStringUse>;
type HideOrFactory = boolean | ((ctx: FlowModelContext) => boolean | Promise<boolean>);
export interface SubModelItem {
  key?: string;
  label?: string | React.ReactNode;
  type?: 'group' | 'divider';
  disabled?: boolean;
  /**
   * 动态隐藏菜单项（支持异步）。与模型 meta.hide 语义一致。
   * - `true` 表示隐藏
   * - function(ctx) 返回 true 表示隐藏
   */
  hide?: HideOrFactory;
  icon?: React.ReactNode;
  children?: false | SubModelItemsType;
  createModelOptions?: CreateModelOptionsStringUse | CreateModelOptionsFn;
  searchable?: boolean;
  searchPlaceholder?: string;
  keepDropdownOpen?: boolean;
  toggleable?: boolean | ((model: FlowModel) => boolean);
  useModel?: string;
  sort?: number;
  toggleDetector?: (ctx: FlowModelContext) => boolean | Promise<boolean>;
  customRemove?: (ctx: FlowModelContext, item: SubModelItem) => Promise<void>;
  refreshTargets?: string[];
}
export type SubModelItemsType = SubModelItem[] | ((ctx: FlowModelContext) => SubModelItem[] | Promise<SubModelItem[]>);
export interface MergeSubModelItemsOptions {
  addDividers?: boolean;
}
interface AddSubModelButtonProps {
  model: FlowModel;
  items?: SubModelItemsType;
  subModelBaseClass?: string | ModelConstructor;
  subModelBaseClasses?: Array<string | ModelConstructor>;
  subModelType?: 'object' | 'array';
  subModelKey: string;
  afterSubModelInit?: (subModel: FlowModel) => Promise<void>;
  afterSubModelAdd?: (subModel: FlowModel) => Promise<void>;
  afterSubModelRemove?: (subModel: FlowModel) => Promise<void>;
  children?: React.ReactNode;
  keepDropdownOpen?: boolean;
}
/**
 * 合并多个不同来源的 SubModelItemsType 成一个
 */
export declare function mergeSubModelItems(
  sources: (SubModelItemsType | undefined | null)[],
  options?: MergeSubModelItemsOptions,
): SubModelItemsType;
/**
 * 转换 SubModelItemsType 到 LazyDropdown 的 ItemsType 格式
 */
export declare const transformItems: (
  items: SubModelItemsType,
  model: FlowModel,
  subModelKey: string,
  subModelType: string,
) => ItemsType;
export declare const AddSubModelButton: React.MemoExoticComponent<
  import('@formily/reactive-react').ReactFC<AddSubModelButtonProps>
>;
export {};
