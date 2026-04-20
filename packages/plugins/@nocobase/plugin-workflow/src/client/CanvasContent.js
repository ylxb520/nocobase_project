/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Alert, Button, Slider } from 'antd';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { CloseOutlined } from '@ant-design/icons';
import { cx, css, ErrorFallback, useCompile, usePlugin } from '@nocobase/client';
import WorkflowPlugin from '.';
import { Branch } from './Branch';
import { useNodeClipboardContext } from './NodeClipboardContext';
import { lang } from './locale';
import useStyles from './style';
import { TriggerConfig } from './triggers';
import { useWorkflowExecuted } from './hooks';
export function CanvasContent({ entry }) {
    const { styles } = useStyles();
    const executed = useWorkflowExecuted();
    const clipboard = useNodeClipboardContext();
    const compile = useCompile();
    const workflowPlugin = usePlugin(WorkflowPlugin);
    const [zoom, setZoom] = React.useState(100);
    const copiedNode = clipboard?.clipboard;
    const copiedInstruction = copiedNode ? workflowPlugin.instructions.get(copiedNode.type) : null;
    const copiedTypeTitle = copiedNode ? (copiedInstruction ? compile(copiedInstruction.title) : copiedNode.type) : '';
    return (React.createElement("div", { className: "workflow-canvas-wrapper" },
        React.createElement(ErrorBoundary, { FallbackComponent: ErrorFallback, onError: console.error },
            React.createElement("div", { className: "workflow-canvas", style: { zoom: zoom / 100 } },
                React.createElement("div", { className: cx(styles.branchBlockClass, css `
                margin-top: 0 !important;
              `) },
                    React.createElement("div", { className: styles.branchClass },
                        executed ? (React.createElement(Alert, { type: "warning", message: lang('Executed workflow cannot be modified. Could be copied to a new version to modify.'), showIcon: true, className: css `
                    margin-bottom: 1em;
                  ` })) : null,
                        React.createElement(TriggerConfig, null),
                        React.createElement("div", { className: cx(styles.branchBlockClass, css `
                    margin-top: 0 !important;
                  `) },
                            React.createElement(Branch, { entry: entry })),
                        React.createElement("div", { className: styles.terminalClass }, lang('End')))))),
        copiedNode ? (React.createElement("div", { className: styles.clipboardPreviewClass },
            React.createElement("div", { className: "workflow-clipboard-header" },
                React.createElement("span", null, lang('Copied node')),
                React.createElement(Button, { type: "text", size: "small", icon: React.createElement(CloseOutlined, null), onClick: () => clipboard?.clearClipboard?.() })),
            React.createElement("div", { className: "workflow-clipboard-card" },
                React.createElement("div", { className: "workflow-clipboard-type" }, copiedTypeTitle),
                React.createElement("div", { className: "workflow-clipboard-title" }, copiedNode.title ?? copiedNode.type)))) : null,
        React.createElement("div", { className: "workflow-canvas-zoomer" },
            React.createElement(Slider, { vertical: true, reverse: true, defaultValue: 100, step: 10, min: 10, value: zoom, onChange: setZoom }))));
}
//# sourceMappingURL=CanvasContent.js.map