import { Application, Plugin } from '@nocobase/client';
import { AddSubModelButton, FlowEngineProvider, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Space } from 'antd';
import React from 'react';
class DemoRootModel extends FlowModel {
  render() {
    return React.createElement(
      Space,
      { direction: 'vertical', style: { width: '100%' } },
      this.mapSubModels('items', (item) =>
        React.createElement(FlowModelRenderer, { key: item.uid, model: item, showFlowSettings: { showBorder: true } }),
      ),
      React.createElement(
        AddSubModelButton,
        { model: this, subModelKey: 'items', subModelBaseClasses: ['GroupBase', 'SubmenuBase'] },
        React.createElement(Button, null, '\u6DFB\u52A0\u5B50\u6A21\u578B'),
      ),
    );
  }
}
// 作为普通“组”显示（平铺子项）
class GroupBase extends FlowModel {
  static meta = {
    label: '分组（平铺）',
    sort: 200,
    children: () => [{ key: 'group-leaf', label: '组内子项', createModelOptions: { use: 'Leaf' } }],
  };
}
// 作为“二级菜单”显示
class SubmenuBase extends FlowModel {
  static meta = {
    label: '二级菜单',
    menuType: 'submenu',
    sort: 110,
    children: () => [{ key: 'submenu-leaf', label: '子菜单子项', createModelOptions: { use: 'Leaf' } }],
  };
}
class Leaf extends FlowModel {
  render() {
    return React.createElement(
      'div',
      {
        style: {
          padding: 12,
          border: '1px dashed #d9d9d9',
          background: '#fafafa',
          borderRadius: 6,
        },
      },
      React.createElement('div', { style: { fontWeight: 600, marginBottom: 4 } }, 'Leaf Block'),
      React.createElement('div', { style: { color: '#555' } }, 'UID: ', this.uid.slice(0, 6)),
    );
  }
}
class PluginSubmenuDemo extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ DemoRootModel, GroupBase, SubmenuBase, Leaf });
    const model = this.flowEngine.createModel({ uid: 'demo-root', use: 'DemoRootModel' });
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        FlowEngineProvider,
        { engine: this.flowEngine },
        React.createElement(FlowModelRenderer, { model: model }),
      ),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginSubmenuDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=add-sub-model-submenu-base-class.js.map
