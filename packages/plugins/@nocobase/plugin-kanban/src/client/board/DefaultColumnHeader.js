/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useState } from 'react';
function ColumnTitle({ allowRenameColumn, onClick, children: title }) {
    return allowRenameColumn ? (React.createElement("span", { style: { cursor: 'pointer' }, onClick: onClick }, title)) : (React.createElement("span", null, title));
}
function useRenameMode(state) {
    const [renameMode, setRenameMode] = useState(state);
    function toggleRenameMode() {
        setRenameMode(!renameMode);
    }
    return [renameMode, toggleRenameMode];
}
function DefaultColumnHeader({ children: column, allowRemoveColumn, onColumnRemove, allowRenameColumn, onColumnRename, }) {
    const [renameMode, toggleRenameMode] = useRenameMode(false);
    const [titleInput, setTitleInput] = useState('');
    function handleRenameColumn(event) {
        event.preventDefault();
        onColumnRename(column, titleInput);
        toggleRenameMode();
    }
    function handleRenameMode() {
        setTitleInput(column.title);
        toggleRenameMode();
    }
    return (React.createElement("div", { className: "react-kanban-column-header" }, renameMode ? (React.createElement("form", { onSubmit: handleRenameColumn },
        React.createElement("span", null,
            React.createElement("input", { type: "text", value: titleInput, onChange: ({ target: { value } }) => setTitleInput(value), autoFocus: true })),
        React.createElement("span", null,
            React.createElement("button", { className: "react-kanban-column-header__button", type: "submit" }, "Rename"),
            React.createElement("button", { className: "react-kanban-column-header__button", type: "button", onClick: handleRenameMode }, "Cancel")))) : (React.createElement(React.Fragment, null,
        React.createElement(ColumnTitle, { allowRenameColumn: allowRenameColumn, onClick: handleRenameMode }, column.title),
        allowRemoveColumn && React.createElement("span", { onClick: () => onColumnRemove(column) }, "\u00D7")))));
}
export default DefaultColumnHeader;
//# sourceMappingURL=DefaultColumnHeader.js.map