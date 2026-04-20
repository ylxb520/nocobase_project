/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Breadcrumb, Button, Dropdown, message, Modal, Result, Space, Spin, Tag, Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ActionContextProvider, cx, Input, SchemaComponent, useAPIClient, useApp, useCompile, useDocumentTitle, usePlugin, useRequest, useResourceActionContext, } from '@nocobase/client';
import { str2moment } from '@nocobase/utils/client';
import { DownOutlined, ExclamationCircleFilled, StopOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import WorkflowPlugin from '.';
import { CanvasContent } from './CanvasContent';
import { StatusButton } from './components/StatusButton';
import { ExecutionStatusOptionsMap, JobStatusOptions } from './constants';
import { FlowContext, useFlowContext } from './FlowContext';
import { lang, NAMESPACE } from './locale';
import useStyles from './style';
import { getWorkflowDetailPath, getWorkflowExecutionsPath, linkNodes } from './utils';
import { get } from 'lodash';
function attachJobs(nodes, jobs = []) {
    const nodesMap = new Map();
    nodes.forEach((item) => {
        item.jobs = [];
        nodesMap.set(item.id, item);
    });
    jobs.forEach((item) => {
        const node = nodesMap.get(item.nodeId);
        if (!node) {
            return;
        }
        node.jobs.push(item);
        item.node = {
            id: node.id,
            key: node.key,
            title: node.title,
            type: node.type,
        };
    });
    nodes.forEach((item) => {
        item.jobs = item.jobs.sort((a, b) => a.id - b.id);
    });
}
function JobResult(props) {
    const { viewJob } = useFlowContext();
    const { data, loading } = useRequest({
        resource: 'jobs',
        action: 'get',
        params: {
            filterByTk: viewJob.id,
        },
    });
    if (loading) {
        return React.createElement(Spin, null);
    }
    const result = get(data, 'data.result');
    return React.createElement(Input.JSON, { ...props, value: result, disabled: true });
}
function JobModal() {
    const { instructions } = usePlugin(WorkflowPlugin);
    const compile = useCompile();
    const { viewJob: job, setViewJob } = useFlowContext();
    const { styles } = useStyles();
    const { node = {} } = job ?? {};
    const instruction = instructions.get(node.type);
    return (React.createElement(ActionContextProvider, { value: { visible: Boolean(job), setVisible: setViewJob } },
        React.createElement(SchemaComponent, { components: {
                JobResult,
            }, schema: {
                type: 'void',
                properties: {
                    [`${job?.id}-${job?.updatedAt}-modal`]: {
                        type: 'void',
                        'x-decorator': 'Form',
                        'x-decorator-props': {
                            initialValue: job,
                        },
                        'x-component': 'Action.Modal',
                        title: (React.createElement("div", { className: styles.nodeTitleClass },
                            React.createElement(Tag, null, compile(instruction?.title)),
                            React.createElement("strong", null, node.title),
                            React.createElement("span", { className: "workflow-node-id" },
                                "#",
                                node.id))),
                        properties: {
                            status: {
                                type: 'number',
                                title: `{{t("Status", { ns: "${NAMESPACE}" })}}`,
                                'x-decorator': 'FormItem',
                                'x-component': 'Select',
                                enum: JobStatusOptions,
                                'x-read-pretty': true,
                            },
                            updatedAt: {
                                type: 'string',
                                title: `{{t("Executed at", { ns: "${NAMESPACE}" })}}`,
                                'x-decorator': 'FormItem',
                                'x-component': 'DatePicker',
                                'x-component-props': {
                                    showTime: true,
                                },
                                'x-read-pretty': true,
                            },
                            result: {
                                type: 'object',
                                title: `{{t("Node result", { ns: "${NAMESPACE}" })}}`,
                                'x-decorator': 'FormItem',
                                'x-component': 'JobResult',
                                'x-component-props': {
                                    className: styles.nodeJobResultClass,
                                    autoSize: {
                                        minRows: 4,
                                        maxRows: 32,
                                    },
                                },
                            },
                        },
                    },
                },
            } })));
}
function ExecutionsDropdown(props) {
    const { execution } = useFlowContext();
    const apiClient = useAPIClient();
    const navigate = useNavigate();
    const { styles } = useStyles();
    const { refresh } = useResourceActionContext();
    const [executionsBefore, setExecutionsBefore] = useState([]);
    const [executionsAfter, setExecutionsAfter] = useState([]);
    const [loadedBeforeById, setLoadedBeforeById] = useState(null);
    const [loadedAfterById, setLoadedAfterById] = useState(null);
    const [lastLoadedAt, setLastLoadedAt] = useState(null);
    const loadPrevAndNext = useCallback((visible) => {
        if (!execution || !visible) {
            return;
        }
        if (loadedBeforeById !== execution.id) {
            apiClient
                .resource('executions')
                .list({
                filter: {
                    key: execution.key,
                    id: {
                        $lt: execution.id,
                    },
                },
                sort: '-id',
                pageSize: 10,
                fields: ['id', 'status', 'createdAt'],
            })
                .then(({ data }) => {
                setLoadedBeforeById(execution.id);
                setExecutionsBefore(data.data);
            })
                .catch(() => { });
        }
        if (loadedAfterById !== execution.id ||
            (lastLoadedAt && Date.now() - Number(lastLoadedAt) > 60_000 && executionsAfter.length < 10)) {
            apiClient
                .resource('executions')
                .list({
                filter: {
                    key: execution.key,
                    id: {
                        $gt: execution.id,
                    },
                },
                sort: 'id',
                pageSize: 10,
                fields: ['id', 'status', 'createdAt'],
            })
                .then(({ data }) => {
                setLoadedAfterById(execution.id);
                setLastLoadedAt(Date.now());
                setExecutionsAfter(data.data.reverse());
            })
                .catch(() => { });
        }
    }, [execution, loadedBeforeById, loadedAfterById, lastLoadedAt, executionsAfter.length, apiClient]);
    const onClick = useCallback(({ key }) => {
        if (key != execution.id) {
            navigate(getWorkflowExecutionsPath(key));
        }
    }, [execution.id, navigate]);
    return execution ? (React.createElement(Space, null,
        React.createElement(Dropdown, { onOpenChange: loadPrevAndNext, menu: {
                onClick,
                defaultSelectedKeys: [`${execution.id}`],
                className: cx(styles.dropdownClass, styles.executionsDropdownRowClass),
                items: [...executionsAfter, execution, ...executionsBefore].map((item) => {
                    return {
                        key: item.id,
                        label: (React.createElement(React.Fragment, null,
                            React.createElement("span", { className: "id" }, `#${item.id}`),
                            React.createElement("time", null, str2moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')))),
                        icon: (React.createElement("span", null,
                            React.createElement(StatusButton, { statusMap: ExecutionStatusOptionsMap, status: item.status }))),
                    };
                }),
            } },
            React.createElement(Space, null,
                React.createElement("strong", null, `#${execution.id}`),
                React.createElement(DownOutlined, null))),
        React.createElement(Button, { type: "link", size: "small", icon: React.createElement(ReloadOutlined, null), onClick: refresh }))) : null;
}
export function ExecutionCanvas() {
    const { t } = useTranslation();
    const compile = useCompile();
    const { data, loading, refresh } = useResourceActionContext();
    const { setTitle } = useDocumentTitle();
    const [viewJob, setViewJob] = useState(null);
    const app = useApp();
    const apiClient = useAPIClient();
    useEffect(() => {
        const { workflow } = data?.data ?? {};
        setTitle?.(`${workflow?.title ? `${workflow.title} - ` : ''}${lang('Execution history')}`);
    }, [data?.data, setTitle]);
    const onCancel = useCallback(() => {
        Modal.confirm({
            title: lang('Cancel the execution'),
            icon: React.createElement(ExclamationCircleFilled, null),
            content: lang('Are you sure you want to cancel the execution?'),
            onOk: () => {
                apiClient
                    .resource('executions')
                    .cancel({
                    filterByTk: data?.data.id,
                })
                    .then(() => {
                    message.success(t('Operation succeeded'));
                    refresh();
                })
                    .catch((response) => {
                    console.error(response.data.error);
                });
            },
        });
    }, [data?.data]);
    const onBack = useCallback(() => {
        history.back();
    }, []);
    if (!data?.data) {
        if (loading) {
            return React.createElement(Spin, null);
        }
        return React.createElement(Result, { status: "404", title: "Not found" });
    }
    const { jobs = [], workflow, ...execution } = data?.data ?? {};
    const { nodes = [] } = workflow || {};
    linkNodes(nodes);
    attachJobs(nodes, jobs);
    const entry = nodes.find((item) => !item.upstream);
    const statusOption = ExecutionStatusOptionsMap[execution.status];
    return workflow ? (React.createElement(FlowContext.Provider, { value: {
            workflow: workflow.type ? workflow : null,
            nodes,
            execution,
            viewJob,
            setViewJob,
        } },
        React.createElement("div", { className: "workflow-toolbar" },
            React.createElement("header", null,
                React.createElement(Breadcrumb, { items: [
                        { title: React.createElement(Link, { to: app.pluginSettingsManager.getRoutePath('workflow') }, lang('Workflow')) },
                        {
                            title: (React.createElement(Tooltip, { title: `Key: ${workflow.key}` },
                                React.createElement(Link, { to: getWorkflowDetailPath(workflow.id) }, workflow.title))),
                        },
                        { title: React.createElement(ExecutionsDropdown, null) },
                    ] })),
            React.createElement("aside", null,
                React.createElement(Tag, { color: statusOption.color }, compile(statusOption.label)),
                execution.status ? null : (React.createElement(Tooltip, { title: lang('Cancel the execution') },
                    React.createElement(Button, { type: "link", danger: true, onClick: onCancel, shape: "circle", size: "small", icon: React.createElement(StopOutlined, null) }))),
                React.createElement("time", null, str2moment(execution.updatedAt).format('YYYY-MM-DD HH:mm:ss')))),
        React.createElement(CanvasContent, { entry: entry }),
        React.createElement(JobModal, null))) : (React.createElement(Result, { status: "404", title: lang('Not found'), subTitle: lang('Workflow of execution is not existed'), extra: React.createElement(Button, { onClick: onBack }, lang('Go back')) }));
}
//# sourceMappingURL=ExecutionCanvas.js.map