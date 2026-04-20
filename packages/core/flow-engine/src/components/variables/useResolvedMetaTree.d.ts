/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { MetaTreeNode } from '../../flowContext';
export interface UseResolvedMetaTreeResult {
  resolvedMetaTree: MetaTreeNode[] | undefined;
  loading: boolean;
  error: Error | null;
}
/**
 * 通用 hook 用于处理异步/同步 metaTree
 * 统一处理 metaTree 为函数（同步/异步）或数组的情况
 */
export declare const useResolvedMetaTree: (
  metaTree?: MetaTreeNode[] | (() => MetaTreeNode[] | Promise<MetaTreeNode[]>),
) => UseResolvedMetaTreeResult;
