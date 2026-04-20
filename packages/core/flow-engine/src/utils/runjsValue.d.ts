/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export type RunJSValue = {
    code: string;
    version?: string;
};
/**
 * Strictly detect RunJSValue to avoid conflicting with normal constant objects.
 * - MUST be a plain object (not array)
 * - MUST include string `code`
 * - MAY include string `version`
 * - MUST NOT include any other enumerable keys
 */
export declare function isRunJSValue(value: any): value is RunJSValue;
export declare function normalizeRunJSValue(value: RunJSValue): Required<RunJSValue>;
/**
 * Heuristic extraction of ctx variable usage from RunJS code.
 *
 * Returns a map: varName -> string[] subPaths
 * - subPath '' means the variable root is used (or dependency is dynamic), caller MAY treat it as wildcard.
 * - Only best-effort parsing; correctness prefers over-approximation.
 */
export declare function extractUsedVariablePathsFromRunJS(code: string): Record<string, string[]>;
