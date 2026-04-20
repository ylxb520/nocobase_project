/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ChildPageTabModel, useRequest, SkeletonFallback } from '@nocobase/client';
import { FlowModelRenderer } from '@nocobase/flow-engine';
import React from 'react';
function PageTabChildrenRenderer({ ctx, options }) {
    const { data: model, loading } = useRequest(async () => {
        const model = await ctx.engine.loadOrCreateModel(options);
        model.context.addDelegate(ctx);
        return model;
    }, {
        refreshDeps: [ctx.model.uid],
    });
    const margin = ctx?.isMobileLayout ? 8 : ctx?.themeToken.marginBlock;
    if (loading || !model?.uid) {
        return React.createElement(SkeletonFallback, { style: { margin } });
    }
    return React.createElement(FlowModelRenderer, { model: model, fallback: React.createElement(SkeletonFallback, { style: { margin } }) });
}
export class CCChildPageTabModel extends ChildPageTabModel {
    renderChildren() {
        return (React.createElement(PageTabChildrenRenderer, { ctx: this.context, options: {
                parentId: this.uid,
                subKey: 'grid',
                async: true,
                subType: 'object',
                use: 'CCBlockGridModel',
            } }));
    }
}
//# sourceMappingURL=CCChildPageTabModel.js.map