/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Space, Tabs } from 'antd-mobile';
import React, { useCallback } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { DndContext, Icon, SortableItem, useCompile } from '@nocobase/client';
import { useTranslation } from 'react-i18next';
import { useRouteTranslation } from '../../../../locale';
import { useMobileRoutes } from '../../../../mobile-providers';
import { useMobilePage } from '../../context';
import { MobilePageTabInitializer } from './initializer';
import { MobilePageTabsSettings } from './settings';
import { useStyles } from './styles';
export const MobilePageTabs = () => {
    const { activeTabBarItem, resource, refresh } = useMobileRoutes();
    const { displayTabs: _displayTabs } = useMobilePage();
    const displayTabs = activeTabBarItem?.enableTabs === undefined ? _displayTabs : activeTabBarItem.enableTabs;
    const { t: routeT } = useRouteTranslation();
    const compile = useCompile();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { componentCls, hashId } = useStyles();
    const { tabSchemaUid } = useParams();
    const [activeKey, setActiveKey] = React.useState(() => {
        return tabSchemaUid || activeTabBarItem?.children?.[0]?.schemaUid;
    });
    const handleChange = (schemaUid) => {
        setActiveKey(schemaUid);
        navigate(`/${activeTabBarItem.type}/${activeTabBarItem.schemaUid}/tabs/${schemaUid}`, { replace: true });
    };
    const handleDragEnd = useCallback(async (event) => {
        const { active, over } = event;
        const activeId = active?.id;
        const overId = over?.id;
        if (!activeId || !overId || activeId === overId) {
            return;
        }
        await resource.move({ sourceId: activeId, targetId: overId, sortField: 'sort' });
        await refresh();
    }, [resource, refresh]);
    if (!activeTabBarItem)
        return React.createElement(Navigate, { replace: true, to: "/" });
    if (!displayTabs)
        return null;
    return (React.createElement("div", { className: `${componentCls} ${hashId}`, "data-testid": "mobile-page-tabs" },
        React.createElement(DndContext, { onDragEnd: handleDragEnd },
            React.createElement(Tabs, { activeKey: activeKey, onChange: handleChange, className: "nb-mobile-page-tabs-list" }, activeTabBarItem.children?.map((item) => {
                if (item.hideInMenu)
                    return null;
                const title = item.title ? routeT(compile(item.title)) : t('Unnamed');
                return (React.createElement(Tabs.Tab, { "data-testid": `mobile-page-tabs-${title}`, title: React.createElement(SortableItem, { id: item.id },
                        React.createElement(MobilePageTabsSettings, { tab: item }),
                        item.icon ? (React.createElement(Space, null,
                            React.createElement(Icon, { type: item.icon }),
                            title)) : (title)), key: String(item.schemaUid) }));
            }))),
        React.createElement("div", null,
            React.createElement(MobilePageTabInitializer, null))));
};
//# sourceMappingURL=MobilePageTabs.js.map