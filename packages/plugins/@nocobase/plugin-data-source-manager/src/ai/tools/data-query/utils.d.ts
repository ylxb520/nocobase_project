/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/** 单个字符串字段最大长度 */
export declare const MAX_STRING_LENGTH = 500;
/** 单次查询最大记录数 */
export declare const MAX_QUERY_LIMIT = 100;
export declare function normalizeLimitOffset(
  args: {
    limit?: unknown;
    offset?: unknown;
  },
  options?: {
    defaultLimit?: number;
    maxLimit?: number;
  },
): {
  limit: number;
  offset: number;
};
export declare function buildPagedToolResult<T>(params: {
  total: number;
  offset: number;
  limit: number;
  records: T[];
}): {
  total: number;
  offset: number;
  limit: number;
  returned: number;
  hasMore: boolean;
  nextOffset: number;
  records: T[];
};
/**
 * 递归截断对象中的长字符串，保持 JSON 结构完整
 */
export declare function truncateLongStrings(obj: any, maxLen?: number): any;
