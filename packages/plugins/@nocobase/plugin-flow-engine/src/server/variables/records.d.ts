/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
type FilterTargetKey = string | string[] | undefined;
/**
 * 为了：
 * - 关联加载/缓存：fields 模式下确保包含主键
 * - filterByTk 为数组时：尽量包含 filterTargetKey，以便按输入顺序对齐结果
 *
 * 该函数只返回“建议追加”的 key 字段（不会决定是否追加，由调用方根据是否启用 fields 决定）。
 */
export declare function getExtraKeyFieldsForSelect(filterByTk: unknown, options: {
    filterTargetKey?: FilterTargetKey;
    pkAttr?: string;
    pkIsValid?: boolean;
    rawAttributes?: Record<string, unknown>;
}): string[];
export declare function mergeFieldsWithExtras(fields?: string[], extras?: string[]): string[] | undefined;
/**
 * 根据 filterByTk 类型（单值/数组）查询并返回 JSON 数据：
 * - 单值：返回 object | undefined
 * - 数组：返回 array（空数组时返回 []，不会退化为无条件查询）
 */
export declare function fetchRecordOrRecordsJson(repo: any, params: {
    filterByTk: unknown;
    preferFullRecord?: boolean;
    fields?: string[];
    appends?: string[];
    filterTargetKey?: FilterTargetKey;
    pkAttr?: string;
    pkIsValid?: boolean;
}): Promise<unknown>;
export {};
