/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Flex, Radio, Space, Table, Transfer } from 'antd';
import { useFlowContext } from '@nocobase/flow-engine';
import { useCollectionContext } from '../../context';
const TableTransfer = (props) => {
  const { leftColumns, rightColumns, ...restProps } = props;
  return React.createElement(
    Transfer,
    { style: { width: '100%' }, ...restProps },
    ({
      direction,
      filteredItems,
      onItemSelect,
      onItemSelectAll,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;
      const rowSelection = {
        getCheckboxProps: () => ({ disabled: listDisabled }),
        onChange(selectedRowKeys) {
          onItemSelectAll(selectedRowKeys, 'replace');
        },
        selectedRowKeys: listSelectedKeys,
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
      };
      return React.createElement(Table, {
        rowSelection: rowSelection,
        columns: columns,
        dataSource: filteredItems,
        size: 'small',
        style: { pointerEvents: listDisabled ? 'none' : undefined },
        pagination: {
          defaultPageSize: 20,
        },
        onRow: ({ key, disabled: itemDisabled }) => ({
          onClick: () => {
            if (itemDisabled || listDisabled) {
              return;
            }
            onItemSelect(key, !listSelectedKeys.includes(key));
          },
        }),
      });
    },
  );
};
const filterOption = (input, item) => item.title?.includes(input);
export const FieldsTransfer = ({ value, onChange }) => {
  const ctx = useFlowContext();
  const ds = ctx.dataSourceManager;
  const currentCollection = useCollectionContext();
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      dataIndex: 'title',
      title: ctx.t('Field display name'),
    },
  ];
  useEffect(() => {
    const collection = currentCollection.collection;
    if (!collection) {
      setDataSource([]);
      return;
    }
    const dataSource = collection
      .getFields()
      .filter((field) => field.options.interface && !field.options.hidden)
      .map((field) => ({
        key: field.name,
        title: field.title,
      }));
    setDataSource(dataSource);
  }, [ds, currentCollection]);
  return React.createElement(
    Flex,
    { align: 'start', gap: 'middle', vertical: true },
    React.createElement(TableTransfer, {
      dataSource: dataSource,
      targetKeys: value,
      showSearch: true,
      showSelectAll: false,
      onChange: onChange,
      filterOption: filterOption,
      leftColumns: columns,
      rightColumns: columns,
    }),
  );
};
export const SortFieldsTransfer = ({ value, onChange }) => {
  const ctx = useFlowContext();
  const ds = ctx.dataSourceManager;
  const currentCollection = useCollectionContext();
  const [dataSource, setDataSource] = useState([]);
  const [targetKeys, setTargetKeys] = useState(value?.map((v) => (v.startsWith('-') ? v.slice(1) : v)) ?? []);
  const handleTransferTargetChange = useCallback(
    (targetKeys) => {
      setTargetKeys(targetKeys);
      onChange?.(
        targetKeys.map((key) => {
          const record = dataSource.find((item) => item.key === key);
          console.log(key, record);
          if (record?.direction === 'desc') {
            return `-${key}`;
          } else {
            return key;
          }
        }),
      );
    },
    [onChange, setTargetKeys, dataSource],
  );
  const leftColumns = [
    {
      dataIndex: 'title',
      title: ctx.t('Field display name'),
    },
  ];
  const rightColumns = [
    {
      dataIndex: 'title',
      title: ctx.t('Field display name'),
    },
    {
      title: ctx.t('Direction'),
      render: (_value, record) => {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement(
            'div',
            { onClick: (e) => e.stopPropagation() },
            React.createElement(Radio.Group, {
              defaultValue: 'asc',
              value: record.direction,
              options: [
                { value: 'asc', label: ctx.t('Asc') },
                { value: 'desc', label: ctx.t('Desc') },
              ],
              onChange: (e) => {
                e.stopPropagation();
                record.direction = e.target.value;
                handleTransferTargetChange(targetKeys);
              },
            }),
          ),
        );
      },
    },
    {
      title: ctx.t('Actions'),
      render: (_value, record) => {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement(
            Space,
            { direction: 'horizontal' },
            React.createElement(
              Button,
              {
                type: 'link',
                onClick: (e) => {
                  e.stopPropagation();
                  const sortingIndex = targetKeys.indexOf(record.key);
                  if (sortingIndex > 0) {
                    const newSortingKeys = [...targetKeys];
                    newSortingKeys[sortingIndex] = newSortingKeys[sortingIndex - 1];
                    newSortingKeys[sortingIndex - 1] = record.key;
                    handleTransferTargetChange(newSortingKeys);
                  }
                },
              },
              ctx.t('Up'),
            ),
            React.createElement(
              Button,
              {
                type: 'link',
                onClick: (e) => {
                  e.stopPropagation();
                  const sortingIndex = targetKeys.indexOf(record.key);
                  if (sortingIndex !== -1 && sortingIndex < targetKeys.length - 1) {
                    const newSortingKeys = [...targetKeys];
                    newSortingKeys[sortingIndex] = newSortingKeys[sortingIndex + 1];
                    newSortingKeys[sortingIndex + 1] = record.key;
                    handleTransferTargetChange(newSortingKeys);
                  }
                },
              },
              ctx.t('Down'),
            ),
          ),
        );
      },
    },
  ];
  useEffect(() => {
    const collection = currentCollection.collection;
    if (!collection) {
      setDataSource([]);
      return;
    }
    const dataSource = collection
      .getFields()
      .filter((field) => field.options.interface && !field.options.hidden)
      .map((field) => ({
        key: field.name,
        title: field.title,
      }));
    const directions =
      value?.reduce((acc, cur) => {
        if (cur.startsWith('-')) {
          acc[cur.slice(1)] = 'desc';
        } else {
          acc[cur] = 'asc';
        }
        return acc;
      }, {}) ?? {};
    for (const ds of dataSource) {
      ds.direction = directions[ds.key];
    }
    setDataSource(dataSource);
  }, [ds, currentCollection]);
  return React.createElement(
    Flex,
    { align: 'start', gap: 'middle', vertical: true },
    React.createElement(TableTransfer, {
      dataSource: dataSource,
      targetKeys: targetKeys,
      showSearch: true,
      showSelectAll: false,
      onChange: handleTransferTargetChange,
      filterOption: filterOption,
      leftColumns: leftColumns,
      rightColumns: rightColumns,
    }),
  );
};
//# sourceMappingURL=FieldsTransfer.js.map
