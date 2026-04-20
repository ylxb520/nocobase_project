/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * [AI_DEBUG] Debug Panel Component
 *
 * To remove this debug feature, delete this entire file and search for "[AI_DEBUG]"
 * to find and remove related code in other files.
 */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Drawer, Input, Select, Button, Tag, Space, Typography, Empty, Tooltip, message } from 'antd';
import { DownloadOutlined, CopyOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { useToken } from '@nocobase/client';
import { useT } from '../../locale';
import { useChatBoxStore } from './stores/chat-box';
import { useChatConversationsStore } from './stores/chat-conversations';
import { aiDebugLogger } from '../../debug-logger';
import { VirtualList } from './VirtualList';
const { Text } = Typography;
const { Search } = Input;
const LOG_TYPE_COLORS = {
  request: 'blue',
  stream_text: 'green',
  stream_search: 'cyan',
  stream_start: 'geekblue',
  stream_tools: 'orange',
  stream_delta: 'lime',
  stream_error: 'volcano',
  tool_call: 'gold',
  tool_result: 'purple',
  error: 'red',
};
const LOG_TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'request', label: 'Request' },
  { value: 'stream_text', label: 'Stream Text' },
  { value: 'stream_search', label: 'Stream Search' },
  { value: 'stream_start', label: 'Stream Start' },
  { value: 'stream_tools', label: 'Stream Tools' },
  { value: 'stream_delta', label: 'Stream Delta' },
  { value: 'stream_error', label: 'Stream Error' },
  { value: 'tool_call', label: 'Tool Call' },
  { value: 'tool_result', label: 'Tool Result' },
  { value: 'error', label: 'Error' },
];
const LogItem = ({ log, expanded, onToggleExpand }) => {
  const { token } = useToken();
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };
  const getPreview = (data) => {
    try {
      const str = JSON.stringify(data);
      return str.length > 100 ? str.slice(0, 100) + '...' : str;
    } catch {
      return '[Unable to stringify]';
    }
  };
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(log.data, null, 2));
      message.success('Copied to clipboard');
    } catch {
      message.error('Failed to copy');
    }
  };
  return React.createElement(
    'div',
    {
      className: css`
        padding: 8px 12px;
        border-bottom: 1px solid ${token.colorBorderSecondary};
        &:hover {
          background-color: ${token.colorFillQuaternary};
        }
      `,
    },
    React.createElement(
      'div',
      {
        className: css`
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        `,
        onClick: onToggleExpand,
      },
      expanded
        ? React.createElement(DownOutlined, { style: { fontSize: 10 } })
        : React.createElement(RightOutlined, { style: { fontSize: 10 } }),
      React.createElement(
        Text,
        { type: 'secondary', style: { fontFamily: 'monospace', fontSize: 12 } },
        formatTime(log.time),
      ),
      React.createElement(Tag, { color: LOG_TYPE_COLORS[log.type], style: { margin: 0 } }, log.type),
      React.createElement(
        Text,
        {
          ellipsis: true,
          style: { flex: 1, fontFamily: 'monospace', fontSize: 12 },
          className: css`
            color: ${token.colorTextSecondary};
          `,
        },
        getPreview(log.data),
      ),
      React.createElement(
        Tooltip,
        { title: 'Copy' },
        React.createElement(Button, {
          type: 'text',
          size: 'small',
          icon: React.createElement(CopyOutlined, null),
          onClick: (e) => {
            e.stopPropagation();
            handleCopy();
          },
        }),
      ),
    ),
    expanded &&
      React.createElement(
        'pre',
        {
          className: css`
            margin: 8px 0 0 18px;
            padding: 8px;
            background-color: ${token.colorFillSecondary};
            border-radius: 4px;
            font-size: 12px;
            overflow-x: auto;
            max-height: 300px;
            overflow-y: auto;
          `,
        },
        JSON.stringify(log.data, null, 2),
      ),
  );
};
export const DebugPanel = () => {
  const showDebugPanel = useChatBoxStore.use.showDebugPanel();
  const setShowDebugPanel = useChatBoxStore.use.setShowDebugPanel();
  const currentConversation = useChatConversationsStore.use.currentConversation();
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const virtualListRef = useRef(null);
  const t = useT();
  const { token } = useToken();
  // Load initial logs and subscribe to updates
  useEffect(() => {
    if (!currentConversation) {
      setLogs([]);
      return;
    }
    // Load existing logs for current session
    const session = aiDebugLogger.getSession(currentConversation);
    if (session) {
      setLogs([...session.logs]);
    } else {
      setLogs([]);
    }
    // Subscribe to new logs
    const unsubscribe = aiDebugLogger.subscribe((log, sessionId) => {
      if (sessionId === currentConversation) {
        setLogs((prev) => [...prev, log]);
      }
    });
    return unsubscribe;
  }, [currentConversation]);
  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Type filter
      if (filterType !== 'all' && log.type !== filterType) {
        return false;
      }
      // Search filter
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const dataStr = JSON.stringify(log.data).toLowerCase();
        return dataStr.includes(searchLower);
      }
      return true;
    });
  }, [logs, filterType, searchText]);
  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (filteredLogs.length > 0) {
      requestAnimationFrame(() => {
        virtualListRef.current?.scrollTo({ index: filteredLogs.length - 1, align: 'bottom' });
      });
    }
  }, [logs]);
  const toggleExpand = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  const getItemKey = useCallback((log) => (expandedIds.has(log.id) ? `${log.id}-e` : log.id), [expandedIds]);
  const handleExport = () => {
    if (!currentConversation || logs.length === 0) return;
    const session = aiDebugLogger.getSession(currentConversation);
    const exportData = {
      sessionId: currentConversation,
      employeeId: session?.employeeId,
      employeeName: session?.employeeName,
      exportedAt: new Date().toISOString(),
      logs,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = session?.employeeName || 'unknown';
    a.download = `ai-chat-log-${name}-${new Date().toISOString().slice(0, 16).replace('T', '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return React.createElement(
    Drawer,
    {
      title: React.createElement(
        Space,
        null,
        React.createElement('span', null, t('Debug Panel')),
        currentConversation &&
          React.createElement(Text, { type: 'secondary', style: { fontSize: 12 } }, '(', logs.length, ' logs)'),
      ),
      placement: 'right',
      width: 500,
      open: showDebugPanel,
      onClose: () => setShowDebugPanel(false),
      styles: { body: { padding: 0, overflow: 'hidden' } },
      extra: React.createElement(
        Button,
        {
          icon: React.createElement(DownloadOutlined, null),
          size: 'small',
          onClick: handleExport,
          disabled: logs.length === 0,
        },
        t('Export'),
      ),
    },
    React.createElement(
      'div',
      {
        className: css`
          display: flex;
          flex-direction: column;
          height: 100%;
        `,
      },
      React.createElement(
        'div',
        {
          className: css`
            padding: 12px;
            border-bottom: 1px solid ${token.colorBorder};
            display: flex;
            gap: 8px;
          `,
        },
        React.createElement(Select, {
          value: filterType,
          onChange: setFilterType,
          options: LOG_TYPE_OPTIONS,
          style: { width: 120 },
          size: 'small',
        }),
        React.createElement(Search, {
          placeholder: t('Search logs...'),
          value: searchText,
          onChange: (e) => setSearchText(e.target.value),
          allowClear: true,
          size: 'small',
          style: { flex: 1 },
        }),
      ),
      !currentConversation
        ? React.createElement(Empty, { description: t('No conversation selected'), style: { marginTop: 100 } })
        : filteredLogs.length === 0
        ? React.createElement(Empty, { description: t('No logs'), style: { marginTop: 100 } })
        : React.createElement(
            VirtualList,
            { ref: virtualListRef, data: filteredLogs, itemKey: getItemKey, itemHeight: 40 },
            (log) =>
              React.createElement(LogItem, {
                log: log,
                expanded: expandedIds.has(log.id),
                onToggleExpand: () => toggleExpand(log.id),
              }),
          ),
    ),
  );
};
//# sourceMappingURL=DebugPanel.js.map
