/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observer, useFlowContext } from '@nocobase/flow-engine';
import React, { useEffect, useState } from 'react';
import { Checkbox, Divider, Flex, Space, Typography, List } from 'antd';
import { Card } from 'antd';
import { dayjs } from '@nocobase/utils/client';
import { useChatMessagesStore } from '../chatbox/stores/chat-messages';
const { Text } = Typography;
export const DatasourceList = observer(({ onSelect, contextItems, onAdd, onRemove }) => {
  const ctx = useFlowContext();
  const workContextItems = contextItems ?? useChatMessagesStore.use.contextItems();
  const dataSource = ctx.resource.getData();
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [checked, setChecked] = useState([]);
  useEffect(() => {
    const ids = workContextItems.filter((x) => x.type === 'datasource').map((x) => x.uid);
    setChecked(ids);
  }, [workContextItems]);
  const itemClickHandler = (item) => () => {
    onSelect(item);
    setSelectedRowKey(item.id);
  };
  useEffect(() => {
    if (dataSource.length) {
      itemClickHandler(dataSource[0])();
    }
  }, [dataSource]);
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(List, {
      style: { height: '80vh', overflowY: 'auto', padding: '10px' },
      dataSource: dataSource,
      loading: ctx.resource.loading,
      pagination: {
        align: 'center',
        showSizeChanger: false,
        total: ctx.resource.getMeta('count'),
        pageSize: ctx.resource.getPageSize(),
        onChange: (page, pageSize) => {
          ctx.resource.setPage(page);
          ctx.resource.setPageSize(pageSize);
          ctx.resource.refresh();
        },
      },
      renderItem: (item) =>
        React.createElement(
          List.Item,
          null,
          React.createElement(
            'div',
            {
              style:
                item.id === selectedRowKey
                  ? {
                      border: '2px dashed #1677ff',
                      borderRadius: 8,
                    }
                  : {},
            },
            React.createElement(
              Card,
              {
                key: item.id,
                hoverable: true,
                variant: 'borderless',
                style: { minWidth: 280, display: 'flex', flexDirection: 'column' },
                onClick: itemClickHandler(item),
              },
              React.createElement(Card.Meta, {
                title: React.createElement(
                  Flex,
                  { justify: 'space-between', align: 'center' },
                  React.createElement('span', null, item.title),
                  React.createElement(Checkbox, {
                    checked: checked.includes(item.id),
                    onChange: (e) => {
                      if (e.target.checked) {
                        setChecked((prev) => [...prev, item.id]);
                        onAdd({ uid: item.id, title: item.title });
                      } else {
                        setChecked(checked.filter((id) => id !== item.id));
                        onRemove(item.id);
                      }
                    },
                  }),
                ),
                description: React.createElement(
                  Space,
                  { style: { fontSize: 13 } },
                  React.createElement(Text, { type: 'secondary' }, ctx.t('Collection')),
                  React.createElement(Text, null, `${item.datasource}/${item.collectionName}`),
                  React.createElement(Divider, { type: 'vertical' }),
                  React.createElement(Text, { type: 'secondary' }, ctx.t('Limit')),
                  React.createElement(Text, null, item.limit),
                ),
              }),
              React.createElement(
                'div',
                {
                  style: { width: 250, height: 80, display: 'flex', flexDirection: 'column', flex: 1, paddingTop: 10 },
                },
                React.createElement(
                  'div',
                  { style: { width: '100%', height: 70 } },
                  React.createElement(
                    Typography.Paragraph,
                    {
                      type: 'secondary',
                      ellipsis: {
                        rows: 2,
                      },
                    },
                    item.description,
                  ),
                ),
                React.createElement(
                  'div',
                  { style: { marginTop: 'auto' } },
                  React.createElement(
                    Flex,
                    { justify: 'space-between', align: 'center' },
                    React.createElement(
                      Space,
                      { style: { fontSize: 10 } },
                      React.createElement(
                        Text,
                        { type: 'secondary' },
                        `${ctx.t('Created at')} ${dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}`,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
    }),
  );
});
//# sourceMappingURL=DatasourceList.js.map
