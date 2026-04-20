/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tabs, Tooltip, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useFlowContext } from '@nocobase/flow-engine';
import { useCollectionContext } from '../../context';
import { dayjs } from '@nocobase/utils/client';
import { useCompile } from '@nocobase/client';
const { Text, Paragraph } = Typography;
export const Preview = ({ formData, show }) => {
  const ctx = useFlowContext();
  const currentCollection = useCollectionContext();
  const title = `${ctx.t('Collection')}: ${currentCollection.displayName}`;
  const { loading, collectionFields, datasource, refresh } = usePreview(formData);
  useEffect(() => {
    if (show) {
      refresh();
    }
  }, [show, refresh]);
  const items = [
    {
      key: 'Tab-0',
      label: ctx.t('Table'),
      children: React.createElement(PreviewTable, {
        title: title,
        loading: loading,
        collectionFields: collectionFields,
        datasource: datasource,
        onRefresh: refresh,
      }),
    },
    {
      key: 'Tab-1',
      label: 'JSON',
      children: React.createElement(PreviewJSON, { title: title, loading: loading, datasource: datasource }),
    },
  ];
  return (
    show &&
    React.createElement(
      'div',
      { style: { padding: '16px' } },
      React.createElement(Tabs, {
        type: 'card',
        tabBarStyle: { marginBottom: 0 },
        defaultActiveKey: '1',
        items: items,
      }),
    )
  );
};
const usePreview = (formData) => {
  const ctx = useFlowContext();
  const [loading, setLoading] = useState(false);
  const [collectionFields, setCollectionFields] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await ctx.api.resource('aiContextDatasources').preview({ values: formData });
      const { options, records } = data?.data ?? {};
      if (options) {
        const { datasource, collectionName, fields } = options;
        const collection = ctx.dataSourceManager.getCollection(datasource, collectionName);
        const collectionFields = collection.getFields().filter((f) => fields.includes(f.name));
        setCollectionFields(collectionFields);
      }
      if (records) {
        const datasource = records.map((x) =>
          x.reduce((acc, cur) => {
            acc[cur.name] = cur.value;
            return acc;
          }, {}),
        );
        setDatasource(datasource);
      }
    } finally {
      setLoading(false);
    }
  }, [ctx, formData]);
  return {
    loading,
    collectionFields,
    datasource,
    refresh,
  };
};
const PreviewTable = ({ title, loading, collectionFields, datasource, onRefresh }) => {
  const ctx = useFlowContext();
  const compile = useCompile();
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    setColumns(
      collectionFields.map((field) => ({
        key: field.name,
        title: React.createElement(
          Text,
          { style: { minWidth: 100, maxWidth: 300 }, ellipsis: { tooltip: field.title } },
          field.title,
        ),
        dataIndex: field.name,
        width: 'auto',
        render: (value) => {
          if (['hasOne', 'hasMany', 'belongsTo', 'belongsToMany', 'belongsToArray'].includes(field.type)) {
            return React.createElement(
              Text,
              { style: { minWidth: 100, maxWidth: 300 }, ellipsis: true },
              value ? JSON.stringify(value) : '',
            );
          }
          if (field.type === 'date') {
            return React.createElement(
              Text,
              { style: { minWidth: 100, maxWidth: 300 }, ellipsis: { tooltip: value } },
              dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
            );
          } else {
            return React.createElement(
              Text,
              {
                style: { minWidth: 100, maxWidth: 300 },
                ellipsis: { tooltip: typeof value === 'string' ? compile(value) : JSON.stringify(value) },
              },
              typeof value === 'string' ? compile(value) : JSON.stringify(value),
            );
          }
        },
      })),
    );
  }, [collectionFields]);
  return React.createElement(
    'div',
    { style: { height: '100%' } },
    React.createElement(
      Card,
      {
        title: title,
        extra: React.createElement(
          Tooltip,
          { title: ctx.t('Refresh') },
          React.createElement(Button, {
            icon: React.createElement(ReloadOutlined, null),
            type: 'link',
            onClick: () => {
              onRefresh();
            },
          }),
        ),
        style: {
          borderTop: 'none',
          borderTopLeftRadius: '0',
        },
      },
      React.createElement(
        Space,
        { direction: 'vertical', size: 'large', style: { width: '100%' } },
        React.createElement(Table, {
          columns: columns,
          dataSource: datasource,
          loading: loading,
          scroll: { x: 'max-content', y: '56vh' },
          pagination: {
            showSizeChanger: true,
            showTotal: (total) => ctx.t('Total {{total}} items', { total }),
            pageSize: 25,
          },
        }),
      ),
    ),
  );
};
const PreviewJSON = ({ title, loading, datasource }) => {
  const [text, setText] = useState('');
  useEffect(() => {
    if (datasource) {
      setText(JSON.stringify(datasource, null, 2));
    }
  }, [datasource]);
  return React.createElement(
    'div',
    { style: { height: '100%' } },
    React.createElement(
      Card,
      {
        title: title,
        extra: React.createElement(Text, { copyable: { text } }),
        style: {
          borderTop: 'none',
          borderTopLeftRadius: '0',
        },
      },
      React.createElement(
        Paragraph,
        null,
        !loading &&
          React.createElement(
            'pre',
            {
              style: {
                height: '62vh',
                overflowY: 'auto',
                marginTop: '24px',
              },
            },
            text,
          ),
      ),
    ),
  );
};
//# sourceMappingURL=Preview.js.map
