/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useField, useFieldSchema } from '@formily/react';
import { BlockProvider, useACLRoleContext, useBlockRequestContext, useCollection, useCollection_deprecated, useParsedFilter, useApp, } from '@nocobase/client';
import { Spin } from 'antd';
import { isEqual } from 'lodash';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
export const KanbanBlockContext = createContext({});
KanbanBlockContext.displayName = 'KanbanBlockContext';
const useGroupField = (props) => {
    const { getField } = useCollection_deprecated();
    const { groupField } = props;
    if (typeof groupField === 'string') {
        return getField(groupField);
    }
    if (groupField?.name) {
        return getField(groupField?.name);
    }
};
const InternalKanbanBlockProvider = (props) => {
    const field = useField();
    const { resource, service } = useBlockRequestContext();
    const groupField = useGroupField(props);
    if (!groupField) {
        return null;
    }
    if (service.loading && !field.loaded) {
        return React.createElement(Spin, null);
    }
    field.loaded = true;
    return (React.createElement(KanbanBlockContext.Provider, { value: {
            props: {
                resource: props.resource,
            },
            field,
            service,
            resource,
            groupField,
            // fixedBlock: field?.decoratorProps?.fixedBlock,
            sortField: props?.sortField,
        } }, props.children));
};
export const KanbanBlockProvider = (props) => {
    const { filter: parsedFilter } = useParsedFilter({
        filterOption: props.params?.filter,
    });
    const params = { ...props.params, filter: parsedFilter };
    return (React.createElement(BlockProvider, { name: "kanban", ...props, params: params },
        React.createElement(InternalKanbanBlockProvider, { ...props, params: params })));
};
export const useKanbanBlockContext = () => {
    return useContext(KanbanBlockContext);
};
const useDisableCardDrag = () => {
    const fieldSchema = useFieldSchema();
    const { dragSort } = fieldSchema?.parent?.['x-component-props'] || {};
    const ctx = useKanbanBlockContext();
    const { allowAll, allowConfigure, parseAction } = useACLRoleContext();
    if (dragSort === false) {
        return true;
    }
    if (allowAll || allowConfigure) {
        return false;
    }
    const result = parseAction(`${ctx?.props?.resource}:update`, { ignoreScope: true });
    return !result;
};
export const toColumns = (groupCollectionField, dataSource = [], primaryKey, options) => {
    const columns = {
        __unknown__: {
            id: '__unknown__',
            title: 'Unknown',
            color: 'default',
            cards: [],
        },
    };
    options?.forEach((item) => {
        columns[item.value] = {
            id: item.value,
            title: item.label,
            color: item.color,
            cards: [],
        };
    });
    dataSource.forEach((ds) => {
        const value = ds[groupCollectionField.name];
        if (value && columns[value]) {
            columns[value].cards.push({ ...ds, id: ds[primaryKey] });
        }
        else {
            columns.__unknown__.cards.push(ds);
        }
    });
    if (columns.__unknown__.cards.length === 0) {
        delete columns.__unknown__;
    }
    return Object.values(columns);
};
export const useKanbanBlockProps = () => {
    const field = useField();
    const ctx = useKanbanBlockContext();
    const [dataSource, setDataSource] = useState([]);
    const primaryKey = useCollection()?.getPrimaryKey();
    const fieldSchema = useFieldSchema();
    const app = useApp();
    const plugin = app.pm.get('kanban');
    const targetGroupField = plugin.getGroupFieldInterface(ctx.groupField.interface);
    const { options } = targetGroupField?.useGetGroupOptions(ctx.groupField) || { options: [] };
    const { columnWidth } = fieldSchema?.parent?.['x-component-props'] || {};
    useEffect(() => {
        const data = toColumns(ctx.groupField, ctx?.service?.data?.data, primaryKey, options);
        if (isEqual(field.value, data) && dataSource === field.value) {
            return;
        }
        field.value = data;
        setDataSource(field.value);
    }, [ctx?.service?.loading, options]);
    const disableCardDrag = useDisableCardDrag();
    const onCardDragEnd = useCallback(async ({ columns, groupField }, { fromColumnId, fromPosition }, { toColumnId, toPosition }) => {
        const sourceColumn = columns.find((column) => column.id === fromColumnId);
        const destinationColumn = columns.find((column) => column.id === toColumnId);
        const sourceCard = sourceColumn?.cards?.[fromPosition];
        const targetCard = destinationColumn?.cards?.[toPosition];
        const values = {
            sourceId: sourceCard.id,
            sortField: ctx?.sortField || `${groupField.name}_sort`,
        };
        if (targetCard) {
            values['targetId'] = targetCard.id;
        }
        else {
            values['targetScope'] = {
                [groupField.name]: toColumnId,
            };
        }
        await ctx.resource.move(values);
    }, [ctx?.sortField]);
    return {
        setDataSource,
        dataSource,
        groupField: ctx.groupField,
        disableCardDrag,
        onCardDragEnd,
        columnWidth,
    };
};
//# sourceMappingURL=KanbanBlockProvider.js.map