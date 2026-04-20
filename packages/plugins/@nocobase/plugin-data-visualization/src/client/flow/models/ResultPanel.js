/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Tabs, Table, Typography, Alert } from 'antd';
import { TableOutlined, CodeOutlined } from '@ant-design/icons';
import { useT } from '../../locale';
import { configStore } from './config-store';
import { useFlowSettingsContext } from '@nocobase/flow-engine';
const { Paragraph } = Typography;
export const ResultPanel = () => {
  const t = useT();
  const ctx = useFlowSettingsContext();
  const uid = ctx.model.uid;
  const data = configStore.results[uid]?.result;
  const error = configStore.results[uid]?.error;
  return !error
    ? React.createElement(Tabs, {
        size: 'small',
        type: 'card',
        items: [
          {
            key: 'table',
            label: React.createElement('span', { style: { fontSize: 12 } }, t('Table')),
            icon: React.createElement(TableOutlined, null),
            children: React.createElement(TableResult, { data: data || [] }),
          },
          {
            key: 'json',
            label: React.createElement('span', { style: { fontSize: 12 } }, t('JSON')),
            icon: React.createElement(CodeOutlined, null),
            children: React.createElement(JSONResult, { data: data || [] }),
          },
        ],
      })
    : React.createElement(Alert, { showIcon: true, message: t('Query Error'), description: error, type: 'error' });
};
const TableResult = ({ data }) => {
  return React.createElement(Table, {
    dataSource: data.map((item, index) => ({ ...item, _key: index })),
    rowKey: '_key',
    scroll: { x: 'max-content' },
    columns: Object.keys(data[0] || {}).map((col) => {
      return {
        title: col,
        dataIndex: col,
        key: col,
      };
    }),
    size: 'small',
  });
};
const JSONResult = ({ data }) => {
  const result = JSON.stringify(data, null, 2);
  return React.createElement(Paragraph, null, React.createElement('pre', null, result));
};
//# sourceMappingURL=ResultPanel.js.map
