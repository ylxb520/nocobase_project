/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CaretRightOutlined, CloseOutlined, CopyOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { createForm } from '@formily/core';
import { toJS } from '@formily/reactive';
import { observer, useField, useForm } from '@formily/react';
import { Alert, App, Button, Collapse, Dropdown, Empty, Input, Space, Tag, Tooltip, message } from 'antd';
import { cloneDeep, get, set } from 'lodash';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionContextProvider, FormProvider, SchemaComponent, Variable, css, cx, useAPIClient, useActionContext, useCompile, usePlugin, useResourceActionContext, } from '@nocobase/client';
import { parse, str2moment } from '@nocobase/utils/client';
import WorkflowPlugin from '..';
import { AddNodeSlot } from '../AddNodeContext';
import { useFlowContext } from '../FlowContext';
import { DrawerDescription } from '../components/DrawerDescription';
import { StatusButton } from '../components/StatusButton';
import { JobStatusOptionsMap } from '../constants';
import { useGetAriaLabelOfAddButton, useWorkflowExecuted } from '../hooks';
import { lang } from '../locale';
import useStyles from '../style';
import { WorkflowVariableInput } from '../variable';
import { useRemoveNodeContext } from '../RemoveNodeContext';
import { useNodeDragContext } from '../NodeDragContext';
import { useNodeClipboardContext } from '../NodeClipboardContext';
export class Instruction {
    title;
    type;
    group;
    description;
    icon;
    /**
     * @deprecated migrate to `presetFieldset` instead
     */
    options;
    fieldset;
    /**
     * @experimental
     */
    presetFieldset;
    /**
     * To presentation if the instruction is creating a branch
     * @experimental
     */
    branching;
    /**
     * @experimental
     */
    view;
    scope;
    components;
    /**
     * @experimental
     */
    createDefaultConfig() {
        return {};
    }
    end;
    testable;
}
function useUpdateAction() {
    const form = useForm();
    const api = useAPIClient();
    const ctx = useActionContext();
    const { refresh } = useResourceActionContext();
    const data = useNodeContext();
    const executed = useWorkflowExecuted();
    return {
        async run() {
            if (executed) {
                message.error(lang('Node in executed workflow cannot be modified'));
                return;
            }
            await form.submit();
            await updateNodeConfig({
                api,
                nodeId: data.id,
                config: form.values,
            });
            form.setInitialValues(toJS(form.values));
            ctx.setFormValueChanged(false);
            ctx.setVisible(false);
            refresh();
        },
    };
}
export async function updateNodeConfig({ api, nodeId, config, resourceName = 'flow_nodes' }) {
    await api.resource(resourceName).update?.({
        filterByTk: nodeId,
        values: {
            config,
        },
    });
}
export const NodeContext = React.createContext({});
export function useNodeContext() {
    return useContext(NodeContext);
}
export function useNodeSavedConfig(keys = []) {
    const node = useNodeContext();
    return keys.some((key) => get(node.config, key) != null);
}
/**
 * @experimental
 */
export function useAvailableUpstreams(node, filter) {
    const stack = [];
    if (!node) {
        return [];
    }
    for (let current = node.upstream; current; current = current.upstream) {
        if (typeof filter !== 'function' || filter(current)) {
            stack.push(current);
        }
    }
    return stack;
}
/**
 * @experimental
 */
