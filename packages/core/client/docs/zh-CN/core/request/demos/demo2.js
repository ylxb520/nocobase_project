import { APIClient, APIClientProvider, compose, useRequest } from '@nocobase/client';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
const apiClient = new APIClient();
const mock = new MockAdapter(apiClient.axios);
mock.onGet('/users:get').reply(200, {
  data: { id: 1, name: 'John Smith' },
});
const providers = [[APIClientProvider, { apiClient }]];
export default compose(...providers)(() => {
  const { data } = useRequest({
    url: 'users:get',
    method: 'get',
  });
  return React.createElement('div', null, data?.data?.name);
});
//# sourceMappingURL=demo2.js.map
