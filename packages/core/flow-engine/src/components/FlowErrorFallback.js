/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button, Result, Typography } from 'antd';
import React, { useState } from 'react';
import { useFlowModel } from '../hooks/useFlowModel';
import { getT } from '../utils';
const { Paragraph, Text } = Typography;
/**
 * 内部组件，用于获取 FlowModel
 */
const FlowErrorFallbackInner = ({ error, resetErrorBoundary }) => {
  const [loading, setLoading] = useState(false);
  const model = useFlowModel(); // 在这里安全地使用 Hook
  const t = getT(model);
  const handleCopyError = async () => {
    setLoading(true);
    try {
      const errorInfo = {
        message: error.message,
        stack: error.stack,
        modelInfo: model
          ? {
              uid: model.uid,
              className: model.constructor.name,
              props: model.props,
              stepParams: model.stepParams,
            }
          : null,
        timestamp: new Date().toISOString(),
      };
      await navigator.clipboard.writeText(JSON.stringify(errorInfo, null, 2));
      console.log('Error information copied to clipboard');
    } catch (err) {
      console.error('Failed to copy error information:', err);
    }
    setLoading(false);
  };
  // 检查是否可以下载日志
  const canDownloadLogs = model?.context?.api;
  const handleDownloadLogs = async () => {
    if (!canDownloadLogs) {
      console.error('API client not available');
      return;
    }
    setLoading(true);
    try {
      // 从 model.context.api 获取 apiClient
      const apiClient = model.context.api;
      // 从 window 对象获取位置信息
      const location = {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        href: window.location.href,
      };
      const res = await apiClient.request({
        url: 'logger:collect',
        method: 'post',
        responseType: 'blob',
        data: {
          error: {
            message: error.message,
            stack: error.stack,
          },
          location,
          modelInfo: model
            ? {
                uid: model.uid,
                className: model.constructor.name,
                props: model.props,
                stepParams: model.stepParams,
              }
            : null,
        },
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/gzip' }));
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'logs.tar.gz');
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download logs:', err);
    }
    setLoading(false);
  };
  const subTitle = React.createElement(
    'span',
    null,
    t('This is likely a NocoBase internals bug. Please open an issue at'),
    ' ',
    React.createElement(
      'a',
      { href: 'https://github.com/nocobase/nocobase/issues', target: '_blank', rel: 'noopener noreferrer' },
      t('here'),
    ),
    model &&
      React.createElement(
        'div',
        { style: { marginTop: '8px', fontSize: '12px', color: '#999' } },
        'Model: ',
        model.constructor.name,
        ' (uid: ',
        model.uid,
        ')',
      ),
  );
  return React.createElement(
    'div',
    { style: { backgroundColor: 'white' } },
    React.createElement(
      Result,
      {
        style: { maxWidth: '60vw', margin: 'auto' },
        status: 'error',
        title: t('Render failed'),
        subTitle: subTitle,
        extra: [
          React.createElement(
            Button,
            { type: 'primary', key: 'feedback', href: 'https://github.com/nocobase/nocobase/issues', target: '_blank' },
            t('Feedback'),
          ),
          canDownloadLogs &&
            React.createElement(
              Button,
              { key: 'log', loading: loading, onClick: handleDownloadLogs },
              t('Download logs'),
            ),
          React.createElement(
            Button,
            { key: 'copy', loading: loading, onClick: handleCopyError },
            t('Copy error info'),
          ),
          resetErrorBoundary &&
            React.createElement(Button, { key: 'retry', danger: true, onClick: resetErrorBoundary }, t('Try again')),
        ].filter(Boolean),
      },
      React.createElement(
        Paragraph,
        { copyable: { text: error.stack } },
        React.createElement(
          Text,
          { type: 'danger', style: { whiteSpace: 'pre-line', textAlign: 'center' } },
          error.stack,
        ),
      ),
    ),
  );
};
/**
 * 简化版的错误回退组件，专为 flow-engine 设计
 * 保持与原始 ErrorFallback 相同的样式和结构
 */
export const FlowErrorFallback = ({ error, resetErrorBoundary }) => {
  const [loading, setLoading] = useState(false);
  // 尝试渲染内部组件，如果不在 FlowModelProvider 中则显示简化版本
  try {
    return React.createElement(FlowErrorFallbackInner, { error: error, resetErrorBoundary: resetErrorBoundary });
  } catch {
    // 如果不在 FlowModelProvider 中，显示简化版本（不包含 model 信息）
    const handleCopyError = async () => {
      setLoading(true);
      try {
        const errorInfo = {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        };
        await navigator.clipboard.writeText(JSON.stringify(errorInfo, null, 2));
        console.log('Error information copied to clipboard');
      } catch (err) {
        console.error('Failed to copy error information:', err);
      }
      setLoading(false);
    };
    const subTitle = React.createElement(
      'span',
      null,
      'This is likely a NocoBase internals bug. Please open an issue at ',
      React.createElement(
        'a',
        { href: 'https://github.com/nocobase/nocobase/issues', target: '_blank', rel: 'noopener noreferrer' },
        'here',
      ),
    );
    return React.createElement(
      'div',
      { style: { backgroundColor: 'white' } },
      React.createElement(
        Result,
        {
          style: { maxWidth: '60vw', margin: 'auto' },
          status: 'error',
          title: 'Render failed',
          subTitle: subTitle,
          extra: [
            React.createElement(
              Button,
              {
                type: 'primary',
                key: 'feedback',
                href: 'https://github.com/nocobase/nocobase/issues',
                target: '_blank',
              },
              'Feedback',
            ),
            React.createElement(Button, { key: 'copy', loading: loading, onClick: handleCopyError }, 'Copy error info'),
            resetErrorBoundary &&
              React.createElement(Button, { key: 'retry', danger: true, onClick: resetErrorBoundary }, 'Try again'),
          ].filter(Boolean),
        },
        React.createElement(
          Paragraph,
          { copyable: { text: error.stack } },
          React.createElement(
            Text,
            { type: 'danger', style: { whiteSpace: 'pre-line', textAlign: 'center' } },
            error.stack,
          ),
        ),
      ),
    );
  }
};
/**
 * 模态框版本的错误回退组件
 */
export const FlowErrorFallbackModal = ({ error, resetErrorBoundary, children }) => {
  const [open, setOpen] = useState(false);
  const defaultChildren = React.createElement(
    Paragraph,
    {
      style: {
        display: 'flex',
        marginBottom: 0,
      },
      copyable: { text: error.message },
    },
    React.createElement(
      Text,
      {
        type: 'danger',
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          display: 'inline-block',
          maxWidth: '200px',
        },
      },
      'Error: ',
      error.message,
    ),
  );
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('div', { onMouseOver: () => setOpen(true) }, children || defaultChildren),
    open &&
      React.createElement(
        'div',
        {
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          },
          onClick: () => setOpen(false),
        },
        React.createElement(
          'div',
          {
            style: {
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '60vw',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative',
            },
            onClick: (e) => e.stopPropagation(),
          },
          React.createElement(
            'button',
            {
              style: {
                position: 'absolute',
                top: '8px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#999',
              },
              onClick: () => setOpen(false),
            },
            '\u00D7',
          ),
          React.createElement(FlowErrorFallback, { error: error, resetErrorBoundary: resetErrorBoundary }),
        ),
      ),
  );
};
FlowErrorFallback.Modal = FlowErrorFallbackModal;
//# sourceMappingURL=FlowErrorFallback.js.map
