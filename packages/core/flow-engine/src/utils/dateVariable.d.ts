/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare function isCtxDatePathPrefix(pathSegments: string[]): boolean;
export declare function encodeBase64Url(input: string): string;
export declare function decodeBase64Url(input: string): string | undefined;
export declare function isCtxDateExpression(value: unknown): value is string;
export declare function isCompleteCtxDatePath(pathSegments: string[]): boolean;
export declare function parseCtxDateExpression(value: unknown): any;
export declare function serializeCtxDateValue(value: unknown): string | undefined;
export declare function resolveCtxDatePath(pathSegments: string[]): any;
