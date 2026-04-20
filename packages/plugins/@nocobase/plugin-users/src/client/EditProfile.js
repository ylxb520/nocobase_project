/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useField, useFieldSchema, useForm } from '@formily/react';
import { uid } from '@formily/shared';
import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionContextProvider, DropdownVisibleContext, ExtendCollectionsProvider, RemoteSchemaComponent, SchemaComponent, useActionContext, useCollectValuesToSubmit, useCollectionManager, useCurrentUserContext, useSystemSettings, zIndexContext, useZIndexContext, useAPIClient, SchemaSettingsItem, } from '@nocobase/client';
const useUpdateProfileActionProps = () => {
    const ctx = useCurrentUserContext();
    const { setVisible } = useActionContext();
    const form = useForm();
    const api = useAPIClient();
    const actionSchema = useFieldSchema();
    const actionField = useField();
    const collectValues = useCollectValuesToSubmit();
    return {
        type: 'primary',
        htmlType: 'submit',
        async onClick() {
            const { triggerWorkflows, skipValidator } = actionSchema?.['x-action-settings'] ?? {};
            if (!skipValidator) {
                await form.submit();
            }
            const values = await collectValues();
            actionField.data = actionField.data || {};
            actionField.data.loading = true;
            try {
                await api.resource('users').updateProfile({
                    values,
                    triggerWorkflows: triggerWorkflows?.length
                        ? triggerWorkflows.map((row) => [row.workflowKey, row.context].filter(Boolean).join('!')).join(',')
                        : undefined,
                });
                ctx.mutate({
                    data: {
                        ...ctx?.data?.data,
                        ...values,
                    },
                });
                await form.reset();
                actionField.data.loading = false;
                setVisible(false);
            }
            catch (error) {
                actionField.data.loading = false;
            }
        },
    };
};
const useEditProfileFormBlockDecoratorProps = () => {
    const { data } = useCurrentUserContext() || {};
    return {
        record: data?.data,
    };
};
const useCancelActionProps = () => {
    const { setVisible } = useActionContext();
    return {
        type: 'default',
        onClick() {
            setVisible(false);
        },
    };
};
const ProfileEditForm = () => {
    const ctx = useContext(DropdownVisibleContext);
    const cm = useCollectionManager();
    const userCollection = cm.getCollection('users');
    const collection = useMemo(() => ({
        ...userCollection,
        name: 'users',
        fields: userCollection.fields.filter((field) => !['password', 'roles'].includes(field.name)),
    }), [userCollection]);
    useEffect(() => {
        ctx?.setVisible(false);
    }, [ctx]);
    return (React.createElement(ExtendCollectionsProvider, { collections: [collection] },
        React.createElement(RemoteSchemaComponent, { uid: "nocobase-user-profile-edit-form", noForm: true, scope: {
                useUpdateProfileActionProps,
                useEditFormBlockDecoratorProps: useEditProfileFormBlockDecoratorProps,
                useCancelActionProps,
            } })));
};
export const EditProfile = () => {
    const ctx = useContext(DropdownVisibleContext);
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const { data } = useSystemSettings() || {};
    const { enableEditProfile } = data?.data ?? {};
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
        return (React.createElement(SchemaComponent, { components: { ProfileEditForm }, schema: {
                type: 'object',
                properties: {
                    [uid()]: {
                        'x-component': 'Action.Drawer',
                        'x-component-props': { zIndex },
                        type: 'void',
                        title: '{{t("Edit profile")}}',
                        properties: {
                            form: {
                                type: 'void',
                                'x-component': 'ProfileEditForm',
                            },
                        },
                    },
                },
            } }));
    }, [zIndex]);
    if (enableEditProfile === false) {
        return null;
    }
    return (React.createElement(zIndexContext.Provider, { value: zIndex },
        React.createElement(SchemaSettingsItem, { eventKey: "EditProfile", title: "EditProfile" },
            React.createElement("div", { onClick: handleClick }, t('Edit profile'))),
        React.createElement(ActionContextProvider, { value: { visible, setVisible } }, visible && React.createElement("div", { onClick: (e) => e.stopPropagation() }, schemaComponent))));
};
//# sourceMappingURL=EditProfile.js.map