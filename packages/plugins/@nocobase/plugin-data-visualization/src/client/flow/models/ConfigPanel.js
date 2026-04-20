/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useState } from 'react';
import { useT } from '../../locale';
import { Collapse, Card } from 'antd';
import { QueryPanel } from './QueryPanel';
import { ChartOptionsPanel } from './ChartOptionsPanel';
import { EventsPanel } from './EventsPanel';
import { useForm } from '@formily/react';
import { useFlowSettingsContext } from '@nocobase/flow-engine';
import { DEFAULT_DATA_SOURCE_KEY } from '@nocobase/client';
export const ConfigPanel = () => {
  const t = useT();
  const form = useForm();
  const ctx = useFlowSettingsContext();
  // 默认展开前两个面板 - 必填
  const [activeKeys, setActiveKeys] = useState(['query', 'chartOption']);
  // 根据当前展开数量动态分配每个面板的高度；只展开一个时占满原高度
  const getCardStyle = (panelKey) => {
    const keys = Array.isArray(activeKeys) ? activeKeys : [activeKeys];
    const isOpen = keys.includes(panelKey);
    const openedCount = Math.max(keys.length, 1);
    const height = openedCount > 0 ? `calc((100vh - 288px) / ${openedCount})` : 'calc(100vh - 288px)';
    return {
      height: isOpen ? height : undefined,
      overflow: 'auto',
      border: 'none',
    };
  };
  useEffect(() => {
    ctx?.defineMethod?.('writeSql', async (sql, dataSource) => {
      const dsKey = dataSource || form?.values?.query?.sqlDatasource || DEFAULT_DATA_SOURCE_KEY;
      form?.setValuesIn?.('query.mode', 'sql');
      form?.setValuesIn?.('query.sql', sql);
      form?.setValuesIn?.('query.sqlDatasource', dsKey);
      return ctx.model.onPreview(form?.values, true);
    });
    ctx?.defineMethod?.('writeChartConfig', async (raw) => {
      form?.setValuesIn?.('chart.option.mode', 'custom');
      form?.setValuesIn?.('chart.option.raw', raw);
      return ctx.model.onPreview(form?.values);
    });
    ctx?.defineMethod?.('writeChartEvents', async (raw) => {
      form?.setValuesIn?.('chart.events.mode', 'custom');
      form?.setValuesIn?.('chart.events.raw', raw);
      return ctx.model.onPreview(form?.values);
    });
  }, [ctx, form]);
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Collapse, {
      activeKey: activeKeys,
      onChange: setActiveKeys,
      items: [
        {
          key: 'query',
          label: React.createElement('span', { style: { fontWeight: 500 } }, t('Data query')),
          children: React.createElement(
            Card,
            { style: getCardStyle('query'), styles: { body: { padding: 0 } } },
            React.createElement(QueryPanel, null),
          ),
        },
        {
          key: 'chartOption',
          label: React.createElement('span', { style: { fontWeight: 500 } }, t('Chart options')),
          children: React.createElement(
            Card,
            { style: getCardStyle('chartOption'), styles: { body: { padding: 0 } } },
            React.createElement(ChartOptionsPanel, null),
          ),
        },
        {
          key: 'events',
          label: React.createElement('span', { style: { fontWeight: 500 } }, t('Events')),
          children: React.createElement(
            Card,
            { style: getCardStyle('events'), styles: { body: { padding: 0 } } },
            React.createElement(EventsPanel, null),
          ),
        },
      ],
    }),
  );
};
//# sourceMappingURL=ConfigPanel.js.map
