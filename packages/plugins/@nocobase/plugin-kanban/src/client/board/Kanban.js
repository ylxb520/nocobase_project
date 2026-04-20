/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import '@asseinfo/react-kanban/dist/styles.css';
import { Button } from 'antd';
import React, { useState } from 'react';
import Board from './Board';
import { addCard, moveCard, removeCard } from './helpers';
const board = {
    columns: [
        {
            id: 1,
            title: 'Backlog',
            cards: [
                {
                    id: 1,
                    title: 'Card title 1',
                    description: 'Card content',
                },
                {
                    id: 2,
                    title: 'Card title 2',
                    description: 'Card content',
                },
                {
                    id: 3,
                    title: 'Card title 3',
                    description: 'Card content',
                },
            ],
        },
        {
            id: 2,
            title: 'Doing',
            cards: [
                {
                    id: 9,
                    title: 'Card title 9',
                    description: 'Card content',
                },
            ],
        },
        {
            id: 3,
            title: 'Q&A',
            cards: [
                {
                    id: 10,
                    title: 'Card title 10',
                    description: 'Card content',
                },
                {
                    id: 11,
                    title: 'Card title 11',
                    description: 'Card content',
                },
            ],
        },
        {
            id: 4,
            title: 'Production',
            cards: [
                {
                    id: 12,
                    title: 'Card title 12',
                    description: 'Card content',
                },
                {
                    id: 13,
                    title: 'Card title 13',
                    description: 'Card content',
                },
            ],
        },
    ],
};
function UncontrolledBoard() {
    const [controlledBoard, setBoard] = useState(board);
    function handleCardMove(card, source, destination) {
        const updatedBoard = moveCard(controlledBoard, source, destination);
        setBoard(updatedBoard);
    }
    function handleCardRemove(card, column) {
        const updatedBoard = removeCard(controlledBoard, column, card);
        setBoard(updatedBoard);
    }
    return (React.createElement(Board, { disableColumnDrag: true, allowRemoveCard: true, allowAddCard: { on: 'bottom' }, onLaneRemove: console.log, onCardRemove: handleCardRemove, onCardDragEnd: handleCardMove, onLaneRename: console.log, cardAdderPosition: 'bottom', onNewCardConfirm: (draftCard) => draftCard, onCardNew: console.log, renderCardAdder: ({ column }) => {
            return (React.createElement(Button, { block: true, type: 'text', onClick: () => {
                    const updatedBoard = addCard(controlledBoard, column, {
                        id: new Date().getTime(),
                        title: 'Card title ' + new Date().getTime(),
                        description: 'Card content',
                    });
                    setBoard(updatedBoard);
                } }, "\u6DFB\u52A0\u5361\u7247"));
        } }, controlledBoard));
}
export function Kanban() {
    return (React.createElement(React.Fragment, null,
        React.createElement(UncontrolledBoard, null)));
}
//# sourceMappingURL=Kanban.js.map