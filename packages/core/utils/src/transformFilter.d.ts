/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * 过滤器条件项接口
 */
export interface FilterCondition {
  /** 字段名 */
  path: string;
  /** 值 */
  value: any;
  /** 操作符 */
  operator: string;
}
/**
 * 过滤器分组接口
 */
export interface FilterGroupType {
  /** 逻辑操作符 */
  logic: '$and' | '$or';
  /** 条件项数组 */
  items: (FilterCondition | FilterGroupType)[];
}
/**
 * 查询条件对象类型
 */
export type QueryCondition = {
  [field: string]: {
    [operator: string]: any;
  };
};
/**
 * 查询对象类型
 */
export type QueryObject =
  | {
      [logic: string]: (QueryCondition | QueryObject)[];
    }
  | QueryCondition;
/**
 * 转换过滤器数据结构
 *
 * 将结构化的过滤器配置转换为查询对象格式
 *
 * @param filter - 过滤器配置对象
 * @returns 转换后的查询对象
 *
 * @throws {Error} 当过滤器格式无效时抛出错误
 *
 * @example
 * ```typescript
 * // 简单条件
 * const simpleFilter = {
 *   "logic": "$and",
 *   "items": [
 *     {
 *       "path": "name",
 *       "operator": "$eq",
 *       "value": "test"
 *     }
 *   ]
 * };
 *
 * const result = transformFilter(simpleFilter);
 * // 输出: {"$and":[{"name":{"$eq":"test"}}]}
 *
 * // 嵌套条件
 * const nestedFilter = {
 *   "logic": "$or",
 *   "items": [
 *     {
 *       "path": "isAdmin",
 *       "operator": "$eq",
 *       "value": true
 *     },
 *     {
 *       "logic": "$and",
 *       "items": [
 *         {
 *           "path": "name",
 *           "operator": "$includes",
 *           "value": "NocoBase"
 *         },
 *         {
 *           "path": "age",
 *           "operator": "$gt",
 *           "value": 18
 *         }
 *       ]
 *     }
 *   ]
 * };
 *
 * const nestedResult = transformFilter(nestedFilter);
 * // 输出: {"$or":[{"isAdmin":{"$eq":true}},{"$and":[{"name":{"$includes":"NocoBase"}},{"age":{"$gt":18}}]}]}
 * ```
 */
export declare function transformFilter(filter: FilterGroupType): QueryObject;
export declare function removeInvalidFilterItems(filter: FilterGroupType): FilterGroupType;
/**
 * 条件评估器函数类型
 *
 * @param path - 左值（字段名）
 * @param operator - 操作符
 * @param value - 右值
 * @returns 条件评估结果
 */
export type ConditionEvaluator = (path: string, operator: string, value: any) => boolean;
/**
 * 评估过滤器条件
 *
 * 解析 FilterGroupType 类型的条件，根据提供的评估器函数计算每个条件的值，
 * 然后按照逻辑操作符组合得出最终的布尔值结果。
 *
 * @param conditions - 过滤器条件配置对象
 * @param evaluator - 条件评估器函数，用于计算 path、operator、value 的结果
 * @returns 最终的布尔值结果
 *
 * @throws {Error} 当条件格式无效时抛出错误
 *
 * @example
 * ```typescript
 * // 定义条件评估器
 * const evaluator: ConditionEvaluator = (path, operator, value) => {
 *   // 这里实现具体的条件计算逻辑
 *   // 例如从上下文中获取字段值并与 value 比较
 *   const fieldValue = getFieldValue(path);
 *   return compareValues(fieldValue, operator, value);
 * };
 *
 * // 评估条件
 * const conditions = {
 *   logic: '$and',
 *   items: [
 *     {
 *       path: 'name',
 *       operator: '$eq',
 *       value: 'test'
 *     },
 *     {
 *       path: 'age',
 *       operator: '$gt',
 *       value: 18
 *     }
 *   ]
 * };
 *
 * const result = evaluateConditions(conditions, evaluator);
 * // 返回: boolean (根据评估器的具体实现)
 * ```
 */
export declare function evaluateConditions(conditions: FilterGroupType, evaluator: ConditionEvaluator): boolean;
