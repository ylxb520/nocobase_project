/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { useFieldSchema } from '@formily/react';
import { AdminProvider, CurrentPageUidContext, CurrentRouteProvider, KeepAlive, LayoutContent, RemoteSchemaComponent, useCurrentPageUid, useCurrentUserContext, } from '@nocobase/client';
import { App, Layout, Result } from 'antd';
import copy from 'copy-to-clipboard';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
// @ts-ignore
import pkg from './../../package.json';
export const EmbedAdminLayout = () => {
    return (
    // @ts-ignore
    React.createElement(Layout, { style: { height: '100%', '--nb-header-height': '0px' } },
        React.createElement(LayoutContent, null)));
};
export const EmbedLayout = () => {
    const result = useCurrentUserContext();
    const noUser = result.loading === false && !result.data?.data?.id;
    if (noUser) {
        return React.createElement(NotAuthorized, null);
    }
    return (React.createElement(AdminProvider, null,
        React.createElement(EmbedAdminLayout, null)));
};
export function EmbedPage() {
    const currentPageUid = useCurrentPageUid();
    return (React.createElement(KeepAlive, { uid: currentPageUid }, (uid) => (React.createElement(CurrentPageUidContext.Provider, { value: uid },
        React.createElement(CurrentRouteProvider, { uid: uid },
            React.createElement(RemoteSchemaComponent, { uid: uid }))))));
}
export function NotAuthorized() {
    return React.createElement(Result, { status: "403", title: "403", subTitle: "Sorry, you are not authorized to access this page." });
}
export function useEmbedTranslation() {
    return useTranslation(pkg.name, { nsMode: 'fallback' });
}
export function useBlockSettingProps() {
    const { name: pageUid } = useParams();
    const fieldSchema = useFieldSchema();
    const { message } = App.useApp();
    const { t } = useEmbedTranslation();
    return {
        title: t('Copy embedded link'),
        onClick: () => {
            const url = window.location.href
                .replace('/admin', '/embed')
                .replace(pageUid, fieldSchema['x-uid'])
                .replace(window.location.search || '', '');
            copy(url);
            message.success(t('Copy successful'));
        },
    };
}
//# sourceMappingURL=EmbedLayout.js.map