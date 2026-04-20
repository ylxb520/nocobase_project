/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { cx } from '@nocobase/client';
import { AddNodeSlot } from './AddNodeContext';
import { useGetAriaLabelOfAddButton } from './hooks/useGetAriaLabelOfAddButton';
import { Node } from './nodes';
import useStyles from './style';
export const BranchIndexContext = createContext(null);
export function useBranchIndex() {
    return React.useContext(BranchIndexContext);
}
export function Branch({ from = null, entry = null, branchIndex = null, controller = null, className, end, }) {
    const { styles } = useStyles();
    const { getAriaLabel } = useGetAriaLabelOfAddButton(from, branchIndex);
    const list = [];
    for (let node = entry; node; node = node.downstream) {
        list.push(node);
    }
    return (React.createElement(BranchIndexContext.Provider, { value: branchIndex },
        React.createElement("div", { className: cx('workflow-branch', styles.branchClass, className) },
            React.createElement("div", { className: "workflow-branch-lines" }),
            controller ? React.createElement("div", { className: "workflow-branch-controller" }, controller) : null,
            React.createElement("div", { className: "workflow-node-list" },
                React.createElement(AddNodeSlot, { "aria-label": getAriaLabel(), upstream: from, branchIndex: branchIndex }),
                list.map((item) => (React.createElement(Node, { data: item, key: item.id })))),
            end ? (React.createElement("div", { className: "end-sign" },
                React.createElement(CloseOutlined, null))) : null)));
}
//# sourceMappingURL=Branch.js.map