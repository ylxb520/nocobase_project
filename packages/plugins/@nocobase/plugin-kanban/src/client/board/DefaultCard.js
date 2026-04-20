/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
function DefaultCard({ children: card, dragging, allowRemoveCard, onCardRemove }) {
    return (React.createElement("div", { className: `react-kanban-card ${dragging ? 'react-kanban-card--dragging' : ''}` },
        React.createElement("span", null,
            React.createElement("div", { className: "react-kanban-card__title" },
                React.createElement("span", null, card.title),
                allowRemoveCard && (React.createElement("span", { style: { cursor: 'pointer' }, onClick: () => onCardRemove(card) }, "\u00D7")))),
        React.createElement("div", { className: "react-kanban-card__description" }, card.description)));
}
export default DefaultCard;
//# sourceMappingURL=DefaultCard.js.map