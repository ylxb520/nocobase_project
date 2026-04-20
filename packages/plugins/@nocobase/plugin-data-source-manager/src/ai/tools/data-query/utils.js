/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/** 单个字符串字段最大长度 */
export const MAX_STRING_LENGTH = 500;
/** 单次查询最大记录数 */
export const MAX_QUERY_LIMIT = 100;
export function normalizeLimitOffset(args, options) {
  const defaultLimit = options?.defaultLimit ?? 50;
  const maxLimit = options?.maxLimit ?? MAX_QUERY_LIMIT;
  const rawLimit = typeof args.limit === 'number' && Number.isFinite(args.limit) ? args.limit : undefined;
  const rawOffset = typeof args.offset === 'number' && Number.isFinite(args.offset) ? args.offset : undefined;
  const limit = Math.min(Math.max(rawLimit ?? defaultLimit, 1), maxLimit);
  const offset = Math.max(rawOffset ?? 0, 0);
  return { limit, offset };
}
export function buildPagedToolResult(params) {
  const returned = params.records.length;
  const nextOffset = params.offset + returned;
  const hasMore = params.total > nextOffset;
  return {
    total: params.total,
    offset: params.offset,
    limit: params.limit,
    returned,
    hasMore,
    nextOffset,
    records: params.records,
  };
}
/**
 * 递归截断对象中的长字符串，保持 JSON 结构完整
 */
export function truncateLongStrings(obj, maxLen = MAX_STRING_LENGTH) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (typeof obj === 'string') {
    return obj.length > maxLen ? obj.slice(0, maxLen) + '...[truncated]' : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => truncateLongStrings(item, maxLen));
  }
  if (typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      result[key] = truncateLongStrings(obj[key], maxLen);
    }
    return result;
  }
  return obj;
}
//# sourceMappingURL=utils.js.map
