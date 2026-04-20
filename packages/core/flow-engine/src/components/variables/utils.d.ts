/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { MetaTreeNode } from '../../flowContext';
import type { ContextSelectorItem, Converters } from './types';
export declare const parseValueToPath: (value: string) => string[] | undefined;
export declare const formatPathToValue: (item: MetaTreeNode) => string;
export declare const loadMetaTreeChildren: (metaNode: MetaTreeNode) => Promise<MetaTreeNode[]>;
export declare const searchInLoadedNodes: (
  options: ContextSelectorItem[],
  searchText: string,
  parentPaths?: string[],
) => ContextSelectorItem[];
/**
 * 仅在“已加载节点”范围内按关键字过滤 options（保留树结构）。
 * - 匹配父节点：保留原节点引用（含原 children），避免不必要的实体重建。
 * - 匹配子节点：返回裁剪后的父节点副本，children 仅包含命中分支。
 * - 未加载 children（即 children 不为数组）不会递归搜索。
 */
export declare const filterLoadedContextSelectorItems: (
  options: ContextSelectorItem[] | undefined,
  keyword: string,
) => ContextSelectorItem[];
export declare const buildContextSelectorItems: (metaTree: MetaTreeNode[]) => ContextSelectorItem[];
/**
 * 预加载：根据路径逐级加载 ContextSelectorItem 的 children，保证打开时已展开对应层级。
 */
export declare const preloadContextSelectorPath: (
  options: ContextSelectorItem[] | undefined,
  pathSegments: (string | number)[],
  triggerUpdate?: () => void,
) => Promise<void>;
export declare const isVariableValue: (value: any) => boolean;
export declare const createDefaultConverters: () => Converters;
export declare const createFinalConverters: (propConverters?: Converters) => Converters;
