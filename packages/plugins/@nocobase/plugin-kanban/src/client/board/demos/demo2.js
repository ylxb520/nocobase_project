import { Board } from '@nocobase/client';
import { Button, Card } from 'antd';
import React, { useState } from 'react';
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
export default function App() {
    const [controlledBoard, setBoard] = useState(board);
    function handleCardMove(card, source, destination) {
        const updatedBoard = Board.moveCard(controlledBoard, source, destination);
        setBoard(updatedBoard);
    }
    function handleCardRemove(card, column) {
        const updatedBoard = Board.removeCard(controlledBoard, column, card);
        setBoard(updatedBoard);
    }
    return (React.createElement(Board, { disableColumnDrag: true, allowRemoveCard: true, allowAddCard: { on: 'bottom' }, onLaneRemove: console.log, onCardRemove: handleCardRemove, onCardDragEnd: handleCardMove, onLaneRename: console.log, cardAdderPosition: 'bottom', onNewCardConfirm: (draftCard) => draftCard, onCardNew: console.log, renderCard: (card, { column, dragging }) => {
            return React.createElement(Card, { style: { marginBottom: 15 } }, card.title);
        }, renderCardAdder: ({ column }) => {
            return (React.createElement(Button, { block: true, type: 'text', onClick: () => {
                    const updatedBoard = Board.addCard(controlledBoard, column, {
                        id: new Date().getTime(),
                        title: 'Card title ' + new Date().getTime(),
                        description: 'Card content',
                    });
                    setBoard(updatedBoard);
                } }, "\u6DFB\u52A0\u5361\u7247"));
        } }, controlledBoard));
}
//# sourceMappingURL=demo2.js.map