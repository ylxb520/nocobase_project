/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useField, useFieldSchema } from '@formily/react';
import { cx, SchemaComponent, SortableItem, useDesigner, useToken } from '@nocobase/client';
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ContainerDesigner } from './Container.Designer';
import useStyles from './style';
const findGrid = (schema, uid) => {
    return schema.reduceProperties((final, next) => {
        if (final)
            return final;
        if (next['x-component'] === 'MTabBar') {
            return findGrid(next, uid);
        }
        if (next['x-component'] === 'MTabBar.Item' && uid === next['x-uid']) {
            return next;
        }
    });
};
const TabContentComponent = () => {
    const { name } = useParams();
    const fieldSchema = useFieldSchema();
    if (!name)
        return React.createElement(React.Fragment, null);
    const gridSchema = findGrid(fieldSchema.properties['tabBar'], name.replace('tab_', ''));
    if (!gridSchema) {
        return React.createElement(Navigate, { replace: true, to: "../" });
    }
    return React.createElement(SchemaComponent, { schema: gridSchema });
};
const InternalContainer = (props) => {
    const { styles } = useStyles();
    const { token } = useToken();
    const Designer = useDesigner();
    const fieldSchema = useFieldSchema();
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const field = useField();
    const isTabBarEnabled = field.componentProps.tabBarEnabled !== false;
    const tabBarSchema = fieldSchema?.properties?.['tabBar'];
    const tabBarCurrentFirstKey = tabBarSchema?.properties ? Object.keys(tabBarSchema.properties)[0] : null;
    let redirectToUid = null;
    if (tabBarCurrentFirstKey) {
        redirectToUid = tabBarSchema?.properties[tabBarCurrentFirstKey]?.['x-uid'];
    }
    useEffect(() => {
        if (redirectToUid && !params.name) {
            const locationPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
            navigate(`${locationPath}/tab_${redirectToUid}`, { replace: true });
        }
    }, [location.pathname, navigate, params.name, redirectToUid]);
    return (React.createElement(SortableItem, { eid: "nb-mobile-scroll-wrapper", className: cx('nb-mobile-container', styles.mobileContainer) },
        React.createElement(Designer, null),
        React.createElement("div", { style: {
                paddingBottom: redirectToUid ? token.paddingLG * 2 : 0,
            }, className: "nb-mobile-container-content" }, redirectToUid ? (React.createElement(TabContentComponent, null)) : (React.createElement(SchemaComponent, { filterProperties: (schema) => {
                return schema['x-component'] !== 'MTabBar';
            }, schema: fieldSchema }))),
        isTabBarEnabled && (React.createElement("div", { className: cx('nb-mobile-container-tab-bar', styles.tabBar) },
            React.createElement(SchemaComponent, { onlyRenderProperties: true, filterProperties: (schema) => {
                    return schema['x-component'] === 'MTabBar';
                }, schema: fieldSchema })))));
};
export const MContainer = InternalContainer;
MContainer.Designer = ContainerDesigner;
MContainer.displayName = 'MContainer';
//# sourceMappingURL=Container.js.map