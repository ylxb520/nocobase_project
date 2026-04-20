import { Application, Plugin } from '@nocobase/client';
import { DataSource, DataSourceManager, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Input, Table } from 'antd';
import React from 'react';
const dsm = new DataSourceManager();
const ds = new DataSource({
  name: 'main',
  displayName: 'Main',
  description: 'This is the main data source',
});
dsm.addDataSource(ds);
ds.addCollection({
  name: 'users',
  title: 'Users',
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      title: 'ID',
    },
    {
      name: 'username',
      type: 'string',
      title: 'Username',
    },
    {
      name: 'nickname',
      type: 'string',
      title: 'Nickname',
    },
  ],
});
class FieldModel extends FlowModel {
  field;
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(Input, {
        value: this.field.title,
        onChange: (e) => {
          const field = dsm.getCollectionField(this.stepParams.default.step1.fieldPath);
          if (!field) {
            console.error('Field not found:', this.stepParams.default.step1.fieldPath);
            return;
          }
          field.title = e.target.value;
        },
      }),
    );
  }
}
FieldModel.registerFlow({
  key: 'default',
  steps: {
    step1: {
      handler(ctx, params) {
        if (ctx.model.field) {
          return;
        }
        ctx.model.field = dsm.getCollectionField(params.fieldPath);
      },
    },
  },
});
class ConfigureFieldsFlowModel extends FlowModel {
  collection;
  render() {
    return React.createElement('div', null, React.createElement(Table, null));
  }
}
ConfigureFieldsFlowModel.registerFlow({
  key: 'default',
  steps: {
    step1: {
      uiSchema: {
        dataSourceKey: {
          type: 'string',
          title: 'DataSource Name',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
        },
        collectionName: {
          type: 'string',
          title: 'Collection Name',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
        },
      },
      handler(ctx, params) {
        if (ctx.model.collection) {
          return;
        }
        ctx.model.collection = dsm.getCollection(params.dataSourceKey, params.collectionName);
      },
    },
  },
});
class PluginTableBlockModel extends Plugin {
  async load() {
    this.flowEngine.registerModels({ FieldModel, ConfigureFieldsFlowModel });
    const model = this.flowEngine.createModel({
      use: 'ConfigureFieldsFlowModel',
      stepParams: {
        default: {
          step1: {
            dataSourceKey: 'main',
            collectionName: 'users',
          },
        },
      },
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model, showFlowSettings: true }),
    });
  }
}
// 创建应用实例
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginTableBlockModel],
});
export default app.getRootComponent();
//# sourceMappingURL=multi-record-resource-table.js.map
