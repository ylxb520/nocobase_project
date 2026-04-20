/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
type PrepareRunJsCodeOptions = {
    preprocessTemplates?: boolean;
};
/**
 * 预处理 RunJS 源码，兼容旧版 `{{ ... }}` 占位符。
 *
 * 注意：这不是“变量解析”（这里不会计算任何值）。
 * 它会把代码重写为合法的 JS，并在执行期间调用 `ctx.resolveJsonTemplate(...)` 来解析 {{ ... }}。
 *
 * 设计说明：
 * - 为避免出现 “await is only valid in async functions” 之类的语法错误，会把所有模板解析提升到
 *   RunJS 程序的顶层，再用变量替换各处的出现位置。
 * - 对于字符串/模板字面量，不在原位置直接包一层 `await ...`。而是保留原字面量表达式，并通过
 *   一个小 helper 用 `.split().join()` 做替换，以匹配 `resolveJsonTemplate` 对 object/undefined
 *   的字符串替换行为。
 */
export declare function preprocessRunJsTemplates(code: string, options?: {
    processBarePlaceholders?: boolean;
    processStringLiterals?: boolean;
}): string;
/**
 * 为执行准备用户的 RunJS 源码。
 * - 可选：运行时模板兼容重写
 * - JSX 转换（sucrase），确保 RunJS 可以安全使用 JSX
 */
export declare function prepareRunJsCode(code: string, options?: PrepareRunJsCodeOptions): Promise<string>;
export {};
