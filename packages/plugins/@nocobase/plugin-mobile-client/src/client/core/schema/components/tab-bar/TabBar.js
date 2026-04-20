/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useFieldSchema } from '@formily/react';
import { uid } from '@formily/shared';
import { css, cx, DndContext, Icon, SchemaComponent, SchemaInitializerActionModal, SortableItem, useCompile, useDesignable, } from '@nocobase/client';
import { TabBar } from 'antd-mobile';
import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../../../locale';
import { PageSchema } from '../../common';
import { tabItemSchema } from './schema';
import { TabBarItem } from './TabBar.Item';
export const InternalTabBar = (props) => {
    const fieldSchema = useFieldSchema();
    const { designable } = useDesignable();
    const { t } = useTranslation();
    const { insertBeforeEnd } = useDesignable();
    const navigate = useNavigate();
    const params = useParams();
    const compile = useCompile();
    const onAddTab = useCallback((values) => {
        return insertBeforeEnd({
            type: 'void',
            'x-component': 'MTabBar.Item',
            'x-component-props': values,
            'x-designer': 'MTabBar.Item.Designer',
            properties: {
                [uid()]: PageSchema,
            },
            'x-server-hooks': [
                {
                    type: 'onSelfSave',
                    method: 'extractTextToLocale',
                },
            ],
        });
    }, []);
    return (React.createElement(SortableItem, { className: cx('nb-mobile-tab-bar', css `
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        `) },
        React.createElement(DndContext, null,
            React.createElement(TabBar, { activeKey: params.name, onChange: (key) => {
                    if (key === 'add-tab') {
                        return;
                    }
                    navigate(`/mobile/${key}`);
                }, safeArea: true, className: cx(css `
            width: 100%;
          `) },
                fieldSchema.mapProperties((schema, name) => {
                    const cp = schema['x-component-props'];
                    return (React.createElement(TabBar.Item, { ...cp, key: `tab_${schema['x-uid']}`, title: React.createElement(React.Fragment, null,
                            t(compile(cp.title)),
                            React.createElement(SchemaComponent, { schema: schema, name: name })), icon: cp.icon ? React.createElement(Icon, { type: cp.icon }) : undefined }));
                }),
                designable && (!fieldSchema.properties || Object.keys(fieldSchema.properties).length < 5) ? (React.createElement(TabBar.Item, { className: css `
                .adm-tab-bar-item-icon {
                  height: auto;
                }
              `, icon: React.createElement(SchemaInitializerActionModal, { title: t('Add tab'), onSubmit: onAddTab, schema: tabItemSchema }), key: "add-tab" })) : null))));
};
export const MTabBar = InternalTabBar;
MTabBar.Item = TabBarItem;
MTabBar.displayName = 'MTabBar';
//# sourceMappingURL=TabBar.js.map