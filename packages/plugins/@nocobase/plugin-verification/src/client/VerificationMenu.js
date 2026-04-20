/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionContextProvider, DropdownVisibleContext, SchemaComponent, SchemaSettingsItem, useAPIClient, useActionContext, usePlugin, useRequest, useZIndexContext, zIndexContext, } from '@nocobase/client';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { List, Tag, message, Tabs } from 'antd';
import { uid } from '@formily/shared';
import { Schema, useForm } from '@formily/react';
import { useVerificationTranslation } from './locale';
import { createForm } from '@formily/core';
export const UserVerifiersContext = createContext(null);
const useBindActionProps = (verifier) => {
    const form = useForm();
    const api = useAPIClient();
    const { t } = useVerificationTranslation();
    const { refresh } = useContext(UserVerifiersContext);
    const { setVisible } = useActionContext();
    return {
        type: 'primary',
        htmlType: 'submit',
        onClick: async () => {
            await form.submit();
            await api.resource('verifiers').bind({
                values: {
                    verifier,
                    ...form.values,
                },
            });
            message.success(t('Bound successfully'));
            setVisible(false);
            refresh();
        },
    };
};
const useUnbindActionProps = () => {
    const form = useForm();
    const api = useAPIClient();
    const { t } = useVerificationTranslation();
    const { refresh } = useContext(UserVerifiersContext);
    const { setVisible } = useActionContext();
    return {
        type: 'primary',
        htmlType: 'submit',
        onClick: async () => {
            await form.submit();
            await api.resource('verifiers').unbind({
                values: {
                    ...form.values,
                },
            });
            message.success(t('Unbound successfully'));
            setVisible(false);
            refresh();
        },
    };
};
const useCancelActionProps = () => {
    const { setVisible } = useActionContext();
    return {
        onClick: () => {
            setVisible(false);
        },
    };
};
const useFormProps = (verifier, unbindVerifier) => {
    const form = useMemo(() => createForm({
        initialValues: {
            verifier,
            unbindVerifier,
        },
    }), [verifier, unbindVerifier]);
    return {
        form,
    };
};
const BindModal = ({ verifier }) => {
    const { t } = useVerificationTranslation();
    const plugin = usePlugin('verification');
    if (!verifier) {
        return null;
    }
    const verification = plugin.verificationManager.getVerification(verifier.verificationType);
    const C = verification?.components?.BindForm;
    return (React.createElement(SchemaComponent, { components: { C }, scope: { useBindActionProps: () => useBindActionProps(verifier.name), useCancelActionProps }, schema: {
            type: 'void',
            properties: {
                [uid()]: {
                    type: 'object',
                    'x-component': 'Action.Modal',
                    'x-component-props': {
                        width: 520,
                    },
                    title: t(verifier.title),
                    'x-decorator': 'FormV2',
                    properties: {
                        form: {
                            type: 'void',
                            'x-component': 'C',
                            'x-component-props': {
                                verifier: verifier.name,
                                actionType: 'verifiers:bind',
                                isLogged: true,
                            },
                        },
                        footer: {
                            type: 'void',
                            'x-component': 'Action.Modal.Footer',
                            properties: {
                                close: {
                                    title: t('Cancel'),
                                    'x-component': 'Action',
                                    'x-component-props': {
                                        type: 'default',
                                    },
                                    'x-use-component-props': 'useCancelActionProps',
                                },
                                submit: {
                                    title: t('Bind'),
                                    'x-component': 'Action',
                                    'x-use-component-props': 'useBindActionProps',
                                },
                            },
                        },
                    },
                },
            },
        } }));
};
const UnbindForm = ({ verifiers, unbindVerifier }) => {
    const { t } = useVerificationTranslation();
    const plugin = usePlugin('verification');
    const tabs = verifiers
        .map((verifier) => {
        const verification = plugin.verificationManager.getVerification(verifier.verificationType);
        const C = verification?.components?.VerificationForm;
        if (!C) {
            return;
        }
        const defaultTabTitle = Schema.compile(verifier.verificationTypeTitle || verifier.verificationType, { t });
        return {
            component: (React.createElement(SchemaComponent, { components: { C }, scope: {
                    useCancelActionProps,
                    useUnbindActionProps,
                    useFormProps: () => useFormProps(verifier.name, unbindVerifier),
                }, schema: {
                    type: 'void',
                    properties: {
                        form: {
                            type: 'object',
                            'x-component': 'FormV2',
                            'x-use-component-props': 'useFormProps',
                            properties: {
                                bind: {
                                    type: 'void',
                                    'x-component': 'C',
                                    'x-component-props': {
                                        actionType: 'verifiers:unbind',
                                        verifier: verifier.name,
                                        boundInfo: verifier.boundInfo,
                                        isLogged: true,
                                    },
                                },
                                footer: {
                                    type: 'void',
                                    'x-component': 'Action.Modal.FootBar',
                                    properties: {
                                        close: {
                                            title: t('Cancel'),
                                            'x-component': 'Action',
                                            'x-component-props': {
                                                type: 'default',
                                            },
                                            'x-use-component-props': 'useCancelActionProps',
                                        },
                                        submit: {
                                            title: t('Unbind'),
                                            'x-component': 'Action',
                                            'x-use-component-props': 'useUnbindActionProps',
                                        },
                                    },
                                },
                            },
                        },
                    },
                } })),
            tabTitle: verifier.title || defaultTabTitle,
            ...verifier,
        };
    })
        .filter((i) => i);
    return (React.createElement(React.Fragment, null, tabs.length ? (React.createElement(Tabs, { destroyInactiveTabPane: true, items: tabs.map((tab) => ({ label: tab.tabTitle, key: tab.name, children: tab.component })) })) : null));
};
const UnbindModal = ({ verifier }) => {
    const { t } = useVerificationTranslation();
    const api = useAPIClient();
    const { data: verifiers, loading } = useRequest(() => api
        .resource('verifiers')
        .listForVerify({
        scene: 'unbind-verifier',
    })
        .then((res) => res?.data?.data), {
        refreshDeps: [verifier],
    });
    if (!verifier || loading) {
        return null;
    }
    return (React.createElement(SchemaComponent, { components: { UnbindForm }, schema: {
            type: 'void',
            properties: {
                [uid()]: {
                    type: 'object',
                    'x-component': 'Action.Modal',
                    'x-component-props': {
                        width: 520,
                    },
                    title: t('Unbind verifier'),
                    properties: {
                        [uid()]: {
                            type: 'void',
                            'x-component': 'UnbindForm',
                            'x-component-props': {
                                verifiers,
                                unbindVerifier: verifier.name,
                            },
                        },
                    },
                },
            },
        } }));
};
const Verifiers = () => {
    const { t } = useVerificationTranslation();
    const api = useAPIClient();
    const { data, refresh } = useRequest(() => api
        .resource('verifiers')
        .listByUser()
        .then((res) => res?.data?.data));
    const [openBindModal, setOpenBindModal] = useState(false);
    const [openUnbindModal, setOpenUnbindModal] = useState(false);
    const [verifier, setVerifier] = useState(null);
    const setBindInfo = (item) => {
        setOpenBindModal(true);
        setVerifier(item);
    };
    const setUnbindInfo = (item) => {
        setOpenUnbindModal(true);
        setVerifier(item);
    };
    return (React.createElement(UserVerifiersContext.Provider, { value: { refresh } },
        React.createElement(List, { bordered: true, dataSource: data, renderItem: (item) => (React.createElement(List.Item, { actions: item.boundInfo?.bound
                    ? [
                        React.createElement("a", { key: "unbind", onClick: () => setUnbindInfo(item) }, t('Unbind')),
                    ]
                    : [
                        React.createElement("a", { key: "bind", onClick: () => setBindInfo(item) }, t('Bind')),
                    ] },
                React.createElement(List.Item.Meta, { title: React.createElement(React.Fragment, null,
                        Schema.compile(item.title, { t }),
                        item.boundInfo?.bound ? (React.createElement(Tag, { color: "success", style: { marginLeft: '10px' } }, t('Configured'))) : (React.createElement(Tag, { color: "warning", style: { marginLeft: '10px' } }, t('Not configured')))), description: Schema.compile(item.description, { t }) }),
                React.createElement("div", { style: { marginLeft: '10px' } }, item.boundInfo?.publicInfo))) }),
        React.createElement(ActionContextProvider, { value: { visible: openBindModal, setVisible: setOpenBindModal } }, openBindModal ? React.createElement(BindModal, { verifier: verifier }) : null),
        React.createElement(ActionContextProvider, { value: { visible: openUnbindModal, setVisible: setOpenUnbindModal } }, openUnbindModal ? React.createElement(UnbindModal, { verifier: verifier }) : null)));
};
export const Verification = () => {
    const ctx = useContext(DropdownVisibleContext);
    const [visible, setVisible] = useState(false);
    const { t } = useVerificationTranslation();
    const parentZIndex = useZIndexContext();
    const zIndex = parentZIndex + 10;
    // 避免重复渲染的 click 处理
    const handleClick = useCallback((e) => {
        e.stopPropagation();
        ctx?.setVisible?.(false);
        setVisible((prev) => (prev ? prev : true)); // 只有 `visible` 变化时才触发更新
    }, [ctx]);
    // 避免 `SchemaComponent` 结构重新创建
    const schemaComponent = useMemo(() => {
        return (React.createElement(SchemaComponent, { components: { Verifiers }, schema: {
                type: 'object',
                properties: {
                    [uid()]: {
                        'x-component': 'Action.Drawer',
                        'x-component-props': { zIndex },
                        type: 'void',
                        title: '{{t("Verification")}}',
                        properties: {
                            form: {
                                type: 'void',
                                'x-component': 'Verifiers',
                            },
                        },
                    },
                },
            } }));
    }, [zIndex]);
    return (React.createElement(zIndexContext.Provider, { value: zIndex },
        React.createElement(SchemaSettingsItem, { eventKey: "Verification", title: "Verification" },
            React.createElement("div", { onClick: handleClick }, t('Verification'))),
        React.createElement(ActionContextProvider, { value: { visible, setVisible } }, visible && React.createElement("div", { onClick: (e) => e.stopPropagation() }, schemaComponent))));
};
//# sourceMappingURL=VerificationMenu.js.map