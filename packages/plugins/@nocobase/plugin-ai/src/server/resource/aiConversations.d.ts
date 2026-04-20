/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Context, Next } from '@nocobase/actions';
declare const _default: {
    name: string;
    actions: {
        list(ctx: Context, next: Next): Promise<void>;
        create(ctx: Context, next: Next): Promise<void>;
        update(ctx: Context, next: Next): Promise<void>;
        updateOptions(ctx: Context, next: Next): Promise<never>;
        destroy(ctx: Context, next: Next): Promise<void>;
        getMessages(ctx: Context, next: Next): Promise<never>;
        updateToolArgs(ctx: Context, next: Next): Promise<any>;
        sendMessages(ctx: Context, next: Next): Promise<any>;
        abort(ctx: Context, next: Next): Promise<void>;
        resendMessages(ctx: Context, next: Next): Promise<any>;
        updateUserDecision(ctx: Context, next: Next): Promise<never>;
        resumeToolCall(ctx: Context, next: Next): Promise<any>;
    };
};
export default _default;
