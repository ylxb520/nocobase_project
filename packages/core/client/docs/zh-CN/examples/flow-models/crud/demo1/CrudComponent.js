import { observer, useFlowContext } from '@nocobase/flow-engine';
import { Button, Flex, Popconfirm, Space, Table } from 'antd';
import React from 'react';
import { FormComponent } from './FormComponent';
export const CrudComponent = observer(() => {
  const ctx = useFlowContext();
  return React.createElement(
    Space,
    { direction: 'vertical', style: { width: '100%' } },
    React.createElement(
      Flex,
      { justify: 'space-between', align: 'center' },
      React.createElement(Button, null, 'Filter'),
      React.createElement(
        Space,
        null,
        React.createElement(
          Popconfirm,
          {
            title: 'Are you sure to delete all selected records?',
            onConfirm: async () => {
              const selectedRowKeys = ctx.selectedRowKeys;
              if (selectedRowKeys && selectedRowKeys.length > 0) {
                console.log('Deleting records with IDs:', selectedRowKeys);
                await ctx.resource.destroy(selectedRowKeys);
                ctx.message.success('Records deleted successfully');
              } else {
                ctx.message.warning('No records selected');
              }
            },
          },
          React.createElement(Button, null, ctx.t('Delete')),
        ),
        React.createElement(
          Button,
          {
            type: 'primary',
            onClick: () => {
              ctx.viewer.open({
                type: 'drawer',
                width: '50%',
                content: React.createElement(FormComponent, null),
              });
            },
          },
          'Add new',
        ),
      ),
    ),
    React.createElement(Table, {
      dataSource: ctx.resource.getData(),
      rowKey: 'id',
      rowSelection: {
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
          ctx.defineProperty('selectedRowKeys', {
            get: () => selectedRowKeys,
          });
          ctx.defineProperty('selectedRows', {
            get: () => selectedRows,
          });
        },
      },
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        // { title: 'Telephone', dataIndex: 'telephone', key: 'telephone' },
        // { title: 'Live', dataIndex: 'live', key: 'live' },
        // { title: 'Remark', dataIndex: 'remark', key: 'remark' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        {
          title: 'Actions',
          key: 'actions',
          render: (_value, record) =>
            React.createElement(
              Space,
              null,
              React.createElement(
                Button,
                {
                  type: 'link',
                  onClick: () => {
                    ctx.viewer.open({
                      type: 'drawer',
                      width: '50%',
                      content: React.createElement(FormComponent, { record: record }),
                    });
                  },
                },
                'Edit',
              ),
              React.createElement(
                Popconfirm,
                {
                  title: 'Are you sure to delete this record?',
                  onConfirm: async () => {
                    await ctx.resource.destroy(record.id);
                    ctx.message.success('Record deleted successfully');
                  },
                },
                React.createElement(Button, { type: 'link' }, 'Delete'),
              ),
            ),
        },
      ],
      pagination: {
        showSizeChanger: true,
        total: ctx.resource.getCount(),
        pageSize: ctx.resource.getPageSize(),
        onChange: (page, pageSize) => {
          ctx.resource.setPage(page);
          ctx.resource.setPageSize(pageSize);
          ctx.resource.refresh();
        },
      },
    }),
  );
});
//# sourceMappingURL=CrudComponent.js.map
