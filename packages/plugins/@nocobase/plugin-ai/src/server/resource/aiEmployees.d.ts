/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Context, Next } from '@nocobase/actions';
export declare const list: (ctx: Context, next: Next) => Promise<void>;
export declare const listByUser: (ctx: Context, next: Next) => Promise<any>;
export declare const updateUserPrompt: (ctx: Context, next: Next) => Promise<any>;
export declare const getTemplates: (ctx: Context, next: Next) => Promise<void>;
