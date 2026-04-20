/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export type JSONValue =
  | string
  | {
      [key: string]: JSONValue;
    }
  | JSONValue[];
/**
 * 提取模板中使用到的 ctx 顶层变量名集合。
 * - 支持点语法与顶层括号变量：ctx.user / ctx["user"]
 */
export declare function extractUsedVariableNames(template: JSONValue): Set<string>;
/**
 * 提取模板中使用到的 ctx 顶层变量与对应的子路径数组。
 * - 返回 Map 形如：{ user: ['id', 'roles[0].name'], view: ['record.id'] }
 * - 兼容：顶层括号变量（ctx["user"])、首段括号键与数字索引（如 ["roles"][0].name -> roles[0].name）
 * - 方法调用：记录空字符串以触发服务端 attach（例如 ctx.twice(21) => { twice: [''] }）
 */
export declare function extractUsedVariablePaths(template: JSONValue): Record<string, string[]>;
