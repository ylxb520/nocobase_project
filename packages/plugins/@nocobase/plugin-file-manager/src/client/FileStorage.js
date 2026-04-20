/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { uid } from '@formily/shared';
import { ActionContext, i18n, SchemaComponent, useCompile, usePlugin, useRecord } from '@nocobase/client';
import { Button, Card, Dropdown, message } from 'antd';
import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FileManagerPlugin from '.';
import { storageSchema } from './schemas/storage';
import { storageTypes } from './schemas/storageTypes';
import { NAMESPACE } from './locale';
export const CreateStorage = () => {
    const [schema, setSchema] = useState({});
    const plugin = usePlugin(FileManagerPlugin);
    const compile = useCompile();
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    return (React.createElement("div", null,
        React.createElement(ActionContext.Provider, { value: { visible, setVisible } },
            React.createElement(Dropdown, { menu: {
                    onClick(info) {
                        const storageType = plugin.storageTypes.get(info.key);
                        setVisible(true);
                        setSchema({
                            type: 'object',
                            properties: {
                                [uid()]: {
                                    type: 'void',
                                    'x-component': 'Action.Drawer',
                                    'x-decorator': 'Form',
                                    'x-decorator-props': {
                                        initialValue: {
                                            type: storageType.name,
                                        },
                                    },
                                    title: compile("{{t('Add new')}}") + ' - ' + compile(storageType.title),
                                    properties: {
                                        ..._.cloneDeep(storageType.fieldset),
                                        footer: {
                                            type: 'void',
                                            'x-component': 'Action.Drawer.Footer',
                                            properties: {
                                                cancel: {
                                                    title: '{{t("Cancel")}}',
                                                    'x-component': 'Action',
                                                    'x-component-props': {
                                                        useAction: '{{ cm.useCancelAction }}',
                                                    },
                                                },
                                                submit: {
                                                    title: '{{t("Submit")}}',
                                                    'x-component': 'Action',
                                                    'x-component-props': {
                                                        type: 'primary',
                                                        useAction: '{{ cm.useCreateAction }}',
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        });
                    },
                    items: [...plugin.storageTypes.values()].map((storageType) => {
                        return {
                            key: storageType.name,
                            label: compile(storageType.title),
                        };
                    }),
                } },
                React.createElement(Button, { type: 'primary', icon: React.createElement(PlusOutlined, null) },
                    t('Add new'),
                    " ",
                    React.createElement(DownOutlined, null))),
            React.createElement(SchemaComponent, { scope: { createOnly: true }, schema: schema }))));
};
export const EditStorage = () => {
    const record = useRecord();
    const [schema, setSchema] = useState({});
    const plugin = usePlugin(FileManagerPlugin);
    const compile = useCompile();
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const onEdit = useCallback(() => {
        const storageType = plugin.storageTypes.get(record.type);
        if (!storageType) {
            messageApi.error(t('Storage type {{type}} is not registered, please check if related plugin is enabled.', {
                ns: NAMESPACE,
                type: record.type,
            }));
            return;
        }
        setVisible(true);
        if (storageType.fieldset['default']) {
            storageType.fieldset['default']['x-reactions'] = (field) => {
                if (field.initialValue) {
                    field.disabled = true;
                }
                else {
                    field.disabled = false;
                }
            };
        }
        setSchema({
            type: 'object',
            properties: {
                [uid()]: {
                    type: 'void',
                    'x-component': 'Action.Drawer',
                    'x-decorator': 'Form',
                    'x-decorator-props': {
                        initialValue: {
                            ...record,
                        },
                    },
                    title: compile("{{t('Edit')}}") + ' - ' + compile(storageType.title),
                    properties: {
                        ..._.cloneDeep(storageType.fieldset),
                        footer: {
                            type: 'void',
                            'x-component': 'Action.Drawer.Footer',
                            properties: {
                                cancel: {
                                    title: '{{t("Cancel")}}',
                                    'x-component': 'Action',
                                    'x-component-props': {
                                        useAction: '{{ cm.useCancelAction }}',
                                    },
                                },
                                submit: {
                                    title: '{{t("Submit")}}',
                                    'x-component': 'Action',
                                    'x-component-props': {
                                        type: 'primary',
                                        useAction: '{{ cm.useUpdateAction }}',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }, [compile, plugin.storageTypes, record]);
    return (React.createElement("div", null,
        contextHolder,
        React.createElement(ActionContext.Provider, { value: { visible, setVisible } },
            React.createElement("a", { onClick: onEdit }, t('Edit')),
            React.createElement(SchemaComponent, { scope: { createOnly: false }, schema: schema }))));
};
function renderThumbnailRuleDesc(key) {
    const option = storageTypes[key];
    return option?.thumbnailRule ? (React.createElement("div", null,
        React.createElement("a", { target: "_blank", href: option.thumbnailRuleLink, rel: "noreferrer" }, i18n.t('See more')))) : null;
}
export const FileStoragePane = () => {
    const compile = useCompile();
    const plugin = usePlugin(FileManagerPlugin);
    const storageTypes = [...plugin.storageTypes.values()];
    const storageTypeOptions = storageTypes.map((storageType) => {
        return {
            value: storageType.name,
            label: compile(storageType.title),
        };
    });
    return (React.createElement(Card, { bordered: false },
        React.createElement(SchemaComponent, { components: { CreateStorage, EditStorage }, scope: { useNewId: (prefix) => `${prefix}${uid()}`, storageTypeOptions, renderThumbnailRuleDesc }, schema: storageSchema })));
};
//# sourceMappingURL=FileStorage.js.map