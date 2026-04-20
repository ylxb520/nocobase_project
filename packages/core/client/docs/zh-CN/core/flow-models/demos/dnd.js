import { Application, Plugin } from '@nocobase/client';
import { DndProvider, DragHandler, Droppable, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import React from 'react';
function DemoBlock({ model }) {
  console.log('Rendering DemoBlock with model:', model.uid);
  return React.createElement(
    'div',
    { style: { display: 'flex', alignItems: 'center' } },
    React.createElement(DragHandler, { model: model }),
    React.createElement(
      'div',
      null,
      React.createElement('h3', { style: { margin: 0 } }, 'Demo Block - #', model.uid),
      React.createElement('p', { style: { margin: 0 } }, 'This is a demo block content.'),
    ),
  );
}
class DemoBlockModel extends FlowModel {
  render() {
    return React.createElement(Droppable, { model: this }, React.createElement(DemoBlock, { model: this }));
  }
}
class HelloModel extends FlowModel {
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        DndProvider,
        {
          onDragEnd: ({ active, over }) => {
            if (over) {
              this.flowEngine.moveModel(active.id, over.id);
            }
          },
        },
        React.createElement(
          'div',
          { style: { gap: 16, display: 'flex', flexDirection: 'column' } },
          this.mapSubModels('blocks', (block) => {
            return React.createElement(FlowModelRenderer, { key: block.uid, model: block });
          }),
        ),
      ),
    );
  }
}
// 插件定义
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.registerModels({ HelloModel, DemoBlockModel });
    const model = this.flowEngine.createModel({
      use: 'HelloModel',
      props: {
        name: 'NocoBase',
      },
      subModels: {
        blocks: [
          {
            use: 'DemoBlockModel',
            uid: 'block1',
          },
          {
            use: 'DemoBlockModel',
            uid: 'block2',
          },
          {
            use: 'DemoBlockModel',
            uid: 'block3',
          },
        ],
      },
    });
    this.router.add('root', { path: '/', element: React.createElement(FlowModelRenderer, { model: model }) });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=dnd.js.map
