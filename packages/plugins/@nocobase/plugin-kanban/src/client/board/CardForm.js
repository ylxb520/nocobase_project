/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useRef } from 'react';
import { when } from './utils';
function CardForm({ onConfirm, onCancel }) {
    const inputCardTitle = useRef();
    const inputCardDescription = useRef();
    function addCard(event) {
        event.preventDefault();
        when(inputCardTitle.current.value)((value) => {
            onConfirm({ title: value, description: inputCardDescription.current.value });
        });
    }
    return (React.createElement("div", { className: "react-kanban-card-adder-form" },
        React.createElement("form", { onSubmit: addCard },
            React.createElement("input", { className: "react-kanban-card-adder-form__title", name: "title", autoFocus: true, defaultValue: "Title", ref: inputCardTitle }),
            React.createElement("input", { className: "react-kanban-card-adder-form__description", name: "description", defaultValue: "Description", ref: inputCardDescription }),
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', marginTop: '5px' } },
                React.createElement("button", { className: "react-kanban-card-adder-form__button", type: "submit" }, "Add"),
                React.createElement("button", { className: "react-kanban-card-adder-form__button", type: "button", onClick: onCancel }, "Cancel")))));
}
export default CardForm;
//# sourceMappingURL=CardForm.js.map