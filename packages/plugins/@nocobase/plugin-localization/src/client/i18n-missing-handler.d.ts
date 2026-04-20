/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowEngineContext } from '@nocobase/flow-engine';
export declare class MissingKeyHandler {
    private context;
    static DEBOUNCE_DELAY: number;
    static fallbackNS: string;
    private sentMissingKeys;
    private pendingMissingKeys;
    private submitPendingKeysDebounced;
    private missingKeyHandler;
    private currentLocale?;
    constructor(context: FlowEngineContext);
    register(): void;
    unregister(): void;
    private isFallbackClient;
    private removeClientFallback;
    private submitPendingKeys;
}
