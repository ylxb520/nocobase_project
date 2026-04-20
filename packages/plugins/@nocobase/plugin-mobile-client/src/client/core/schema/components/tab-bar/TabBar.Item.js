/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useField, useFieldSchema } from '@formily/react';
import { css, cx, GeneralSchemaDesigner, SchemaSettingsModalItem, SchemaSettingsRemove, SortableItem, useDesigner, } from '@nocobase/client';
import React from 'react';
import { useTranslation } from '../../../../locale';
import { useSchemaPatch } from '../../hooks';
import { tabItemSchema } from './schema';
const InternalItem = () => {
    // NOTE: nothing to do
    // return <TabBar.Item {...props}></TabBar.Item>;
    const Designer = useDesigner();
    return (React.createElement(SortableItem, { className: cx('nb-mobile-tab-bar-item', css `
          position: absolute !important;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          padding-top: 5px;
        `) },
        React.createElement(Designer, null)));
};
export const Designer = () => {
    const { t } = useTranslation();
    const fieldSchema = useFieldSchema();
    const { onUpdateComponentProps } = useSchemaPatch();
    const field = useField();
    const tabItems = Object.keys(fieldSchema.parent.properties).length;
    return (React.createElement(GeneralSchemaDesigner, null,
        React.createElement(SchemaSettingsModalItem, { title: t('Edit info'), initialValues: field.componentProps, schema: tabItemSchema, onSubmit: onUpdateComponentProps }),
        tabItems > 1 ? (React.createElement(SchemaSettingsRemove, { key: "remove", removeParentsIfNoChildren: true, confirm: {
                title: t('Delete tab item?'),
            }, breakRemoveOn: {
                'x-component': 'MTabBar',
            } })) : null));
};
export const TabBarItem = InternalItem;
TabBarItem.Designer = Designer;
//# sourceMappingURL=TabBar.Item.js.map