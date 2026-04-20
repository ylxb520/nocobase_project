import { Application, BlockModel, Plugin } from '@nocobase/client';
import { AddSubModelButton, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space, Switch, Typography } from 'antd';
import React, { useState } from 'react';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class ContainerModel extends FlowModel {
  render() {
    return React.createElement(View, { model: this });
  }
}
function View({ model }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return React.createElement(
    Space,
    { direction: 'vertical', style: { width: '100%' } },
    React.createElement(
      Space,
      null,
      React.createElement(Typography.Text, null, 'showAdvanced'),
      React.createElement(Switch, { checked: showAdvanced, onChange: setShowAdvanced }),
    ),
    model.mapSubModels('items', (item) => {
      return React.createElement(FlowModelRenderer, {
        key: item.uid,
        model: item,
        showFlowSettings: { showBorder: true },
      });
    }),
    React.createElement(
      AddSubModelButton,
      {
        model: model,
        subModelKey: 'items',
        items: [
          {
            key: 'basic',
            label: 'Basic Block',
            createModelOptions: { use: 'BasicBlockModel' },
          },
          {
            key: 'advanced-group',
            label: 'Advanced (hide)',
            type: 'group',
            children: [
              {
                key: 'advanced-async',
                label: 'Advanced Block (async hide)',
                hide: async () => {
                  await sleep(200);
                  return !showAdvanced;
                },
                createModelOptions: { use: 'AdvancedBlockModel' },
              },
              {
                key: 'advanced-alias',
                label: 'Advanced Block (sync hide)',
                hide: () => !showAdvanced,
                createModelOptions: { use: 'AdvancedBlockModel' },
              },
            ],
          },
        ],
      },
      React.createElement(Button, null, 'Add block'),
    ),
  );
}
class BasicBlockModel extends BlockModel {
  renderComponent() {
    return React.createElement(
      'div',
      null,
      React.createElement('h3', null, 'Basic Block'),
      React.createElement(
        'div',
        { style: { color: '#666' } },
        '\u6211\u662F\u4E00\u4E2A\u666E\u901A\u7684 subModel\u3002',
      ),
    );
  }
}
class AdvancedBlockModel extends BlockModel {
  renderComponent() {
    return React.createElement(
      'div',
      null,
      React.createElement('h3', null, 'Advanced Block'),
      React.createElement(
        'div',
        { style: { color: '#666' } },
        '\u4EC5\u5F53 showAdvanced=true \u65F6\u624D\u4F1A\u51FA\u73B0\u5728 AddSubModelButton \u83DC\u5355\u91CC\u3002',
      ),
    );
  }
}
class PluginDemo extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ ContainerModel, BasicBlockModel, AdvancedBlockModel });
    const model = this.flowEngine.createModel({
      uid: 'container',
      use: 'ContainerModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, {
        model: model,
        showFlowSettings: { showBorder: true, showBackground: true },
      }),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=add-sub-model-hide.js.map
