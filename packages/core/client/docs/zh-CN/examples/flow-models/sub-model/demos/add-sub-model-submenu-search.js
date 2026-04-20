import { Application, BlockModel, Plugin } from '@nocobase/client';
import { AddSubModelButton, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space } from 'antd';
import React from 'react';
class DemoContainerModel extends FlowModel {
  render() {
    return React.createElement(
      Space,
      { direction: 'vertical', style: { width: '100%' } },
      this.mapSubModels('items', (item) =>
        React.createElement(FlowModelRenderer, { key: item.uid, model: item, showFlowSettings: { showBorder: true } }),
      ),
      React.createElement(
        AddSubModelButton,
        {
          model: this,
          subModelKey: 'items',
          items: [
            {
              key: 'submenu',
              label: 'Pick a block',
              searchable: true,
              searchPlaceholder: 'Search blocks',
              children: [
                { key: 'a', label: 'Block 1', useModel: 'BlockAModel' },
                { key: 'b', label: 'Block 2', useModel: 'BlockBModel' },
                {
                  key: 'g',
                  type: 'group',
                  label: 'Group X',
                  children: [{ key: 'x', label: 'Xray', useModel: 'BlockBModel' }],
                },
              ],
            },
          ],
        },
        React.createElement(Button, null, 'Add block (submenu search)'),
      ),
    );
  }
}
class BlockAModel extends BlockModel {
  renderComponent() {
    return React.createElement('div', null, React.createElement('h3', null, 'Block 1'));
  }
}
class BlockBModel extends BlockModel {
  renderComponent() {
    return React.createElement('div', null, React.createElement('h3', null, 'Block 2'));
  }
}
class DemoPlugin extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ DemoContainerModel, BlockAModel, BlockBModel });
    const model = this.flowEngine.createModel({ uid: 'demo', use: 'DemoContainerModel' });
    this.router.add('root', { path: '/', element: React.createElement(FlowModelRenderer, { model: model }) });
  }
}
const app = new Application({ router: { type: 'memory', initialEntries: ['/'] }, plugins: [DemoPlugin] });
export default app.getRootComponent();
//# sourceMappingURL=add-sub-model-submenu-search.js.map
