/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * 解析变量表达式，提取属性路径
 * 支持格式: "{{ ctx.user.name }}" => ["user", "name"]
 * @param value 变量表达式字符串
 * @returns 属性路径数组，解析失败返回 null
 *
 * @example
 * extractPropertyPath("{{ ctx.user.name }}") // ["user", "name"]
 * extractPropertyPath("{{ ctx }}") // []
 * extractPropertyPath("invalid") // null
 */
export declare function extractPropertyPath(value: string): string[] | null;
/**
 * 格式化属性路径为变量表达式
 * @param path 属性路径数组
 * @returns 变量表达式字符串
 *
 * @example
 * formatPathToVariable(["user", "name"]) // "{{ ctx.user.name }}"
 * formatPathToVariable([]) // "{{ ctx }}"
 */
export declare function formatPathToVariable(path: string[]): string;
/**
 * 检查值是否为变量表达式
 * @param value 待检查的值
 * @returns 是否为变量表达式
 *
 * @example
 * isVariableExpression("{{ ctx.user.name }}") // true
 * isVariableExpression("static value") // false
 */
export declare function isVariableExpression(value: any): boolean;
