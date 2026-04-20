import { uid } from '@formily/shared';
import { Application, Plugin } from '@nocobase/client';
import { DataSource, DataSourceManager, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Card, Space } from 'antd';
import React from 'react';
const dsm = new DataSourceManager();
const ds = new DataSource({
  name: 'main',
  displayName: 'Main',
  description: 'This is the main data source',
});
dsm.addDataSource(ds);
ds.addCollection({
  name: 'base',
  title: 'base',
  fields: [
    {
      name: 'id',
      type: 'string',
      title: 'ID',
    },
  ],
});
ds.addCollection({
  name: 'users',
  title: 'Users',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
    },
  ],
});
ds.addCollection({
  name: 'students',
  title: 'Students',
  inherits: ['base', 'users'],
  fields: [
    {
      name: 'age',
      type: 'integer',
      title: 'Age',
    },
  ],
});
class ConfigureFieldsFlowModel extends FlowModel {
  get collection() {
    return ds.getCollection('students');
  }
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        Card,
        { key: this.collection.name, title: this.collection.title, style: { marginBottom: 24 } },
        this.collection.getFields().map((field) => React.createElement('div', { key: field.name }, field.name)),
        React.createElement(
          Space,
          null,
          React.createElement(
            Button,
            {
              onClick: () => {
                this.collection.addField({
                  name: `field-${uid()}`,
                });
              },
            },
            'Add Field',
          ),
          React.createElement(
            Button,
            {
              onClick: () => {
                this.collection.clearFields();
              },
            },
            'Clear Fields',
          ),
        ),
      ),
    );
  }
}
class PluginTableBlockModel extends Plugin {
  async load() {
    this.flowEngine.registerModels({ ConfigureFieldsFlowModel });
    const model = this.flowEngine.createModel({
      use: 'ConfigureFieldsFlowModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
// 创建应用实例
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginTableBlockModel],
});
export default app.getRootComponent();
//# sourceMappingURL=collection-inherits.js.map
