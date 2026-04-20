import React from 'react';
import { Table } from 'antd';
import { SchemaComponent, useDataBlockRequest, withDynamicSchemaProps } from '@nocobase/client';
import { createApp } from '../../../data-source/demos/createApp';
const schema = {
  type: 'void',
  name: 'root',
  'x-decorator': 'DataBlockProvider',
  'x-decorator-props': {
    collection: 'users',
    action: 'list',
  },
  'x-component': 'CardItem',
  properties: {
    demo: {
      type: 'array',
      'x-component': 'MyTable',
      'x-use-component-props': 'useTableProps', // 动态 table 属性
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
        title: 'UserName',
        dataIndex: 'username',
      },
      {
        title: 'NickName',
        dataIndex: 'nickname',
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
    ],
  };
}
const Demo = () => {
  return React.createElement(SchemaComponent, { schema: schema });
};
const Root = createApp(Demo, {
  components: { MyTable },
  scopes: { useTableProps },
});
export default Root;
//# sourceMappingURL=collection-table-list.js.map
