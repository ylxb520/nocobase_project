/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createStyles, Icon, useAPIClient, useApp, usePlugin, useRequest, useCompile } from '@nocobase/client';
import {
  Alert,
  Button,
  Empty,
  Modal,
  Popconfirm,
  Popover,
  Progress,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useT } from '../locale';
import { TASK_STATUS, TASK_STATUS_OPTIONS } from '../../common/constants';
const useStyles = createStyles(({ token }) => {
  return {
    button: {
      // @ts-ignore
      color: token.colorTextHeaderMenu + ' !important',
    },
  };
});
// Configure dayjs
dayjs.extend(relativeTime);
const AsyncTasksButton = (props) => {
  const { popoverVisible, setPopoverVisible, tasks, refresh, loading, hasProcessingTasks } = props;
  const api = useAPIClient();
  const localT = useT();
  const { t } = useTranslation();
  const { styles } = useStyles();
  const plugin = usePlugin('async-task-manager');
  const compile = useCompile();
  const showTaskResult = (task) => {
    setPopoverVisible(false);
  };
  const columns = [
    {
      title: localT('Created at'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (createdAt) =>
        React.createElement(
          Tooltip,
          { title: dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss') },
          dayjs(createdAt).fromNow(),
        ),
    },
    {
      title: localT('Task'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: localT('Status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status, record) => {
        const option = TASK_STATUS_OPTIONS[status] || {};
        const { color, label } = option;
        const renderProgress = () => {
          const commonStyle = {
            width: 100,
            margin: 0,
          };
          switch (status) {
            case TASK_STATUS.PENDING:
            case TASK_STATUS.CANCELED:
              return React.createElement(Alert, { showIcon: false, message: compile(label), banner: true });
            case TASK_STATUS.RUNNING:
              return React.createElement(Progress, {
                type: 'line',
                size: 'small',
                strokeWidth: 4,
                percent: Number((((record.progressCurrent ?? 0) / (record.progressTotal ?? 1)) * 100).toFixed(2)),
                status: 'active',
                style: commonStyle,
                format: (percent) => `${percent.toFixed(1)}%`,
              });
            case TASK_STATUS.SUCCEEDED:
              return React.createElement(Progress, {
                type: 'line',
                size: 'small',
                strokeWidth: 4,
                percent: 100,
                status: 'success',
                style: commonStyle,
                format: () => '',
              });
            case TASK_STATUS.FAILED:
              return React.createElement(Progress, {
                type: 'line',
                size: 'small',
                strokeWidth: 4,
                percent: 100,
                status: 'exception',
                style: commonStyle,
                format: () => '',
              });
            default:
              return null;
          }
        };
        return React.createElement(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('div', { style: { flex: 1 } }, renderProgress()),
          React.createElement(Tag, {
            color: color,
            icon: option?.icon ? React.createElement(Icon, { type: option.icon }) : null,
            style: { margin: 0, padding: '0 4px', height: 22, width: 22 },
          }),
        );
      },
    },
    {
      title: localT('Actions'),
      dataIndex: 'result',
      key: 'actions',
      width: 180,
      render: (result, record) => {
        const actions = [];
        const stopping = false;
        const { Result, ResultButton } = plugin.taskOrigins.get(record.origin) ?? {};
        const ResultComponent = Result || (() => null);
        if (record.cancelable && (record.status === TASK_STATUS.RUNNING || record.status === TASK_STATUS.PENDING)) {
          actions.push(
            React.createElement(
              Popconfirm,
              {
                key: 'cancel',
                title: localT('Confirm cancel'),
                description: localT('Confirm to cancel this task?'),
                onConfirm: async () => {
                  await api.resource('asyncTasks').stop({
                    filterByTk: record.id,
                  });
                  refresh();
                },
                okText: localT('Confirm'),
                cancelText: localT('Cancel'),
                disabled: stopping,
              },
              React.createElement(
                Button,
                {
                  type: 'link',
                  size: 'small',
                  icon: React.createElement(Icon, { type: stopping ? 'LoadingOutlined' : 'StopOutlined' }),
                  disabled: stopping,
                },
                stopping ? localT('Stopping...') : localT('Stop'),
              ),
            ),
          );
        }
        if (record.status === TASK_STATUS.SUCCEEDED && result) {
          if (ResultButton) {
            actions.push(React.createElement(ResultButton, { key: 'result-button', task: record }));
          } else {
            actions.push(
              React.createElement(
                Button,
                {
                  key: 'view',
                  type: 'link',
                  size: 'small',
                  icon: React.createElement(Icon, { type: 'EyeOutlined' }),
                  onClick: () => {
                    showTaskResult(record);
                    Modal.info({
                      title: localT('Task result'),
                      content: Result
                        ? React.createElement(ResultComponent, { payload: result, task: record })
                        : React.createElement(
                            'div',
                            null,
                            localT(`No renderer available for this task type, payload: ${record.result}`),
                          ),
                    });
                  },
                },
                localT('View result'),
              ),
            );
          }
        }
        if (record.status === TASK_STATUS.FAILED && result) {
          actions.push(
            React.createElement(
              Button,
              {
                key: 'error',
                type: 'link',
                size: 'small',
                icon: React.createElement(Icon, { type: 'ExclamationCircleOutlined' }),
                onClick: () => {
                  setPopoverVisible(false);
                  const { namespace: ns = 'client' } = plugin.taskOrigins.get(record.origin);
                  Modal.info({
                    title: localT('Error Details'),
                    content: React.createElement(Typography.Text, null, t(result.message, { ...result.params, ns })),
                    closable: true,
                    width: 400,
                  });
                },
              },
              localT('Error details'),
            ),
          );
        }
        return React.createElement(Space, { size: 'middle' }, actions);
      },
    },
  ];
  const count = tasks.filter((item) => [TASK_STATUS.SUCCEEDED, TASK_STATUS.FAILED].includes(item.status)).length;
  const content = React.createElement(
    'div',
    { style: { maxHeight: '70vh', overflow: 'auto', width: tasks.length > 0 ? 800 : 200 } },
    tasks.length > 0
      ? React.createElement(Table, {
          loading: loading,
          columns: columns,
          dataSource: tasks,
          size: 'small',
          pagination: false,
          rowKey: 'taskId',
        })
      : React.createElement(
          'div',
          { style: { padding: '24px 0', display: 'flex', justifyContent: 'center' } },
          React.createElement(Empty, { description: localT('No tasks'), image: Empty.PRESENTED_IMAGE_SIMPLE }),
        ),
  );
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      Popover,
      {
        content: content,
        trigger: 'click',
        placement: 'bottom',
        open: popoverVisible,
        onOpenChange: setPopoverVisible,
      },
      React.createElement(Button, {
        className: ['sync-task-button', styles.button].join(' '),
        onClick: () => {
          setPopoverVisible(!popoverVisible);
          if (!popoverVisible) {
            refresh();
          }
        },
        icon: React.createElement(Icon, {
          type: 'SyncOutlined',
          spin: tasks.some((task) => TASK_STATUS.RUNNING === task.status),
        }),
      }),
    ),
  );
};
export const AsyncTasks = () => {
  const app = useApp();
  const { data, refresh, loading } = useRequest({
    resource: 'asyncTasks',
    action: 'list',
    params: {
      sort: '-createdAt',
    },
  });
  const [tasks, setTasks] = useState(data?.data || []);
  const [popoverVisible, setPopoverVisible] = useState(false);
  useEffect(() => {
    setTasks(data?.data || []);
  }, [data]);
  const handleTaskCreated = useCallback(async () => {
    setPopoverVisible(true);
    refresh();
    console.log('handleTaskCreated');
  }, []);
  const handleTaskProgress = useCallback((event) => {
    const { detail } = event;
    setTasks((prevTasks) => {
      const index = prevTasks.findIndex((task) => task.id === detail.id);
      if (index === -1) {
        prevTasks.unshift(detail);
      } else {
        prevTasks.splice(index, 1, detail);
      }
      return [...prevTasks];
    });
  }, []);
  const handleTaskStatus = useCallback(() => {
    refresh();
    console.log('handleTaskStatus');
  }, []);
  const handleTaskDeleted = useCallback(() => {
    refresh();
    console.log('handleTaskDeleted');
  }, []);
  useEffect(() => {
    app.eventBus.addEventListener('ws:message:async-tasks:created', handleTaskCreated);
    app.eventBus.addEventListener('ws:message:async-tasks:progress', handleTaskProgress);
    app.eventBus.addEventListener('ws:message:async-tasks:status', handleTaskStatus);
    app.eventBus.addEventListener('ws:message:async-tasks:deleted', handleTaskDeleted);
    return () => {
      app.eventBus.removeEventListener('ws:message:async-tasks:created', handleTaskCreated);
      app.eventBus.removeEventListener('ws:message:async-tasks:progress', handleTaskProgress);
      app.eventBus.removeEventListener('ws:message:async-tasks:status', handleTaskStatus);
      app.eventBus.removeEventListener('ws:message:async-tasks:deleted', handleTaskDeleted);
    };
  }, [app, handleTaskDeleted, handleTaskCreated, handleTaskProgress, handleTaskStatus]);
  return (
    tasks?.length > 0 && React.createElement(AsyncTasksButton, { tasks, refresh, popoverVisible, setPopoverVisible })
  );
};
//# sourceMappingURL=AsyncTasks.js.map
