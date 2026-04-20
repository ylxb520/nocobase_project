/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { useFieldSchema } from '@formily/react';
import { GeneralSchemaDesigner, SchemaSettingsBlockTitleItem, SchemaSettingsDivider, SchemaSettingsRemove, useCompile, } from '@nocobase/client';
export function SimpleDesigner() {
    const schema = useFieldSchema();
    const compile = useCompile();
    return (React.createElement(GeneralSchemaDesigner, { title: compile(schema.title) },
        React.createElement(SchemaSettingsBlockTitleItem, null),
        React.createElement(SchemaSettingsDivider, null),
        React.createElement(SchemaSettingsRemove, { removeParentsIfNoChildren: true, breakRemoveOn: {
                'x-component': 'Grid',
            } })));
}
//# sourceMappingURL=SimpleDesigner.js.map