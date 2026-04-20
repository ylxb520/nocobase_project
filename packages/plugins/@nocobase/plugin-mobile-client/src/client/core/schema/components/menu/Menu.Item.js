/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useField, useFieldSchema } from '@formily/react';
import { GeneralSchemaDesigner, Icon, SchemaSettingsModalItem, SchemaSettingsRemove, SortableItem, css, cx, useCompile, useDesigner, } from '@nocobase/client';
import { List } from 'antd-mobile';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../../../locale';
import { useSchemaPatch } from '../../hooks';
import { menuItemSchema } from './schema';
const InternalMenuItem = (props) => {
    const { icon, name } = props;
    const Designer = useDesigner();
    const navigate = useNavigate();
    const location = useLocation();
    const fieldSchema = useFieldSchema();
    const compile = useCompile();
    const params = useParams();
    const onToPage = () => {
        const locationPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
        navigate(params.name ? `/mobile/${fieldSchema['x-uid']}` : `${locationPath}/${fieldSchema['x-uid']}`);
    };
    return (React.createElement(SortableItem, { className: cx('nb-mobile-menu-item', css `
          width: 100%;
          background: var(--adm-color-background);
          > .adm-list-item {
            background: inherit;
          }
        `) },
        React.createElement(List.Item, { arrow: true, clickable: true, ...props, prefix: React.createElement(Icon, { type: icon }), onClick: onToPage }, compile(name)),
        React.createElement(Designer, null)));
};
const MenuItemDesigner = () => {
    const { t } = useTranslation();
    const { onUpdateComponentProps } = useSchemaPatch();
    const field = useField();
    return (React.createElement(GeneralSchemaDesigner, null,
        React.createElement(SchemaSettingsModalItem, { title: t('Edit menu info'), initialValues: field.componentProps, schema: menuItemSchema, onSubmit: onUpdateComponentProps }),
        React.createElement(SchemaSettingsRemove, { key: "remove", removeParentsIfNoChildren: true, confirm: {
                title: t('Delete menu item?'),
            }, breakRemoveOn: {
                'x-component': 'MMenu',
            } })));
};
export const MenuItem = InternalMenuItem;
MenuItem.Designer = MenuItemDesigner;
//# sourceMappingURL=Menu.Item.js.map