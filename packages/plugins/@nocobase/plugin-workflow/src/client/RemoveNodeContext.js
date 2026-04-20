/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { createForm } from '@formily/core';
import { ActionContextProvider, SchemaComponent, useAPIClient, useCancelAction, useCompile, usePlugin, } from '@nocobase/client';
import { lang, NAMESPACE } from './locale';
import { App, Radio, Select, Space } from 'antd';
import { useFlowContext } from './FlowContext';
import { useForm } from '@formily/react';
import PluginWorkflowClient from '.';
import { parse } from '@nocobase/utils/client';
const RemoveNodeContext = createContext({});
export function useRemoveNodeContext() {
    return useContext(RemoveNodeContext);
}
function findBranchNodes(nodes, branchHead) {
    const result = new Map();
    for (let node = branchHead; node; node = node.downstream) {
        result.set(node.id, node);
        const subBranches = nodes.filter((item) => item.upstream === node && item.branchIndex != null);
        for (const subBranch of subBranches) {
            const subBranchNodes = findBranchNodes(nodes, subBranch);
            for (const [key, value] of subBranchNodes) {
                result.set(key, value);
            }
        }
    }
    return result;
}
function KeepBranchRadioGroup(props) {
    const { value, onChange } = props;
    const { deletingNode, deletingBranches } = useRemoveNodeContext();
    const plugin = usePlugin(PluginWorkflowClient);
    const compile = useCompile();
    const branchOptions = useMemo(() => {
        if (!deletingNode || deletingBranches?.length === 0) {
            return [];
        }
        const instruction = plugin.instructions.get(deletingNode?.type);
        const branching = typeof instruction.branching === 'function'
            ? instruction.branching(deletingNode.config ?? {})
            : instruction.branching;
        return branching
            ? deletingBranches.map((item, index) => {
                const option = Array.isArray(branching)
                    ? branching.find((branch) => branch.value === item.branchIndex) ?? {}
                    : {};
                return {
                    label: option['label']
                        ? lang('"{{branchName}}" branch', { branchName: compile(option['label']) })
                        : lang('Branch {{index}}', { index: index + 1 }),
                    value: item.branchIndex,
                };
            })
            : [];
    }, [deletingNode, deletingBranches, plugin.instructions, compile]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Radio.Group, { value: typeof value === 'number' ? 1 : 0, onChange: (e) => {
                if (e.target.value === 0) {
                    onChange(null);
                }
                else {
                    onChange(deletingBranches[0].branchIndex);
                }
            } },
            React.createElement(Space, { direction: "vertical" },
                React.createElement(Radio, { key: "0", value: 0 }, lang('Delete all')),
                React.createElement(Space, null,
                    React.createElement(Radio, { key: "1", value: 1 }, lang('Keep')),
                    React.createElement(Select, { options: branchOptions, onChange: onChange, defaultValue: deletingBranches[0]?.branchIndex }))))));
}
function useRemoveNodeSubmitAction() {
    const api = useAPIClient();
    const { nodes, refresh } = useFlowContext() ?? {};
    const { deletingNode, deletingBranches, setDeletingNode } = useRemoveNodeContext();
    const { values, clearFormGraph } = useForm();
    const { modal } = App.useApp();
    const keepBranchValues = values.keepBranch != null ? values : {};
    return {
        async run() {
            if (!deletingNode) {
                return;
            }
            const branchNodesUsingVariable = [];
            const branchHead = values.keepBranch != null ? deletingBranches.find((item) => values.keepBranch === item.branchIndex) : null;
            const relatedNodes = findBranchNodes(nodes, branchHead);
            const downstreamNodes = findBranchNodes(nodes, deletingNode.downstream);
            for (const [key, node] of downstreamNodes) {
                relatedNodes.set(key, node);
            }
            for (const node of relatedNodes.values()) {
                const template = parse(node.config);
                const refs = template.parameters.filter(({ key }) => {
                    return (key.startsWith(`$jobsMapByNodeKey.${deletingNode.key}.`) ||
                        key === `$jobsMapByNodeKey.${deletingNode.key}` ||
                        key.startsWith(`$scopes.${deletingNode.key}.`) ||
                        key === `$scopes.${deletingNode.key}`);
                });
                if (refs.length) {
                    branchNodesUsingVariable.push(node);
                }
            }
            if (branchNodesUsingVariable.length) {
                modal.error({
                    title: lang('Can not delete'),
                    content: lang('The result of this node has been referenced by other nodes ({{nodes}}), please remove the usage before deleting.', { nodes: branchNodesUsingVariable.map((item) => item.title).join(', ') }),
                });
                return;
            }
            await api.resource('flow_nodes').destroy?.({
                filterByTk: deletingNode.id,
                ...keepBranchValues,
            });
            clearFormGraph('*');
            setDeletingNode(null);
            refresh();
        },
    };
}
export function RemoveNodeContextProvider(props) {
    const [deletingNode, setDeletingNode] = useState(null);
    const form = useMemo(() => createForm(), []);
    const { nodes } = useFlowContext();
    const deletingBranches = nodes.filter((item) => item.upstream === deletingNode && item.branchIndex != null);
    return (React.createElement(RemoveNodeContext.Provider, { value: { deletingNode, setDeletingNode, deletingBranches } },
        props.children,
        React.createElement(ActionContextProvider, { value: {
                visible: Boolean(deletingBranches.length),
                setVisible() {
                    setDeletingNode(null);
                },
                openSize: 'small',
            } },
            React.createElement(SchemaComponent, { scope: {
                    useCancelAction,
                    useRemoveNodeSubmitAction,
                }, components: {
                    KeepBranchRadioGroup,
                }, schema: {
                    type: 'void',
                    name: 'deleteBranchModel',
                    'x-decorator': 'FormV2',
                    'x-decorator-props': {
                        form,
                    },
                    'x-component': 'Action.Modal',
                    title: `{{ t("Delete node", { ns: "${NAMESPACE}" }) }}`,
                    properties: {
                        keepBranch: {
                            type: 'number',
                            'x-decorator': 'FormItem',
                            title: `{{ t("Branch to keep", { ns: "${NAMESPACE}" }) }}`,
                            'x-component': 'KeepBranchRadioGroup',
                        },
                        footer: {
                            'x-component': 'Action.Modal.Footer',
                            properties: {
                                actions: {
                                    type: 'void',
                                    'x-component': 'ActionBar',
                                    properties: {
                                        cancel: {
                                            type: 'void',
                                            title: '{{ t("Cancel") }}',
                                            'x-component': 'Action',
                                            'x-component-props': {
                                                useAction: '{{ useCancelAction }}',
                                            },
                                        },
                                        submit: {
                                            type: 'void',
                                            title: `{{ t("Submit") }}`,
                                            'x-component': 'Action',
                                            'x-component-props': {
                                                type: 'primary',
                                                htmlType: 'submit',
                                                useAction: '{{ useRemoveNodeSubmitAction }}',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                } }))));
}
//# sourceMappingURL=RemoveNodeContext.js.map