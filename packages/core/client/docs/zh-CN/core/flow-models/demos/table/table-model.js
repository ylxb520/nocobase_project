import { SettingOutlined } from '@ant-design/icons';
import { AddSubModelButton, FlowModel, FlowModelRenderer, MultiRecordResource } from '@nocobase/flow-engine';
import { Button, Dropdown, Space, Table } from 'antd';
import React from 'react';
import { api } from './api';
export class TableModel extends FlowModel {
  collection;
  resource;
  getColumns() {
    return this.mapSubModels('columns', (column) => column.getColumnProps()).concat({
      key: 'addColumn',
      fixed: 'right',
      title: React.createElement(
        Dropdown,
        {
          menu: {
            onClick: (info) => {
              const model = this.addSubModel('columns', {
                use: 'TableColumnModel',
                stepParams: {
                  default: {
                    step1: {
                      fieldPath: info.key,
                    },
                  },
                },
              });
              model.dispatchEvent('beforeRender');
            },
            items: this.collection.mapFields((field) => {
              return {
                key: `${this.collection.dataSource.key}.${this.collection.name}.${field.name}`,
                label: field.title,
              };
            }),
          },
        },
        React.createElement(Button, null, 'Add column'),
      ),
    });
  }
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        Space,
        { style: { marginBottom: 16 } },
        this.mapSubModels('actions', (action) =>
          React.createElement(FlowModelRenderer, {
            model: action,
            showFlowSettings: true,
            inputArgs: { currentModel: this, resource: this.resource },
          }),
        ),
        React.createElement(
          AddSubModelButton,
          {
            model: this,
            subModelKey: 'actions',
            items: () => [
              {
                key: 'action1',
                label: 'Delete',
                createModelOptions: {
                  use: 'DeleteActionModel',
                },
              },
            ],
          },
          React.createElement(
            Button,
            { type: 'primary', icon: React.createElement(SettingOutlined, null) },
            'Configure actions',
          ),
        ),
      ),
      React.createElement(Table, {
        rowKey: 'id',
        dataSource: this.resource.getData(),
        columns: this.getColumns(),
        rowSelection: {
          type: 'checkbox',
          onChange: (_, selectedRows) => {
            this.resource.setSelectedRows(selectedRows);
          },
          selectedRowKeys: this.resource.getSelectedRows().map((row) => row.id),
        },
        pagination: {
          current: this.resource.getMeta('page'),
          pageSize: this.resource.getMeta('pageSize'),
          total: this.resource.getMeta('count'),
        },
        onChange: (pagination) => {
          this.resource.setPage(pagination.current);
          this.resource.setPageSize(pagination.pageSize);
          this.resource.refresh();
        },
      }),
    );
  }
}
TableModel.registerFlow({
  key: 'default',
  steps: {
    step1: {
      async handler(ctx, params) {
        if (ctx.model.collection) {
          return;
        }
        ctx.model.collection = ctx.dsm.getCollection(params.dataSourceKey, params.collectionName);
        const resource = new MultiRecordResource();
        resource.setDataSourceKey(params.dataSourceKey);
        resource.setResourceName(params.collectionName);
        resource.setAPIClient(api);
        ctx.model.resource = resource;
        await resource.refresh();
        await ctx.model.applySubModelsBeforeRenderFlows('columns');
      },
    },
  },
});
//# sourceMappingURL=table-model.js.map
