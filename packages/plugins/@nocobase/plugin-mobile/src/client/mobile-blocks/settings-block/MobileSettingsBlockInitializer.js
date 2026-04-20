/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SettingOutlined } from '@ant-design/icons';
import { SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';
export const MobileSettingsBlockInitializer = () => {
    const itemConfig = useSchemaInitializerItem();
    const { insert } = useSchemaInitializer();
    return (React.createElement(SchemaInitializerItem, { icon: React.createElement(SettingOutlined, null), onClick: async () => {
            insert({
                type: 'void',
                'x-component': 'MobileSettings',
                'x-settings': 'blockSettings:mobileSettings',
                'x-component-props': {},
            });
        }, ...itemConfig }));
};
//# sourceMappingURL=MobileSettingsBlockInitializer.js.map