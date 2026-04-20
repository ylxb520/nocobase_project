/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FormLayout } from '@formily/antd-v5';
import { SchemaOptionsContext, useField } from '@formily/react';
import { FormDialog, SchemaComponent, SchemaComponentOptions, Select, useAPIClient, useCompile, useGlobalTheme, } from '@nocobase/client';
import { Button, Space } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { uid } from '@formily/shared';
import { NAMESPACE } from '../locale';
export const CreateAndSelectSort = (props) => {
    const { sortFields, collectionFields, groupField, collectionName, dataSource, ...others } = props;
    const field = useField();
    const compile = useCompile();
    const api = useAPIClient();
    const { t } = useTranslation();
    const { theme } = useGlobalTheme();
    const options = useContext(SchemaOptionsContext);
    const integerfields = collectionFields?.filter((v) => {
        return v.interface === 'integer';
    });
    const ScopekeyDescription = ({ scopeKey }) => {
        const field = scopeKey && collectionFields.find((v) => v.name === scopeKey);
        const result = scopeKey && compile(field?.['uiSchema']?.['title']);
        return (React.createElement("span", { style: { color: 'rgba(0, 0, 0, 0.25)' } },
            "(",
            result
                ? t('Grouped sorting based on', { ns: NAMESPACE }) + `「${result}」`
                : t('Global sorting', { ns: NAMESPACE }),
            ")"));
    };
    //仅支持主数据源
    const handleCreateSortField = async () => {
        const values = await FormDialog(t('Create sort field'), () => {
            return (React.createElement(SchemaComponentOptions, { scope: options.scope, components: { ...options.components } },
                React.createElement(FormLayout, { layout: 'vertical' },
                    React.createElement(SchemaComponent, { schema: {
                            properties: {
                                'uiSchema.title': {
                                    type: 'string',
                                    title: '{{t("Field display name")}}',
                                    required: true,
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Input',
                                },
                                name: {
                                    type: 'string',
                                    title: '{{t("Field name")}}',
                                    required: true,
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Input',
                                    'x-validator': 'uid',
                                    description: "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
                                },
                                scopeKey: {
                                    type: 'string',
                                    title: '{{t("Grouped sorting")}}',
                                    default: groupField.value,
                                    'x-disabled': true,
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Select',
                                    enum: [groupField],
                                },
                            },
                        } }))));
        }, theme).open({
            initialValues: { name: `f_${uid()}` },
        });
        const { data } = await api.resource('collections.fields', collectionName).create({
            values: {
                type: 'sort',
                interface: 'sort',
                ...values,
            },
        });
        field.dataSource = field.dataSource.concat([
            { ...data.data, value: data.data.name, label: compile(data.data['uiSchema']?.['title']) },
        ]);
        field.value = data.data.name;
    };
    //第三方数据源
    const handleUpdateSortField = async () => {
        const values = await FormDialog(t('Create sort field'), () => {
            return (React.createElement(SchemaComponentOptions, { scope: options.scope, components: { ...options.components } },
                React.createElement(FormLayout, { layout: 'vertical' },
                    React.createElement(SchemaComponent, { schema: {
                            properties: {
                                field: {
                                    type: 'string',
                                    title: t('Convert the following integer fields to sorting fields', { ns: NAMESPACE }),
                                    required: true,
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Select',
                                    enum: integerfields.map((v) => {
                                        return {
                                            value: v.name,
                                            label: compile(v['uiSchema']?.['title'] || v.name),
                                        };
                                    }),
                                },
                                scopeKey: {
                                    type: 'string',
                                    title: '{{t("Grouped sorting")}}',
                                    default: groupField.value,
                                    'x-disabled': true,
                                    'x-decorator': 'FormItem',
                                    'x-component': 'Select',
                                    enum: [groupField],
                                },
                            },
                        } }))));
        }, theme).open({
            initialValues: {},
        });
        const { data } = await api.request({
            url: `dataSourcesCollections/${dataSource}.${collectionName}/fields:update?filterByTk=${values.field}`,
            method: 'post',
            data: { type: 'sort', interface: 'sort', ...values },
        });
        const result = data.data;
        field.dataSource = field.dataSource.concat([
            { ...result, value: result.name, label: compile(result['uiSchema']?.['title']) },
        ]);
        field.value = result.name;
    };
    return (React.createElement(Space.Compact, { style: { width: '100%' } },
        React.createElement(Select, { options: sortFields, ...others, disabled: !groupField, optionRender: ({ label, data }) => {
                return (React.createElement(Space, null,
                    React.createElement("span", null, label),
                    React.createElement(ScopekeyDescription, { scopeKey: data.scopeKey })));
            } }),
        React.createElement(Button, { disabled: !groupField, onClick: dataSource === 'main' ? handleCreateSortField : handleUpdateSortField }, t('Add new'))));
};
//# sourceMappingURL=index.js.map