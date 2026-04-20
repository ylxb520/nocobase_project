/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';
export const MSettingsBlockInitializer = () => {
    const itemConfig = useSchemaInitializerItem();
    const { insert } = useSchemaInitializer();
    return (React.createElement(SchemaInitializerItem, { icon: React.createElement(SettingOutlined, null), onClick: async () => {
            insert({
                type: 'void',
                'x-component': 'MSettings',
                'x-designer': 'MSettings.Designer',
                'x-component-props': {},
            });
        }, ...itemConfig }));
};
//# sourceMappingURL=SettingsBlockInitializer.js.map