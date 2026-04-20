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
class ConfigureFieldsFlowModel extends FlowModel {
  getDataSources() {
    return [...dsm.dataSources.values()];
  }
  render() {
    return React.createElement(
      'div',
      null,
      this.getDataSources().map((ds) =>
        React.createElement(
          Card,
          { key: ds.name, title: ds.options.displayName, style: { marginBottom: 24 } },
          ds.getCollections().map((collection) =>
            React.createElement(
              Card,
              { key: collection.name, title: collection.title, style: { marginBottom: 24 } },
              collection.getFields().map((field) => React.createElement('div', { key: field.name }, field.name)),
              React.createElement(
                Space,
                null,
                React.createElement(
                  Button,
                  {
                    onClick: () => {
                      collection.addField({
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
                      collection.clearFields();
                    },
                  },
                  'Clear Fields',
                ),
              ),
            ),
          ),
          React.createElement(
            Space,
            null,
            React.createElement(
              Button,
              {
                onClick: () => {
                  ds.addCollection({
                    name: `collection-${uid()}`,
                    title: `Collection ${uid()}`,
                  });
                },
              },
              'Add Collection',
            ),
            React.createElement(
              Button,
              {
                onClick: () => {
                  ds.clearCollections();
                },
              },
              'Clear Collection',
            ),
          ),
        ),
      ),
      React.createElement(
        Space,
        null,
        React.createElement(
          Button,
          {
            onClick: () => {
              dsm.addDataSource({
                key: `ds-${uid()}`,
                displayName: `ds-${uid()}`,
              });
            },
          },
          'Add Data Source',
        ),
        React.createElement(
          Button,
          {
            onClick: () => {
              dsm.clearDataSources();
            },
          },
          'Clear Data Sources',
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
//# sourceMappingURL=data-source.js.map
