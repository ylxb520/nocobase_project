/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CalendarOutlined } from '@ant-design/icons';
import { FormLayout } from '@formily/antd-v5';
import { SchemaOptionsContext } from '@formily/react';
import { DataBlockInitializer, FormDialog, SchemaComponent, SchemaComponentOptions, useCollectionManager_deprecated, useGlobalTheme, useSchemaInitializer, useSchemaInitializerItem, useApp, } from '@nocobase/client';
import React, { useContext } from 'react';
import { useTranslation } from '../../../locale';
import { createCalendarBlockUISchema } from '../createCalendarBlockUISchema';
export const CalendarBlockInitializer = ({ filterCollections, onlyCurrentDataSource, hideSearch, createBlockSchema, showAssociationFields, }) => {
    const itemConfig = useSchemaInitializerItem();
    const { createCalendarBlock } = useCreateCalendarBlock();
    return (React.createElement(DataBlockInitializer, { ...itemConfig, componentType: `Calendar`, icon: React.createElement(CalendarOutlined, null), onCreateBlockSchema: async (options) => {
            if (createBlockSchema) {
                return createBlockSchema(options);
            }
            createCalendarBlock(options);
        }, onlyCurrentDataSource: onlyCurrentDataSource, hideSearch: hideSearch, filter: filterCollections, showAssociationFields: showAssociationFields }));
};
export const useCreateCalendarBlock = () => {
    const { insert } = useSchemaInitializer();
    const { t } = useTranslation();
    const { getCollectionField, getCollectionFieldsOptions } = useCollectionManager_deprecated();
    const options = useContext(SchemaOptionsContext);
    const { theme } = useGlobalTheme();
    const app = useApp();
    const plugin = app.pm.get('calendar');
    const { titleFieldInterfaces, dateTimeFieldInterfaces } = plugin;
    const createCalendarBlock = async ({ item }) => {
        const titleFieldsOptions = getCollectionFieldsOptions(item.name, null, Object.keys(titleFieldInterfaces).map((v) => v || v), {
            dataSource: item.dataSource,
        });
        const dateFieldsOptions = getCollectionFieldsOptions(item.name, null, dateTimeFieldInterfaces, {
            association: ['o2o', 'obo', 'oho', 'm2o'],
            dataSource: item.dataSource,
        });
        const values = await FormDialog(t('Create calendar block'), () => {
            return (React.createElement(SchemaComponentOptions, { scope: options.scope, components: { ...options.components } },
                React.createElement(FormLayout, { layout: 'vertical' },
                    React.createElement(SchemaComponent, { schema: {
                            properties: {
                                title: {
                                    title: t('Title field'),
                                    enum: titleFieldsOptions,
                                    required: true,
                                    'x-component': 'Select',
                                    'x-decorator': 'FormItem',
                                },
                                start: {
                                    title: t('Start date field'),
                                    enum: dateFieldsOptions,
                                    required: true,
                                    default: getCollectionField(`${item.name}.createdAt`) ? 'createdAt' : null,
                                    'x-component': 'Cascader',
                                    'x-decorator': 'FormItem',
                                },
                                end: {
                                    title: t('End date field'),
                                    enum: dateFieldsOptions,
                                    'x-component': 'Cascader',
                                    'x-decorator': 'FormItem',
                                },
                            },
                        } }))));
        }, theme).open({
            initialValues: {},
        });
        insert(createCalendarBlockUISchema({
            collectionName: item.name,
            dataSource: item.dataSource,
            fieldNames: {
                ...values,
            },
        }));
    };
    return { createCalendarBlock };
};
//# sourceMappingURL=CalendarBlockInitializer.js.map