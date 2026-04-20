/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Card, Empty, Result, Skeleton } from 'antd';
import { FlowContext, FlowEngineProvider, FlowModelRenderer, FlowViewContextProvider, createBlockScopedEngine, useFlowViewContext, } from '@nocobase/flow-engine';
import { NAMESPACE } from '../locale';
export function ensureBlockScopedEngine(flowEngine, scopedEngine) {
    return scopedEngine ?? createBlockScopedEngine(flowEngine);
}
export function ensureScopedEngineView(engine, hostContext) {
    if (!engine?.context || !hostContext)
        return;
    engine.context.defineProperty('view', {
        cache: false,
        get: () => hostContext.view,
    });
}
export function unlinkScopedEngine(engine) {
    engine?.unlinkFromStack?.();
}
function tClient(model, key) {
    const t = model?.translate;
    if (typeof t !== 'function')
        return key;
    return t(key, { ns: [NAMESPACE, 'client'] }) || key;
}
export function renderReferenceTargetPlaceholder(model, state) {
    if (state === 'unconfigured') {
        return (React.createElement(Card, null,
            React.createElement("div", { style: { padding: 24 } },
                React.createElement(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE, description: tClient(model, 'Please configure target block') }))));
    }
    if (state === 'resolving') {
        return (React.createElement(Card, null,
            React.createElement("div", { style: { padding: 24 } },
                React.createElement(Skeleton, { active: true, title: false, paragraph: { rows: 3 } }))));
    }
    return (React.createElement(Card, null,
        React.createElement("div", { style: { padding: 24 } },
            React.createElement(Result, { status: "error", subTitle: tClient(model, 'Target block is invalid') }))));
}
// 桥接父视图上下文：
// - ctx.engine 指向 scoped engine；
// - 同时继承父级 view/popup 等变量。
export const RefViewBridge = ({ engine, model }) => {
    const parentViewCtx = useFlowViewContext();
    const viewCtx = React.useMemo(() => {
        const c = new FlowContext();
        c.defineProperty('engine', { value: engine });
        c.addDelegate(engine.context);
        if (parentViewCtx && parentViewCtx instanceof FlowContext) {
            c.addDelegate(parentViewCtx);
        }
        return c;
    }, [engine, parentViewCtx]);
    return (React.createElement(FlowViewContextProvider, { context: viewCtx },
        React.createElement(FlowModelRenderer, { key: model.uid, model: model, showFlowSettings: false, showErrorFallback: true })));
};
export const ReferenceScopedRenderer = ({ engine, model }) => {
    return (React.createElement(FlowEngineProvider, { engine: engine },
        React.createElement(RefViewBridge, { engine: engine, model: model })));
};
//# sourceMappingURL=referenceShared.js.map