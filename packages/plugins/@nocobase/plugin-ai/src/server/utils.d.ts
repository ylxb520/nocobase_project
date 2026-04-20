/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Model } from '@nocobase/database';
import { Context } from '@nocobase/actions';
export declare function sendSSEError(ctx: Context, error: Error | string, errorName?: string): void;
export declare function stripToolCallTags(content: string): string | null;
export declare function parseResponseMessage(row: Model): {
  key: any;
  content: any;
  role: any;
};
export declare function encodeLocalFile(url: string): Promise<string>;
export declare function encodeFile(ctx: Context, url: string): Promise<string>;
export declare function parseVariables(ctx: Context, value: string): Promise<any>;
