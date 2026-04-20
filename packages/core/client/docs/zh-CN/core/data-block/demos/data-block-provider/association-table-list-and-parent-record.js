import React from 'react';
import { Table } from 'antd';
import { SchemaComponent, useDataBlockRequest, withDynamicSchemaProps } from '@nocobase/client';
import { createApp } from '../../../data-source/demos/createApp';
const collection = 'users';
const associationField = 'roles';
const association = `${collection}.${associationField}`;
const action = 'list';
const schema = {
  type: 'void',
  name: 'root',
  'x-decorator': 'DataBlockProvider',
  'x-use-decorator-props': 'useBlockDecoratorProps',
  'x-decorator-props': {
    association,
    action,
  },
  'x-component': 'CardItem',
  properties: {
    demo: {
      type: 'array',
      'x-component': 'MyTable',
      'x-use-component-props': 'useTableProps',
    },
  },
};
const MyTable = withDynamicSchemaProps(Table);
function useTableProps() {
  const { data, loading } = useDataBlockRequest();
  return {
    loading,
    dataSource: data?.data || [],
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Title',
        dataIndex: 'title',
      },
      {
        title: 'Description',
        dataIndex: 'description',
      },
    ],
  };
}
const useBlockDecoratorProps = () => {
  const parentRecord = {
    id: 1,
    username: 'Tom',
  };
  return {
    parentRecord,
  };
};
const Demo = () => {
  return React.createElement(SchemaComponent, { schema: schema });
};
const mocks = {
  [`${collection}/1/${associationField}:${action}`]: {
    data: [
      {
        name: 'admin',
        title: 'Admin',
        description: 'Admin description',
      },
      {
        name: 'developer',
        title: 'Developer',
        description: 'Developer description',
      },
    ],
  },
};
const Root = createApp(
  Demo,
  {
    components: { MyTable },
    scopes: { useTableProps, useBlockDecoratorProps },
  },
  mocks,
);
export default Root;
//# sourceMappingURL=association-table-list-and-parent-record.js.map
