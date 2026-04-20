/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { forwardRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useKanbanBlockContext } from '../KanbanBlockProvider';
import Card from './Card';
import CardAdder from './CardAdder';
import { pickPropOut } from './utils';
import withDroppable from './withDroppable';
const ColumnEmptyPlaceholder = forwardRef((props, ref) => {
    return (React.createElement("div", { ref: ref, ...props, style: { minHeight: 'inherit', height: 'var(--column-height)', ...props.style } }));
});
ColumnEmptyPlaceholder.displayName = 'ColumnEmptyPlaceholder';
const DroppableColumn = withDroppable(ColumnEmptyPlaceholder);
function Column({ children, index: columnIndex, renderCard, renderCardAdder = ({ column, onConfirm }) => React.createElement(CardAdder, { column: column, onConfirm: onConfirm }), renderColumnHeader, disableColumnDrag, disableCardDrag, onCardNew, allowAddCard, cardAdderPosition = 'top', }) {
    const { fixedBlock } = useKanbanBlockContext();
    const [headerHeight, setHeaderHeight] = useState(0);
    return (React.createElement(Draggable, { draggableId: `column-draggable-${children.id}`, index: columnIndex, isDragDisabled: disableColumnDrag }, (columnProvided) => {
        const draggablePropsWithoutStyle = pickPropOut(columnProvided.draggableProps, 'style');
        return (React.createElement("div", { ref: columnProvided.innerRef, ...draggablePropsWithoutStyle, style: {
                height: '100%',
                minHeight: '28px',
                display: 'inline-block',
                verticalAlign: 'top',
                ...columnProvided.draggableProps.style,
                '--column-height': fixedBlock ? `calc(100% - ${headerHeight}px)` : 'inherit',
            }, className: "react-kanban-column", "data-testid": `column-${children.id}` },
            React.createElement("div", { ref: fixedBlock ? (ref) => setHeaderHeight(Math.ceil(ref?.getBoundingClientRect().height || 0)) : null, ...columnProvided.dragHandleProps }, renderColumnHeader(children)),
            cardAdderPosition === 'top' && allowAddCard && renderCardAdder({ column: children, onConfirm: onCardNew }),
            React.createElement(DroppableColumn, { droppableId: String(children.id) }, children?.cards?.length ? (React.createElement("div", { className: "react-kanban-card-skeleton", style: {
                    height: fixedBlock ? '100%' : undefined,
                } }, children.cards.map((card, index) => (React.createElement(Card, { key: card.id, index: index, renderCard: (dragging) => renderCard(children, card, dragging), disableCardDrag: disableCardDrag }, card))))) : (React.createElement("div", { className: "react-kanban-card-skeleton" }))),
            cardAdderPosition === 'bottom' &&
                allowAddCard &&
                renderCardAdder({ column: children, onConfirm: onCardNew })));
    }));
}
export default Column;
//# sourceMappingURL=Column.js.map