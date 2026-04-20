/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { Collection } from '../../data-source';
import { FlowModelContext } from '../../flowContext';
import { ModelConstructor } from '../../types';
import { SubModelItem } from './AddSubModelButton';
export declare function buildSubModelItem(
  M: ModelConstructor,
  ctx: FlowModelContext,
  skipHide?: boolean,
): Promise<SubModelItem | undefined>;
export declare function buildItems(
  subModelBaseClass: string | ModelConstructor,
): (ctx: FlowModelContext) => Promise<any>;
export declare function buildSubModelItems(
  subModelBaseClass: string | ModelConstructor,
  exclude?: any[],
): (ctx: FlowModelContext) => Promise<SubModelItem[]>;
export declare function buildSubModelGroups(
  subModelBaseClasses?: (string | ModelConstructor)[],
): (ctx: FlowModelContext) => Promise<SubModelItem[]>;
export interface BuildFieldChildrenOptions {
  useModel: string;
  fieldUseModel?: string | ((field: any) => string);
  collection?: Collection;
  associationPathName?: string;
  /**
   * 点击这些子项后，除自身路径外，还需要联动刷新的其他菜单路径前缀
   */
  refreshTargets?: string[];
}
export declare function buildWrapperFieldChildren(
  ctx: FlowModelContext,
  options: BuildFieldChildrenOptions,
): {
  key: string;
  label: string;
  type: 'group';
  searchable: boolean;
  searchPlaceholder: any;
  children: SubModelItem[];
}[];