export function useUpstreamScopes(node) {
    const stack = [];
    for (let current = node; current; current = current.upstream) {
        if (current.upstream && current.branchIndex != null) {
            stack.push(current.upstream);
        }
    }
    return stack;
}
export function Node({ data }) {
    const { styles } = useStyles();
    const { getAriaLabel } = useGetAriaLabelOfAddButton(data);
    const workflowPlugin = usePlugin(WorkflowPlugin);
    const { Component = NodeDefaultView, end } = workflowPlugin.instructions.get(data.type) ?? {};
    return (React.createElement(NodeContext.Provider, { value: data },
        React.createElement("div", { className: cx(styles.nodeBlockClass) },
            React.createElement(Component, { data: data }),
            !end || (typeof end === 'function' && !end(data)) ? (React.createElement(AddNodeSlot, { "aria-label": getAriaLabel(), upstream: data })) : (React.createElement("div", { className: "end-sign" },
                React.createElement(CloseOutlined, null))))));
}
export function RemoveButton() {
    const { t } = useTranslation();
    const api = useAPIClient();
    const { workflow, nodes, refresh } = useFlowContext() ?? {};
    const current = useNodeContext();
    const { modal } = App.useApp();
    const executed = useWorkflowExecuted();
    const removeNodeContext = useRemoveNodeContext();
    const clipboard = useNodeClipboardContext();
    const isCopiedSelf = Boolean(clipboard?.clipboard?.sourceId && clipboard.clipboard.sourceId === current.id);
    const onOk = useCallback(async () => {
        await api.resource('flow_nodes').destroy?.({
            filterByTk: current.id,
        });
        refresh();
    }, [current.id, refresh, api]);
    const onRemove = useCallback(async () => {
        const branches = nodes.filter((item) => item.upstream === current && item.branchIndex != null);
        if (!branches.length) {
            const usingNodes = nodes.filter((node) => {
                if (node === current) {
                    return false;
                }
                const template = parse(node.config);
                const refs = template.parameters.filter(({ key }) => key.startsWith(`$jobsMapByNodeKey.${current.key}.`) || key === `$jobsMapByNodeKey.${current.key}`);
                return refs.length;
            });
            if (usingNodes.length) {
                modal.error({
                    title: lang('Can not delete'),
                    content: lang('The result of this node has been referenced by other nodes ({{nodes}}), please remove the usage before deleting.', { nodes: usingNodes.map((item) => item.title).join(', ') }),
                });
                return;
            }
            modal.confirm({
                title: t('Delete'),
                content: t('Are you sure you want to delete it?'),
                onOk,
            });
        }
        else {
            removeNodeContext?.setDeletingNode(current);
        }
    }, [current, modal, nodes, onOk, removeNodeContext, t]);
    const onCopy = useCallback(() => {
        if (isCopiedSelf) {
            clipboard?.clearClipboard?.();
            return;
        }
        clipboard?.copyNode?.(current);
    }, [clipboard, current, isCopiedSelf]);
    if (!workflow || executed) {
        return null;
    }
    return (React.createElement(Dropdown, { trigger: ['hover'], menu: {
            items: [
                {
                    key: 'copy',
                    label: isCopiedSelf ? lang('Cancel copy') : lang('Copy'),
                    icon: isCopiedSelf ? undefined : React.createElement(CopyOutlined, null),
                },
                {
                    type: 'divider',
                },
                {
                    key: 'delete',
                    label: t('Delete'),
                    icon: React.createElement(DeleteOutlined, null),
                    danger: true,
                },
            ],
            onClick: ({ key }) => {
                if (key === 'copy') {
                    onCopy();
                }
                if (key === 'delete') {
                    onRemove();
                }
            },
        } },
        React.createElement(Button, { type: "text", shape: "circle", icon: React.createElement(EllipsisOutlined, null), className: "workflow-node-action-button", size: "small" })));
}
export function JobButton() {
    const { execution, setViewJob } = useFlowContext();
    const { jobs } = useNodeContext() ?? {};
    const { styles } = useStyles();
    const onOpenJobInList = useCallback(({ key }) => {
        if (!jobs?.length) {
            return;
        }
        const job = jobs.find((item) => item.id == key);
        setViewJob(job);
    }, [jobs, setViewJob]);
    const onOpenOnlyJob = useCallback(() => {
        const job = jobs?.[0];
        if (!job) {
            return;
        }
        setViewJob(job);
    }, [jobs, setViewJob]);
    if (!execution) {
        return null;
    }
    if (!jobs?.length) {
        return React.createElement(StatusButton, { className: styles.nodeJobButtonClass, disabled: true });
    }
    return (React.createElement(Tooltip, { title: lang('View result') }, jobs?.length > 1 ? (React.createElement(Dropdown, { menu: {
            items: jobs.map((job) => {
                return {
                    key: job.id,
                    label: (React.createElement(React.Fragment, null,
                        React.createElement(StatusButton, { statusMap: JobStatusOptionsMap, status: job.status }),
                        React.createElement("time", null, str2moment(job.updatedAt).format('YYYY-MM-DD HH:mm:ss')))),
                };
            }),
            onClick: onOpenJobInList,
            className: styles.dropdownClass,
        } },
        React.createElement(StatusButton, { statusMap: JobStatusOptionsMap, status: jobs[jobs.length - 1].status, className: styles.nodeJobButtonClass }))) : (React.createElement(StatusButton, { statusMap: JobStatusOptionsMap, status: jobs?.[0].status, onClick: onOpenOnlyJob, className: styles.nodeJobButtonClass }))));
}
function useFormProviderProps() {
    return { form: useForm() };
}
const useRunAction = () => {
    const { values, query } = useForm();
    const node = useNodeContext();
    const api = useAPIClient();
    const ctx = useActionContext();
    const field = useField();
    return {
        async run() {
            const template = parse(node.config);
            const config = template(toJS(values.config));
            const logField = query('log').take();
            const resultField = query('result').take();
            resultField.setValue(null);
            resultField.setFeedback({});
            field.data = field.data || {};
            field.data.loading = true;
            try {
                const { data: { data }, } = await api.resource('flow_nodes').test({
                    values: {
                        config,
                        type: node.type,
                    },
                });
                resultField.setFeedback({
                    type: data.status > 0 ? 'success' : 'error',
                    messages: data.status > 0 ? [lang('Resolved')] : [lang('Failed')],
                });
                resultField.setValue(data.result);
                logField.setValue(data.log || '');
            }
            catch (err) {
                resultField.setFeedback({
                    type: 'error',
                    messages: err.message,
                });
            }
            field.data.loading = false;
        },
    };
};
const VariableKeysContext = createContext([]);
function VariableReplacer({ name, value, onChange }) {
    return (React.createElement(Space, null,
        React.createElement(WorkflowVariableInput, { variableOptions: {}, value: `{{${name}}}`, disabled: true }),
        React.createElement(Variable.Input, { useTypedConstant: ['string', 'number', 'boolean', 'date', 'object'], value: value, onChange: onChange })));
}
function TestFormFieldset({ value, onChange }) {
    const keys = useContext(VariableKeysContext);
    return keys.length ? (React.createElement(React.Fragment, null, keys.map((key) => (React.createElement(VariableReplacer, { key: key, name: key, value: get(value, key), onChange: (v) => {
            set(value, key, v);
            onChange(toJS(value));
        } }))))) : (React.createElement(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE, description: lang('No variable'), style: { margin: '1em' } }));
}
function LogCollapse({ value }) {
    return value ? (React.createElement(Collapse, { ghost: true, items: [
            {
                key: 'log',
                label: lang('Log'),
                children: (React.createElement(Input.TextArea, { value: value, autoSize: { minRows: 5, maxRows: 20 }, style: { whiteSpace: 'pre', cursor: 'text', fontFamily: 'monospace', fontSize: '80%' }, disabled: true })),
            },
        ], className: css `
        .ant-collapse-item > .ant-collapse-header {
          padding: 0;
        }
        .ant-collapse-content > .ant-collapse-content-box {
          padding: 0;
        }
      ` })) : null;
}
function useCancelAction() {
    const form = useForm();
    const ctx = useActionContext();
    return {
        async run() {
            const resultField = form.query('result').take();
            resultField.setFeedback();
            form.setValues({ result: null, log: null });
            form.clearFormGraph('*');
            form.reset();
            ctx.setVisible(false);
        },
    };
}
function TestButton() {
    const node = useNodeContext();
    const { values } = useForm();
    const [visible, setVisible] = useState(false);
    const template = parse(values);
    const keys = template.parameters.map((item) => item.key);
    const form = useMemo(() => createForm(), []);
    const onOpen = useCallback(() => {
        setVisible(true);
    }, []);
    const setModalVisible = useCallback((v) => {
        if (v) {
            setVisible(true);
            return;
        }
        const resultField = form.query('result').take();
        resultField?.setFeedback();
        form.setValues({ result: null, log: null });
        form.clearFormGraph('*');
        form.reset();
        setVisible(false);
    }, [form]);
    return (React.createElement(NodeContext.Provider, { value: { ...node, config: values } },
        React.createElement(VariableKeysContext.Provider, { value: keys },
            React.createElement(ActionContextProvider, { value: { visible, setVisible: setModalVisible } },
                React.createElement(Button, { icon: React.createElement(CaretRightOutlined, null), onClick: onOpen }, lang('Test run')),
                React.createElement(SchemaComponent, { components: {
                        Alert,
                        TestFormFieldset,
                        LogCollapse,
                    }, scope: {
                        useCancelAction,
                        useRunAction,
                    }, schema: {
                        type: 'void',
                        name: 'modal',
                        'x-decorator': 'FormV2',
                        'x-decorator-props': {
                            form,
                        },
                        'x-component': 'Action.Modal',
                        title: `{{t("Test run", { ns: "workflow" })}}`,
                        properties: {
                            alert: {
                                type: 'void',
                                'x-component': 'Alert',
                                'x-component-props': {
                                    message: `{{t("Test run will do the actual data manipulating or API calling, please use with caution.", { ns: "workflow" })}}`,
                                    type: 'warning',
                                    showIcon: true,
                                    className: css `
                      margin-bottom: 1em;
                    `,
                                },
                            },
                            config: {
                                type: 'object',
                                title: '{{t("Replace variables", { ns: "workflow" })}}',
                                'x-decorator': 'FormItem',
                                'x-component': 'TestFormFieldset',
                            },
                            actions: {
                                type: 'void',
                                'x-component': 'ActionBar',
                                properties: {
                                    submit: {
                                        type: 'void',
                                        title: '{{t("Run")}}',
                                        'x-component': 'Action',
                                        'x-component-props': {
                                            type: 'primary',
                                            useAction: '{{ useRunAction }}',
                                        },
                                    },
                                },
                            },
                            result: {
                                type: 'string',
                                title: `{{t("Result", { ns: "workflow" })}}`,
                                'x-decorator': 'FormItem',
                                'x-component': 'Input.JSON',
                                'x-component-props': {
                                    autoSize: {
                                        minRows: 5,
                                        maxRows: 20,
                                    },
                                    style: {
                                        whiteSpace: 'pre',
                                        cursor: 'text',
                                    },
                                },
                                'x-pattern': 'disabled',
                            },
                            log: {
                                type: 'string',
                                'x-component': 'LogCollapse',
                            },
                        },
                    } })))));
}
export function NodeDefaultView(props) {
    const { data, children } = props;
    const compile = useCompile();
    const api = useAPIClient();
    const { workflow, refresh } = useFlowContext() ?? {};
    const { styles } = useStyles();
    const workflowPlugin = usePlugin(WorkflowPlugin);
    const executed = useWorkflowExecuted();
    const dragContext = useNodeDragContext();
    const clipboard = useNodeClipboardContext();
    const [editingTitle, setEditingTitle] = useState(data.title);
    const [editingConfig, setEditingConfig] = useState(false);
    const [formValueChanged, setFormValueChanged] = useState(false);
    const instruction = workflowPlugin.instructions.get(data.type);
    const isDraggingSelf = Boolean(dragContext?.dragging && dragContext?.dragNode?.id === data.id);
    const isCopiedSelf = Boolean(clipboard?.clipboard?.sourceId && clipboard.clipboard.sourceId === data.id);
    const isActive = Boolean(editingConfig || isCopiedSelf || isDraggingSelf);
    const form = useMemo(() => {
        const values = cloneDeep(data.config);
        return createForm({
            initialValues: values,
            disabled: Boolean(executed),
        });
    }, [data, workflow]);
    const resetForm = useCallback((editing) => {
        setEditingConfig(editing);
        if (!editing) {
            form.reset();
        }
    }, [form]);
    const onChangeTitle = useCallback(async function (next) {
        const title = next || compile(instruction?.title);
        setEditingTitle(title);
        if (title === data.title) {
            return;
        }
        await api.resource('flow_nodes').update?.({
            filterByTk: data.id,
            values: {
                title,
            },
        });
        refresh();
    }, [data, instruction]);
    const onOpenDrawer = useCallback(function (ev) {
        if (dragContext?.consumeClick?.()) {
            ev.preventDefault();
            return;
        }
        if (ev.target === ev.currentTarget) {
            setEditingConfig(true);
            return;
        }
        const whiteSet = new Set(['workflow-node-meta', 'workflow-node-config-button', 'ant-input-disabled']);
        for (let el = ev.target; el && el !== ev.currentTarget && el !== document.documentElement; el = el.parentNode) {
            if (Array.from(el.classList).some((name) => whiteSet.has(name))) {
                setEditingConfig(true);
                ev.stopPropagation();
                return;
            }
        }
    }, [dragContext]);
    const onCardMouseDown = useCallback((event) => {
        dragContext?.onNodeMouseDown?.(data, event);
    }, [data, dragContext]);
    if (!instruction) {
        return (React.createElement("div", { className: cx(styles.nodeClass, `workflow-node-type-${data.type}`) },
            React.createElement(Tooltip, { title: lang('Node with unknown type will cause error. Please delete it or check plugin which provide this type.') },
                React.createElement("div", { role: "button", "aria-label": `_untyped-${editingTitle}`, className: cx(styles.nodeCardClass, 'invalid', {
                        dragging: isDraggingSelf,
                        active: isActive,
                    }), onMouseDown: onCardMouseDown },
                    React.createElement("div", { className: styles.nodeHeaderClass },
                        React.createElement("div", { className: cx(styles.nodeMetaClass, 'workflow-node-meta') },
                            React.createElement(Tag, { color: "error" }, lang('Unknown node')),
                            React.createElement("span", { className: "workflow-node-id" }, data.id)),
                        React.createElement("div", { className: "workflow-node-actions" },
                            React.createElement(RemoveButton, null),
                            React.createElement(JobButton, null))),
                    React.createElement(Input.TextArea, { value: editingTitle, disabled: true, autoSize: true })))));
    }
    const typeTitle = compile(instruction.title);
    return (React.createElement("div", { className: cx(styles.nodeClass, `workflow-node-type-${data.type}`) },
        React.createElement("div", { role: "button", "aria-label": `${typeTitle}-${editingTitle}`, className: cx(styles.nodeCardClass, {
                configuring: editingConfig,
                dragging: isDraggingSelf,
                active: isActive,
            }), onMouseDown: onCardMouseDown, onClick: onOpenDrawer },
            React.createElement("div", { className: styles.nodeHeaderClass },
                React.createElement("div", { className: cx(styles.nodeMetaClass, 'workflow-node-meta') },
                    React.createElement(Tag, { icon: instruction.icon }, typeTitle),
                    React.createElement("span", { className: "workflow-node-id" }, data.id)),
                React.createElement("div", { className: "workflow-node-actions" },
                    React.createElement(RemoveButton, null),
                    React.createElement(JobButton, null))),
            React.createElement(Input.TextArea, { disabled: Boolean(executed), value: editingTitle, onChange: (ev) => setEditingTitle(ev.target.value), onBlur: (ev) => onChangeTitle(ev.target.value), autoSize: true }),
            React.createElement(ActionContextProvider, { value: {
                    visible: editingConfig,
                    setVisible: resetForm,
                    formValueChanged,
                    setFormValueChanged,
                } },
                React.createElement(FormProvider, { form: form },
                    React.createElement(SchemaComponent, { distributed: false, scope: {
                            ...instruction.scope,
                            useFormProviderProps,
                            useUpdateAction,
                        }, components: instruction.components, schema: {
                            type: 'void',
                            properties: {
                                ...(instruction.view ? { view: instruction.view } : {}),
                                // button: {
                                //   type: 'void',
                                //   'x-content': detailText,
                                //   'x-component': Button,
                                //   'x-component-props': {
                                //     type: 'link',
                                //     className: 'workflow-node-config-button',
                                //   },
                                // },
                                [data.id]: {
                                    type: 'void',
                                    title: (React.createElement("div", { className: css `
                          display: flex;
                          justify-content: space-between;

                          strong {
                            font-weight: bold;
                          }

                          .ant-tag {
                            margin-inline-end: 0;
                          }

                          code {
                            font-weight: normal;
                          }
                        ` },
                                        React.createElement("strong", null, data.title),
                                        React.createElement(Tooltip, { title: lang('Variable key of node') },
                                            React.createElement(Tag, null,
                                                React.createElement("code", null, data.key))))),
                                    'x-decorator': 'FormV2',
                                    'x-use-decorator-props': 'useFormProviderProps',
                                    'x-component': 'Action.Drawer',
                                    properties: {
                                        ...(instruction.description
                                            ? {
                                                description: {
                                                    type: 'void',
                                                    'x-component': DrawerDescription,
                                                    'x-component-props': {
                                                        label: lang('Node type'),
                                                        title: instruction.title,
                                                        icon: instruction.icon,
                                                        description: instruction.description,
                                                    },
                                                },
                                            }
                                            : {}),
                                        fieldset: {
                                            type: 'void',
                                            'x-component': 'fieldset',
                                            properties: instruction.fieldset,
                                        },
                                        footer: executed
                                            ? null
                                            : {
                                                type: 'void',
                                                'x-component': 'Action.Drawer.Footer',
                                                properties: {
                                                    actions: {
                                                        type: 'void',
                                                        'x-component': 'ActionBar',
                                                        'x-component-props': {
                                                            style: {
                                                                flexGrow: 1,
                                                            },
                                                        },
                                                        properties: {
                                                            ...(instruction.testable
                                                                ? {
                                                                    test: {
                                                                        type: 'void',
                                                                        'x-component': observer(TestButton),
                                                                        'x-align': 'left',
                                                                    },
                                                                }
                                                                : {}),
                                                            cancel: {
                                                                title: '{{t("Cancel")}}',
                                                                'x-component': 'Action',
                                                                'x-component-props': {
                                                                    useAction: '{{ cm.useCancelAction }}',
                                                                },
                                                            },
                                                            submit: {
                                                                title: '{{t("Submit")}}',
                                                                'x-component': 'Action',
                                                                'x-component-props': {
                                                                    type: 'primary',
                                                                    useAction: '{{ useUpdateAction }}',
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                    },
                                },
                            },
                        } })))),
        children));
}
//# sourceMappingURL=index.js.map