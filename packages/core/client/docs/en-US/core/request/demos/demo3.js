import { uid } from '@formily/shared';
import { APIClient, APIClientProvider, useAPIClient, useRequest } from '@nocobase/client';
import { Button, Input, Space, Table } from 'antd';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
const apiClient = new APIClient();
const mock = new MockAdapter(apiClient.axios);
const sleep = (value) => new Promise((resolve) => setTimeout(resolve, value));
mock.onGet('/users:list').reply(async () => {
  await sleep(1000);
  return [
    200,
    {
      data: [
        { id: 1, name: uid() },
        { id: 2, name: uid() },
      ],
    },
  ];
});
const ComponentA = () => {
  console.log('ComponentA');
  const { data, loading } = useRequest(
    {
      url: 'users:list',
      method: 'get',
    },
    {
      uid: 'test', // 当指定了 uid 的 useRequest 的结果，可以通过 api.service(uid) 获取
    },
  );
  return React.createElement(Table, {
    pagination: false,
    rowKey: 'id',
    loading: loading,
    dataSource: data?.data,
    columns: [{ title: 'Name', dataIndex: 'name' }],
  });
};
const ComponentB = () => {
  console.log('ComponentB');
  const apiClient = useAPIClient();
  return React.createElement(
    Space,
    null,
    React.createElement(Input, null),
    React.createElement(Button, { onClick: () => apiClient.service('test')?.run() }, '\u63D0\u4EA4'),
  );
};
export default () => {
  return React.createElement(
    APIClientProvider,
    { apiClient: apiClient },
    React.createElement(ComponentB, null),
    React.createElement('br', null),
    React.createElement('br', null),
    React.createElement(ComponentA, null),
  );
};
//# sourceMappingURL=demo3.js.map
