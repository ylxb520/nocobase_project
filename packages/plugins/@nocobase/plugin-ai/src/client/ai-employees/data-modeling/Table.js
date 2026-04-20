/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Table as AntdTable, Checkbox, Tag, Select, Input } from 'antd';
import { useT } from '../../locale';
import { useApp } from '@nocobase/client';
import { Schema } from '@formily/react';
const useColumns = () => {
  const t = useT();
  const columns = [
    {
      title: t('Collection display name'),
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (value) => {
        return React.createElement(Input, { value: value });
      },
    },
    {
      title: t('Collection name'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (value) => {
        return React.createElement(Input, { value: value });
      },
    },
    {
      title: t('Collection template'),
      dataIndex: 'template',
      key: 'template',
      width: 150,
      render: (value) => {
        const template = value.charAt(0).toUpperCase() + value.slice(1);
        return React.createElement(Tag, null, t(`${template} collection`));
      },
    },
    {
      title: t('Preset fields'),
      key: 'preset',
      width: 300,
      render: (_, record) => {
        const value = [];
        if (record.autoGenId !== false) {
          value.push('id');
        }
        if (record.createdAt !== false) {
          value.push('createdAt');
        }
        if (record.updatedAt !== false) {
          value.push('updatedAt');
        }
        if (record.createdBy) {
          value.push('createdBy');
        }
        if (record.updatedBy) {
          value.push('updatedBy');
        }
        return React.createElement(Checkbox.Group, {
          options: [
            {
              label: 'ID',
              value: 'id',
            },
            {
              label: t('Created at'),
              value: 'createdAt',
            },
            {
              label: t('Last Updated at'),
              value: 'updatedAt',
            },
            {
              label: t('Created by'),
              value: 'createdBy',
            },
            {
              label: t('Last updated by'),
              value: 'updatedBy',
            },
          ],
          defaultValue: value,
          disabled: true,
        });
      },
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      width: 350,
    },
  ];
  return columns;
};
const useExpandColumns = () => {
  const t = useT();
  const app = useApp();
  const fim = app.dataSourceManager.collectionFieldInterfaceManager;
  const columns = [
    AntdTable.EXPAND_COLUMN,
    {
      title: t('Field display name'),
      dataIndex: 'title',
      width: 150,
      key: 'title',
      render: (value) => {
        return React.createElement(Input, { value: value });
      },
    },
    {
      title: t('Field name'),
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (value) => {
        return React.createElement(Input, { value: value });
      },
    },
    {
      title: t('Field interface'),
      width: 150,
      dataIndex: 'interface',
      key: 'interface',
      render: (value) => {
        const fieldInterface = fim.getFieldInterface(value);
        return React.createElement(Select, {
          defaultValue: fieldInterface ? Schema.compile(fieldInterface.title, { t }) : value,
        });
      },
    },
  ];
  return columns;
};
const ExpandedRowRender = (record) => {
  const expandColumns = useExpandColumns();
  return React.createElement(AntdTable, {
    rowKey: 'name',
    columns: expandColumns,
    dataSource: record.fields,
    pagination: false,
    expandable: {
      expandedRowRender: (record) => {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement(
            'div',
            null,
            React.createElement(
              'span',
              {
                style: {
                  color: '#999',
                  marginRight: '8px',
                  marginLeft: '48px',
                },
              },
              'Description:',
            ),
            record.description || '-',
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'span',
              {
                style: {
                  color: '#999',
                  marginRight: '8px',
                  marginLeft: '48px',
                },
              },
              'Enumurations:',
            ),
            record.enum
              ? record.enum.map((item) =>
                  React.createElement(Tag, { key: item.value }, item.label, ' (', item.value, ')'),
                )
              : null,
          ),
        );
      },
    },
  });
};
export const Table = ({ collections }) => {
  const columns = useColumns();
  return React.createElement(AntdTable, {
    scroll: {
      y: '60vh',
    },
    style: {
      height: '70vh',
    },
    rowKey: 'name',
    columns: columns,
    dataSource: collections,
    expandable: {
      expandedRowRender: ExpandedRowRender,
      rowExpandable: (record) => record.fields && record.fields.length > 0,
    },
  });
};
//# sourceMappingURL=Table.js.map
