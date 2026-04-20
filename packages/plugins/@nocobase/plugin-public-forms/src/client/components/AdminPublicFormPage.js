/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { PoweredBy, RemoteSchemaComponent, useRequest, useAPIClient, SchemaComponentOptions, FormDialog, SchemaComponent, useGlobalTheme, FormItem, Checkbox, VariablesProvider, useApp, TextAreaWithGlobalScope, ApplicationContext, useGlobalVariable, useCompile, } from '@nocobase/client';
import { Breadcrumb, Button, Dropdown, Space, Spin, Switch, message, Popover, QRCode, theme as AntdTheme, } from 'antd';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { FormLayout } from '@formily/antd-v5';
import { usePublicSubmitActionProps } from '../hooks';
import { usePublicFormTranslation, NAMESPACE } from '../locale';
const PublicFormQRCode = () => {
    const [open, setOpen] = useState(false);
    const { t } = usePublicFormTranslation();
    const params = useParams();
    const app = useApp();
    const baseURL = window.location.origin;
    const link = baseURL + app.getHref(`public-forms/${params.name}`);
    const handleQRCodeOpen = (newOpen) => {
        setOpen(newOpen);
    };
    return (React.createElement(Popover, { trigger: 'hover', open: open, onOpenChange: handleQRCodeOpen, content: open ? React.createElement(QRCode, { value: link, bordered: false }) : ' ' },
        React.createElement("a", null, t('QR code', { ns: NAMESPACE }))));
};
export function AdminPublicFormPage() {
    const params = useParams();
    const { t } = usePublicFormTranslation();
    const { theme } = useGlobalTheme();
    const apiClient = useAPIClient();
    const compile = useCompile();
    const { token } = AntdTheme.useToken();
    const app = useApp();
    const environmentCtx = useGlobalVariable('$env');
    const { data, loading, refresh } = useRequest({
        url: `publicForms:get/${params.name}`,
    });
    const { enabled, title, ...others } = data?.data || {};
    if (loading) {
        return React.createElement(Spin, null);
    }
    const handleEditPublicForm = async (values) => {
        await apiClient.resource('publicForms').update({
            filterByTk: params.name,
            values: { ...values },
        });
        await refresh();
    };
    const handleSetPassword = async () => {
        const values = await FormDialog(t('Password'), () => {
            return (React.createElement(ApplicationContext.Provider, { value: app },
                React.createElement(SchemaComponentOptions, { components: { Checkbox, TextAreaWithGlobalScope, FormItem } },
                    React.createElement(FormLayout, { layout: 'vertical' },
                        React.createElement(SchemaComponent, { schema: {
                                properties: {
                                    password: {
                                        type: 'string',
                                        'x-decorator': 'FormItem',
                                        'x-component': 'TextAreaWithGlobalScope',
                                        'x-component-props': {
                                            password: true,
                                            scope: [environmentCtx],
                                        },
                                    },
                                },
                            } })))));
        }, theme).open({
            initialValues: { ...others },
        });
        const { password } = values;
        await handleEditPublicForm({ password });
    };
    const handleCopyLink = () => {
        const baseURL = window.location.origin;
        const link = baseURL + app.getHref(`public-forms/${params.name}`);
        navigator.clipboard.writeText(link);
        message.success(t('Link copied successfully'));
    };
    return (React.createElement("div", { style: { marginTop: '-50px' } },
        React.createElement("div", { style: {
                margin: '-24px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: `${token.colorBgContainer}`,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
            } },
            React.createElement(Breadcrumb, { style: { marginLeft: '10px' }, items: [
                    {
                        title: React.createElement(Link, { to: `/admin/settings/public-forms` }, t('Public forms', { ns: NAMESPACE })),
                    },
                    {
                        title: compile(title),
                    },
                ] }),
            React.createElement(Space, null,
                React.createElement(Link, { target: '_blank', to: `/public-forms/${params.name}` },
                    React.createElement(Button, { disabled: !enabled, icon: React.createElement(EyeOutlined, null) }, t('Open form', { ns: NAMESPACE }))),
                React.createElement(Dropdown, { menu: {
                        items: [
                            {
                                key: 'enabled',
                                label: (React.createElement("a", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }, onClick: () => handleEditPublicForm({ enabled: !enabled }) },
                                    React.createElement("span", { style: { marginRight: '10px' } }, t('Enable form', { ns: NAMESPACE })),
                                    React.createElement(Switch, { size: 'small', checked: enabled }))),
                            },
                            {
                                key: 'password',
                                label: React.createElement("a", { onClick: handleSetPassword },
                                    " ",
                                    t('Set password')),
                            },
                            {
                                key: 'divider1',
                                type: 'divider',
                            },
                            {
                                key: 'copyLink',
                                label: React.createElement("a", { onClick: handleCopyLink }, t('Copy link')),
                            },
                            {
                                key: 'qrcode',
                                label: React.createElement(PublicFormQRCode, null),
                            },
                        ],
                    } },
                    React.createElement(Button, { icon: React.createElement(SettingOutlined, null) }, t('Settings'))))),
        React.createElement("div", { style: {
                maxWidth: 800,
                margin: '100px auto',
                position: 'relative',
                zIndex: 0 /** create a new z-index context */,
            } },
            React.createElement(VariablesProvider, { filterVariables: (v) => {
                    return !['$user', '$nRole', '$nToken'].includes(v.key);
                } },
                React.createElement(RemoteSchemaComponent, { uid: params.name, scope: { useCreateActionProps: usePublicSubmitActionProps }, components: { PublicFormMessageProvider: (props) => props.children } })),
            React.createElement(PoweredBy, null))));
}
//# sourceMappingURL=AdminPublicFormPage.js.map