/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * Resolve an object's values, executing any RunJSValue entries via ctx.runjs.
 *
 * - Skips `undefined` values
 * - Skips empty RunJS code (treated as not configured)
 * - Throws when a RunJS execution fails
 */
export declare function resolveRunJSObjectValues(ctx: unknown, raw: unknown): Promise<Record<string, any>>;
