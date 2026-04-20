/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import 'ses';
export type JSONValue = string | {
    [key: string]: JSONValue;
} | JSONValue[];
/**
 * 解析 JSON 模板中形如 {{ ... }} 的占位符（服务端解析）。
 * 仅支持以 ctx 开头的路径与表达式（如：{{ ctx.user.id }}、{{ ctx.record.roles[0].name }}）。
 * 无法解析或不受支持的表达式将原样保留。
 *
 * @param template 要解析的对象/数组/字符串模板
 * @param ctx 变量上下文（实现了所需属性/方法的代理对象）
 * @returns 解析后的结果，与输入结构相同
 */
export declare function resolveJsonTemplate(template: JSONValue, ctx: any): Promise<any>;
/**
 * 将表达式中的 ctx 访问改写为内部 __get 调用。
 * 例如：ctx.user.id + 1 => (await __get('user', '.id')) + 1
 *
 * @param expression 原始表达式字符串
 * @returns 改写后的表达式字符串
 */
export declare function preprocessExpression(expression: string): string;
