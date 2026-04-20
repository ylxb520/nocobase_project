/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare function registerRunJSSafeWindowGlobals(keys: Iterable<string> | null | undefined): void;
export declare function registerRunJSSafeDocumentGlobals(keys: Iterable<string> | null | undefined): void;
export declare function __resetRunJSSafeGlobalsRegistryForTests(): void;
export declare function createSafeWindow(extra?: Record<string, any>): Record<string, any>;
export declare function createSafeDocument(extra?: Record<string, any>): Record<string, any>;
export declare function createSafeNavigator(extra?: Record<string, any>): {};
/**
 * Create a safe globals object for RunJS execution.
 *
 * - Always tries to provide `navigator`
 * - Best-effort provides `window` and `document` in browser environments
 * - Never throws (so callers can decide how to handle missing globals)
 */
export declare function createSafeRunJSGlobals(extraGlobals?: Record<string, any>): Record<string, any>;
/**
 * Execute RunJS with safe globals (window/document/navigator).
 *
 * Keeps `this` binding by calling `ctx.runjs(...)` instead of passing bare function references.
 */
export declare function runjsWithSafeGlobals(ctx: unknown, code: string, options?: any, extraGlobals?: Record<string, any>): Promise<any>;
