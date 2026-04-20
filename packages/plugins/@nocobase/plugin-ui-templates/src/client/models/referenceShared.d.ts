/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowContext, type FlowEngine, type FlowModel } from '@nocobase/flow-engine';
export declare function ensureBlockScopedEngine(flowEngine: FlowEngine, scopedEngine?: FlowEngine): FlowEngine;
export declare function ensureScopedEngineView(engine: FlowEngine, hostContext?: FlowContext): void;
export declare function unlinkScopedEngine(engine?: FlowEngine): void;
export declare function renderReferenceTargetPlaceholder(model: {
    translate?: (key: string, options?: any) => string;
}, state: 'unconfigured' | 'invalid' | 'resolving'): React.JSX.Element;
export declare const RefViewBridge: React.FC<{
    engine: FlowEngine;
    model: FlowModel;
}>;
export declare const ReferenceScopedRenderer: React.FC<{
    engine: FlowEngine;
    model: FlowModel;
}>;
