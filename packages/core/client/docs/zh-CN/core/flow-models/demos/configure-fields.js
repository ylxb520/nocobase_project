import { Application, Plugin } from '@nocobase/client';
import { DataSource, DataSourceManager, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Dropdown, Input } from 'antd';
import React from 'react';
const dsm = new DataSourceManager();
const ds = new DataSource({
  key: 'main',
  displayName: 'Main',
  description: 'This is the main data source',
});
dsm.addDataSource(ds);
ds.addCollection({
  name: 'roles',
  title: 'Roles',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
    },
    {
      name: 'uid',
      type: 'string',
      title: 'UID',
    },
  ],
});
ds.addCollection({
  name: 'users',
  title: 'Users',
  fields: [
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
  getFieldMenuItems() {
    return this.collection.mapFields((field) => {
      return {
        key: `${this.collection.dataSource.key}.${this.collection.name}.${field.name}`,
        label: field.title,
      };
    });
  }
  render() {
    return React.createElement(
      'div',
      null,
      this.mapSubModels('fields', (field) => React.createElement(FlowModelRenderer, { key: field.uid, model: field })),
      React.createElement(
        Dropdown,
        {
          menu: {
            items: this.getFieldMenuItems(),
            onClick: (info) => {
              const model = this.addSubModel('fields', {
                use: 'FieldModel',
                stepParams: {
                  default: {
                    step1: {
                      fieldPath: info.key,
                    },
                  },
                },
              });
            },
          },
        },
        React.createElement(Button, null, 'Configure fields'),
      ),
    );
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
//# sourceMappingURL=configure-fields.js.map
