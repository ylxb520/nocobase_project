/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Tag, Tooltip, message } from 'antd';
import { cloneDeep } from 'lodash';
import { InfoOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { createForm } from '@formily/core';
import { useForm } from '@formily/react';
import { ActionContextProvider, FormProvider, SchemaComponent, css, cx, useAPIClient, useActionContext, useCompile, usePlugin, useResourceActionContext, } from '@nocobase/client';
import WorkflowPlugin, { useWorkflowExecuted } from '..';
import { useFlowContext } from '../FlowContext';
import { DrawerDescription } from '../components/DrawerDescription';
import { NAMESPACE, lang } from '../locale';
import useStyles from '../style';
function useUpdateConfigAction() {
    const form = useForm();
    const api = useAPIClient();
    const { workflow } = useFlowContext() ?? {};
    const executed = useWorkflowExecuted();
    const ctx = useActionContext();
    const { refresh } = useResourceActionContext();
    return {
        async run() {
            if (executed) {
                message.error(lang('Trigger in executed workflow cannot be modified'));
                return;
            }
            await form.submit();
            await api.resource('workflows').update({
                filterByTk: workflow.id,
                values: {
                    config: form.values,
                },
            });
            ctx.setFormValueChanged(false);
            ctx.setVisible(false);
            refresh();
        },
    };
}
export class Trigger {
    sync;
    title;
    description;
    fieldset;
    triggerFieldset;
    validate(config) {
        return true;
    }
    view;
    scope;
    components;
    initializers;
    isActionTriggerable_deprecated;
}
function TriggerExecution() {
    const compile = useCompile();
    const { workflow, execution } = useFlowContext();
    const { styles } = useStyles();
    const trigger = useTrigger();
    if (!execution) {
        return null;
    }
    return (React.createElement(SchemaComponent, { components: {
            Tooltip,
        }, schema: {
            type: 'void',
            name: 'execution',
            'x-decorator': 'Tooltip',
            'x-decorator-props': {
                title: lang('View result'),
            },
            'x-component': 'Action',
            'x-component-props': {
                title: React.createElement(InfoOutlined, null),
                shape: 'circle',
                size: 'small',
                className: styles.nodeJobButtonClass,
                type: 'primary',
            },
            properties: {
                [execution.id]: {
                    type: 'void',
                    'x-decorator': 'Form',
                    'x-decorator-props': {
                        initialValue: execution,
                    },
                    'x-component': 'Action.Modal',
                    title: (React.createElement("div", { className: cx(styles.nodeTitleClass) },
                        React.createElement(Tag, null, compile(trigger.title)),
                        React.createElement("strong", null, workflow.title),
                        React.createElement("span", { className: "workflow-node-id" },
                            "#",
                            execution.id))),
                    properties: {
                        createdAt: {
                            type: 'string',
                            title: `{{t("Triggered at", { ns: "${NAMESPACE}" })}}`,
                            'x-decorator': 'FormItem',
                            'x-component': 'DatePicker',
                            'x-component-props': {
                                showTime: true,
                            },
                            'x-read-pretty': true,
                        },
                        context: {
                            type: 'object',
                            title: `{{t("Trigger variables", { ns: "${NAMESPACE}" })}}`,
                            'x-decorator': 'FormItem',
                            'x-component': 'Input.JSON',
                            'x-component-props': {
                                className: styles.nodeJobResultClass,
                                autoSize: {
                                    minRows: 4,
                                    maxRows: 32,
                                },
                            },
                            'x-disabled': true,
                        },
                    },
                },
            },
        } }));
}
function useFormProviderProps() {
    return { form: useForm() };
}
export const TriggerConfig = () => {
    const api = useAPIClient();
    const { workflow, refresh } = useFlowContext();
    const [editingTitle, setEditingTitle] = useState('');
    const [editingConfig, setEditingConfig] = useState(false);
    const [formValueChanged, setFormValueChanged] = useState(false);
    const { styles } = useStyles();
    const compile = useCompile();
    const trigger = useTrigger();
    const executed = useWorkflowExecuted();
    useEffect(() => {
        if (workflow) {
            setEditingTitle(workflow.triggerTitle ?? workflow.title ?? compile(trigger?.title));
        }
    }, [workflow, trigger]);
    const form = useMemo(() => {
        const values = cloneDeep(workflow.config);
        return createForm({
            initialValues: values,
            disabled: Boolean(executed),
        });
    }, [workflow]);
    const resetForm = useCallback((editing) => {
        setEditingConfig(editing);
        if (!editing) {
            form.reset();
        }
    }, [form]);
    const onChangeTitle = useCallback(async function (next) {
        const t = next || compile(trigger?.title);
        setEditingTitle(t);
        if (t === workflow.triggerTitle) {
            return;
        }
        await api.resource('workflows').update({
            filterByTk: workflow.id,
            values: {
                triggerTitle: t,
            },
        });
        refresh();
    }, [workflow, trigger]);
    const onOpenDrawer = useCallback(function (ev) {
        if (ev.target === ev.currentTarget) {
            setEditingConfig(true);
            return;
        }
        const whiteSet = new Set(['workflow-node-meta', 'workflow-node-config-button', 'ant-input-disabled']);
        for (let el = ev.target; el && el !== ev.currentTarget; el = el.parentNode) {
            if (Array.from(el.classList ?? []).some((name) => whiteSet.has(name))) {
                setEditingConfig(true);
                ev.stopPropagation();
                return;
            }
        }
    }, []);
    const titleText = lang('Trigger');
    if (!trigger) {
        return (React.createElement(Tooltip, { title: lang('Workflow with unknown type will cause error. Please delete it or check plugin which provide this type.') },
            React.createElement("div", { role: "button", "aria-label": `${titleText}-${editingTitle}`, className: cx(styles.nodeCardClass, 'invalid'), onClick: onOpenDrawer },
                React.createElement("div", { className: styles.nodeHeaderClass },
                    React.createElement("div", { className: cx(styles.nodeMetaClass, 'workflow-node-meta') },
                        React.createElement(Tag, { color: "error" }, lang('Unknown trigger')))),
                React.createElement("div", { className: "workflow-node-title" },
                    React.createElement(Input.TextArea, { value: editingTitle, disabled: true, autoSize: true })))));
    }
    const { fieldset, scope, components } = trigger;
    return (React.createElement("div", { role: "button", "aria-label": `${titleText}-${editingTitle}`, className: cx(styles.nodeCardClass), onClick: onOpenDrawer },
        React.createElement("div", { className: styles.nodeHeaderClass },
            React.createElement("div", { className: cx(styles.nodeMetaClass, 'workflow-node-meta') },
                React.createElement(Tag, { color: "gold" },
                    React.createElement(ThunderboltOutlined, null),
                    React.createElement("span", { className: "type" }, compile(trigger.title)))),
            React.createElement("div", { className: "workflow-node-actions" },
                React.createElement(TriggerExecution, null))),
        React.createElement("div", { className: "workflow-node-title" },
            React.createElement(Input.TextArea, { value: editingTitle, onChange: (ev) => setEditingTitle(ev.target.value), onBlur: (ev) => onChangeTitle(ev.target.value), autoSize: true, disabled: Boolean(executed) })),
        React.createElement(ActionContextProvider, { value: {
                visible: editingConfig,
                setVisible: resetForm,
                formValueChanged,
                setFormValueChanged,
            } },
            React.createElement(FormProvider, { form: form },
                React.createElement(SchemaComponent, { scope: {
                        ...scope,
                        useFormProviderProps,
                    }, components: components, schema: {
                        name: `workflow-trigger-${workflow.id}`,
                        type: 'void',
                        properties: {
                            // config: {
                            //   type: 'void',
                            //   'x-content': detailText,
                            //   'x-component': Button,
                            //   'x-component-props': {
                            //     type: 'link',
                            //     className: 'workflow-node-config-button',
                            //   },
                            // },
                            drawer: {
                                type: 'void',
                                title: titleText,
                                'x-component': 'Action.Drawer',
                                'x-decorator': 'FormV2',
                                'x-use-decorator-props': 'useFormProviderProps',
                                properties: {
                                    ...(trigger.description
                                        ? {
                                            description: {
                                                type: 'void',
                                                'x-component': DrawerDescription,
                                                'x-component-props': {
                                                    label: lang('Trigger type'),
                                                    title: trigger.title,
                                                    description: trigger.description,
                                                },
                                            },
                                        }
                                        : {}),
                                    fieldset: {
                                        type: 'void',
                                        'x-component': 'fieldset',
                                        'x-component-props': {
                                            className: css `
                          .ant-select.auto-width {
                            width: auto;
                            min-width: 6em;
                          }
                        `,
                                        },
                                        properties: fieldset,
                                    },
                                    actions: {
                                        ...(executed
                                            ? {}
                                            : {
                                                type: 'void',
                                                'x-component': 'Action.Drawer.Footer',
                                                properties: {
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
                                                            useAction: useUpdateConfigAction,
                                                        },
                                                    },
                                                },
                                            }),
                                    },
                                },
                            },
                        },
                    } })))));
};
/**
 * @experimental
 */
export function useTrigger() {
    const workflowPlugin = usePlugin(WorkflowPlugin);
    const { workflow } = useFlowContext();
    if (!workflow?.type) {
        return null;
    }
    return workflowPlugin.triggers.get(workflow.type);
}
//# sourceMappingURL=index.js.map