/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { App, Checkbox } from 'antd';
import { cloneDeep } from 'lodash';
import { useAPIClient } from '@nocobase/client';
import { useFlowContext } from './FlowContext';
import { useWorkflowExecuted } from './hooks';
import { lang } from './locale';
import { collectUpstreams, extractDependencyKeys, stripVariableReferences } from './nodeVariableUtils';
const NodeClipboardContext = createContext(null);
export function useNodeClipboardContext() {
    return useContext(NodeClipboardContext);
}
export function NodeClipboardContextProvider(props) {
    const api = useAPIClient();
    const { workflow, nodes, refresh } = useFlowContext() ?? {};
    const executed = useWorkflowExecuted();
    const { modal, message } = App.useApp();
    const [clipboard, setClipboard] = useState(null);
    const nodesByKey = useMemo(() => {
        const map = new Map();
        if (!nodes) {
            return map;
        }
        nodes.forEach((node) => {
            if (node?.key != null) {
                map.set(String(node.key), node);
            }
        });
        return map;
    }, [nodes]);
    const copyNode = useCallback((node) => {
        if (!node || executed) {
            return;
        }
        setClipboard({
            sourceId: node.id,
            sourceKey: node.key ? String(node.key) : undefined,
            type: node.type,
            title: node.title,
            config: cloneDeep(node.config ?? {}),
        });
    }, [executed]);
    const clearClipboard = useCallback(() => {
        setClipboard(null);
    }, []);
    const getPasteImpact = useCallback((target) => {
        if (!clipboard || !target) {
            return { status: 'disabled', impactedSelf: [], impactedDependents: [] };
        }
        const upstream = target.upstream ?? null;
        const upstreamSet = upstream ? collectUpstreams(upstream) : new Set();
        const deps = extractDependencyKeys(clipboard.config ?? {});
        const impactedSelf = [];
        deps.forEach((depKey) => {
            const depNode = nodesByKey.get(String(depKey));
            if (!depNode) {
                impactedSelf.push({ key: String(depKey), title: String(depKey) });
                return;
            }
            if (!upstreamSet.has(depNode.id)) {
                impactedSelf.push({ key: String(depKey), title: depNode.title });
            }
        });
        const status = impactedSelf.length ? 'warning' : 'safe';
        return { status, impactedSelf, impactedDependents: [] };
    }, [clipboard, nodesByKey]);
    const duplicateNode = useCallback(async (values) => {
        if (!workflow?.id) {
            return false;
        }
        try {
            await api.resource('flow_nodes').duplicate({
                filterByTk: clipboard.sourceId,
                values,
            });
            setClipboard(null);
            refresh?.();
            return true;
        }
        catch (err) {
            console.error(err);
            message.error(lang('Failed to paste node'));
            return false;
        }
    }, [api, clipboard?.sourceId, message, refresh, workflow?.id]);
    const pasteNode = useCallback(async (target) => {
        if (!clipboard || executed) {
            return;
        }
        const impact = getPasteImpact(target);
        if (impact.status === 'disabled') {
            return;
        }
        const upstream = target?.upstream ?? null;
        const branchIndex = upstream ? target?.branchIndex ?? null : null;
        const baseConfig = cloneDeep(clipboard.config ?? {});
        const baseValues = {
            upstreamId: upstream?.id ?? null,
            branchIndex,
        };
        if (impact.status === 'warning') {
            const impactedSelfTitles = impact.impactedSelf.map((item) => item.title).join(', ');
            const impactedDependentTitles = impact.impactedDependents.map((item) => item.title).join(', ');
            const keepVariablesRef = { current: false };
            const keysToRemove = new Set(impact.impactedSelf.map((item) => item.key).filter(Boolean));
            modal.confirm({
                title: lang('Confirm paste'),
                content: (React.createElement("div", null,
                    React.createElement("div", null, lang('This action will remove invalid variable references, otherwise the workflow cannot run correctly.')),
                    impactedSelfTitles ? (React.createElement("div", null, lang('Impacted current node variables') + ': ' + impactedSelfTitles)) : null,
                    impactedDependentTitles ? (React.createElement("div", null, lang('Impacted dependent node variables') + ': ' + impactedDependentTitles)) : null,
                    React.createElement("div", { style: { marginTop: '0.75em' } },
                        React.createElement(Checkbox, { onChange: (ev) => (keepVariablesRef.current = ev.target.checked) }, lang('Keep variable references'))))),
                onOk: async () => {
                    if (keepVariablesRef.current) {
                        const created = await duplicateNode(baseValues);
                        if (created) {
                            message.warning(lang('Keeping variable references requires manual adjustment, otherwise workflow may fail.'));
                        }
                        return;
                    }
                    const cleaned = stripVariableReferences(baseConfig, keysToRemove);
                    await duplicateNode({
                        ...baseValues,
                        config: cleaned.value,
                    });
                },
            });
            return;
        }
        await duplicateNode(baseValues);
    }, [clipboard, duplicateNode, executed, getPasteImpact, message, modal]);
    const value = useMemo(() => ({
        clipboard,
        copyNode,
        clearClipboard,
        getPasteImpact,
        pasteNode,
        executed,
    }), [clipboard, clearClipboard, copyNode, executed, getPasteImpact, pasteNode]);
    return React.createElement(NodeClipboardContext.Provider, { value: value }, props.children);
}
//# sourceMappingURL=NodeClipboardContext.js.map