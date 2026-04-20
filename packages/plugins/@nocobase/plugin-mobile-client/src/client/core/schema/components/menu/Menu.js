/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useFieldSchema } from '@formily/react';
import { cx, DndContext, SchemaComponent, SchemaInitializerActionModal, SortableItem, useDesignable, useDesigner, } from '@nocobase/client';
import { List } from 'antd-mobile';
import React from 'react';
import { useTranslation } from '../../../../locale';
import { PageSchema } from '../../common';
import { MenuDesigner } from './Menu.Designer';
import { MenuItem } from './Menu.Item';
import { menuItemSchema } from './schema';
import useStyles from './style';
const InternalMenu = (props) => {
    const { styles } = useStyles();
    const Designer = useDesigner();
    const fieldSchema = useFieldSchema();
    const { insertBeforeEnd, designable } = useDesignable();
    const { t } = useTranslation();
    const onAddMenuItem = (values) => {
        const properties = {
            page: PageSchema,
        };
        return insertBeforeEnd({
            type: 'void',
            title: values.name,
            'x-component': 'MMenu.Item',
            'x-component-props': values,
            'x-designer': 'MMenu.Item.Designer',
            properties,
        });
    };
    return (React.createElement(SortableItem, { className: cx('nb-mobile-menu', styles.mobileMenu) },
        React.createElement(List, null,
            designable && (React.createElement(List.Item, null,
                React.createElement(Designer, null))),
            React.createElement(DndContext, null,
                React.createElement(SchemaComponent, { onlyRenderProperties: true, schema: fieldSchema })),
            designable ? (React.createElement(List.Item, null,
                React.createElement(SchemaInitializerActionModal, { buttonText: t('Add menu item'), title: t('Add menu item'), schema: menuItemSchema, onSubmit: onAddMenuItem }))) : null)));
};
export const MMenu = InternalMenu;
MMenu.Item = MenuItem;
MMenu.Designer = MenuDesigner;
//# sourceMappingURL=Menu.js.map