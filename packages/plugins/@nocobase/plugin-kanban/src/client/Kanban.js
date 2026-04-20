/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observer, RecursionField, useField, useFieldSchema, useForm } from '@formily/react';
import { RecordProvider, SchemaComponentOptions, useCreateActionProps as useCAP, useCollection, useCollectionParentRecordData, useProps, withDynamicSchemaProps, withSkeletonComponent, } from '@nocobase/client';
import { Card, Skeleton, Spin, Tag } from 'antd';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Board } from './board';
import { KanbanCardContext, KanbanColumnContext } from './context';
import { useStyles } from './style';
const useCreateActionProps = () => {
    const form = useForm();
    const { column, groupField } = useContext(KanbanColumnContext);
    const { onClick } = useCAP();
    return {
        async onClick() {
            form.setValuesIn(groupField.name, column.id);
            await onClick();
        },
    };
};
export const toColumns = (groupField, dataSource = [], primaryKey) => {
    const columns = {
        __unknown__: {
            id: '__unknown__',
            title: 'Unknown',
            color: 'default',
            cards: [],
        },
    };
    groupField.uiSchema.enum.forEach((item) => {
        columns[item.value] = {
            id: item.value,
            title: item.label,
            color: item.color,
            cards: [],
        };
    });
    dataSource.forEach((ds) => {
        const value = ds[groupField.name];
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
const MemorizedRecursionField = React.memo(RecursionField);
MemorizedRecursionField.displayName = 'MemorizedRecursionField';
export const Kanban = withDynamicSchemaProps(withSkeletonComponent(observer((props) => {
    const { styles } = useStyles();
    // 新版 UISchema（1.0 之后）中已经废弃了 useProps，这里之所以继续保留是为了兼容旧版的 UISchema
    const { groupField, onCardDragEnd, dataSource, setDataSource, ...restProps } = useProps(props);
    const collection = useCollection();
    const primaryKey = collection.getPrimaryKey();
    const parentRecordData = useCollectionParentRecordData();
    const field = useField();
    const fieldSchema = useFieldSchema();
    const [disableCardDrag, setDisableCardDrag] = useState(false);
    const schemas = useMemo(() => fieldSchema.reduceProperties((buf, current) => {
        if (current['x-component'].endsWith('.Card')) {
            buf.card = current;
        }
        else if (current['x-component'].endsWith('.CardAdder')) {
            buf.cardAdder = current;
        }
        else if (current['x-component'].endsWith('.CardViewer')) {
            buf.cardViewer = current;
        }
        return buf;
    }, { card: null, cardAdder: null, cardViewer: null }), []);
    const handleCardRemove = useCallback((card, column) => {
        const updatedBoard = Board.removeCard({ columns: field.value }, column, card);
        field.value = updatedBoard.columns;
        setDataSource(updatedBoard.columns);
    }, [field]);
    const lastDraggedCard = useRef(null);
    const handleCardDragEnd = useCallback((card, fromColumn, toColumn) => {
        lastDraggedCard.current = card[primaryKey];
        onCardDragEnd?.({ columns: field.value, groupField }, fromColumn, toColumn);
        const updatedBoard = Board.moveCard({ columns: field.value }, fromColumn, toColumn);
        field.value = updatedBoard.columns;
        setDataSource(updatedBoard.columns);
    }, [field]);
    return (React.createElement(Spin, { wrapperClassName: styles.nbKanban, spinning: field.loading || false },
        React.createElement(Board, { ...restProps, allowAddCard: !!schemas.cardAdder, disableColumnDrag: true, cardAdderPosition: 'bottom', disableCardDrag: restProps.disableCardDrag || disableCardDrag, onCardRemove: handleCardRemove, onCardDragEnd: handleCardDragEnd, renderColumnHeader: ({ title, color }) => (React.createElement("div", { className: 'react-kanban-column-header' },
                React.createElement(Tag, { color: color }, title))), renderCard: (card, { column }) => {
                const columnIndex = dataSource?.indexOf(column);
                const cardIndex = column?.cards?.indexOf(card);
                const { ref, inView } = useInView({
                    threshold: 0,
                    triggerOnce: true,
                    initialInView: lastDraggedCard.current && lastDraggedCard.current === card[primaryKey],
                });
                return (schemas.card && (React.createElement(RecordProvider, { record: card, parent: parentRecordData },
                    React.createElement(KanbanCardContext.Provider, { value: {
                            setDisableCardDrag,
                        } },
                        React.createElement("div", { ref: ref }, inView ? (React.createElement(MemorizedRecursionField, { name: 'card', schema: fieldSchema.properties.card })) : (React.createElement(Card, { bordered: false },
                            React.createElement(Skeleton, { paragraph: { rows: 4 } }))))))));
            }, renderCardAdder: ({ column }) => {
                if (!schemas.cardAdder) {
                    return null;
                }
                return (React.createElement(KanbanColumnContext.Provider, { value: { column, groupField } },
                    React.createElement(SchemaComponentOptions, { scope: { useCreateActionProps } },
                        React.createElement(MemorizedRecursionField, { name: schemas.cardAdder.name, schema: schemas.cardAdder }))));
            } }, {
            columns: dataSource || [],
        })));
})), { displayName: 'Kanban' });
//# sourceMappingURL=Kanban.js.map