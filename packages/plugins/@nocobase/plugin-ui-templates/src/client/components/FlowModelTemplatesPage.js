/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useMemo } from 'react';
import { ExtendCollectionsProvider, SchemaComponent, SchemaComponentContext, useSchemaComponentContext, } from '@nocobase/client';
import { createFlowModelTemplatesSchema } from '../schemas/flowModelTemplates';
import { useFlowModelTemplateDeleteActionProps, useFlowModelTemplateEditActionProps, useFlowModelTemplateEditFormProps, useFlowModelTemplateSearchProps, } from '../hooks/useFlowModelTemplateActions';
import { flowModelTemplatesCollection } from '../collections/flowModelTemplates';
const TemplateTable = ({ filter }) => {
    const scCtx = useSchemaComponentContext();
    const schema = useMemo(() => createFlowModelTemplatesSchema(filter), [filter]);
    return (React.createElement(SchemaComponentContext.Provider, { value: { ...scCtx, designable: false } },
        React.createElement(SchemaComponent, { schema: schema, scope: {
                useFlowModelTemplateSearchProps,
                useFlowModelTemplateEditFormProps,
                useFlowModelTemplateEditActionProps,
                useFlowModelTemplateDeleteActionProps,
            } })));
};
// 区块模板页面: type 不是 popup 的（包括 null 和空）
export const BlockTemplatesPage = () => {
    const blockTemplateFilter = useMemo(() => ({
        $or: [{ type: { $ne: 'popup' } }, { type: { $empty: true } }],
    }), []);
    return (React.createElement(ExtendCollectionsProvider, { collections: [flowModelTemplatesCollection] },
        React.createElement(TemplateTable, { filter: blockTemplateFilter })));
};
// 弹窗模板页面: type 是 popup 的
export const PopupTemplatesPage = () => {
    const popupTemplateFilter = useMemo(() => ({
        type: 'popup',
    }), []);
    return (React.createElement(ExtendCollectionsProvider, { collections: [flowModelTemplatesCollection] },
        React.createElement(TemplateTable, { filter: popupTemplateFilter })));
};
// 保留原来的导出以兼容
export const FlowModelTemplatesPage = BlockTemplatesPage;
//# sourceMappingURL=FlowModelTemplatesPage.js.map