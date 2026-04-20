import { faker } from '@faker-js/faker';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer, SingleRecordResource } from '@nocobase/flow-engine';
import { Button, message, Space } from 'antd';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { APIClient } from '@nocobase/sdk';
const api = new APIClient({
  baseURL: 'https://localhost:8000/api',
});
const mock = new MockAdapter(api.axios);
const records = [
  {
    id: 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
  },
];
mock.onGet('users:get').reply((config) => {
  return [
    200,
    {
      data: records[0] || null,
    },
  ];
});
mock.onPost('users:update').reply((config) => {
  if (records.length === 0) {
    return [
      404,
      {
        errors: [
          {
            code: 'NotFound',
            message: 'Record not found',
          },
        ],
      },
    ];
  }
  records[0] = {
    ...records[0],
    ...JSON.parse(config.data),
  };
  return [
    200,
    {
      data: records[0],
    },
  ];
});
mock.onPost('users:destroy').reply((config) => {
  records.splice(0, 1); // 删除第一个记录
  return [
    200,
    {
      data: 1,
    },
  ];
});
// class DataBlockFlowModel extends FlowModel {
//   resource;
//   constructor(options) {
//     super(options);
//     this.resource = new SingleRecordResource();
//     this.resource.setAPIClient(this.flowEngine.apiClient);
//   }
// }
class SingleRecordFlowModel extends FlowModel {
  resource = new SingleRecordResource();
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { style: { marginBottom: 16 } },
        React.createElement('strong', null, 'Resource:'),
        ' ',
        this.resource.getResourceName(),
        ' |',
        React.createElement('strong', null, ' FilterByTk:'),
        ' ',
        this.resource.getFilterByTk(),
      ),
      React.createElement('pre', null, JSON.stringify(this.resource.getData(), null, 2)),
      React.createElement(
        Space,
        null,
        React.createElement(
          Button,
          {
            onClick: () => {
              records[0] = {
                id: 1,
                name: faker.person.fullName(),
                email: faker.internet.email(),
              };
              this.resource.refresh();
            },
          },
          'Reset',
        ),
        React.createElement(Button, { onClick: () => this.resource.refresh() }, 'Refresh'),
        React.createElement(
          Button,
          {
            onClick: async () => {
              try {
                await this.resource.save({
                  name: faker.person.fullName(),
                  email: faker.internet.email(),
                });
              } catch (error) {
                message.error(error.message);
              }
            },
          },
          'Save',
        ),
        React.createElement(Button, { onClick: () => this.resource.destroy(), danger: true }, 'Delete'),
      ),
    );
  }
}
SingleRecordFlowModel.registerFlow({
  key: 'setResourceOptions',
  steps: {
    step1: {
      async handler(ctx, params) {
        ctx.model.resource.setAPIClient(api);
        ctx.model.resource.setResourceName('users');
        ctx.model.resource.setFilterByTk(1);
        await ctx.model.resource.refresh();
      },
    },
  },
});
class PluginSingleRecordDemo extends Plugin {
  async load() {
    this.flowEngine.registerModels({ SingleRecordFlowModel });
    const model = this.flowEngine.createModel({
      use: 'SingleRecordFlowModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement('div', null, React.createElement(FlowModelRenderer, { model: model })),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginSingleRecordDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=single-record-resource.js.map
