import { PlusOutlined } from '@ant-design/icons';
import { observer } from '@formily/reactive-react';
import { Application, MockFlowModelRepository, Plugin } from '@nocobase/client';
import {
  AddSubModelButton,
  DndProvider,
  DragHandler,
  Droppable,
  FlowModel,
  FlowModelRenderer,
  useFlowEngine,
} from '@nocobase/flow-engine';
import { useRequest } from 'ahooks';
import { Avatar, Button, Space } from 'antd';
import React from 'react';
function useLoadOrCreateFlowModel(options) {
  const engine = useFlowEngine();
  const { loading, data } = useRequest(
    async () => {
      let model = await engine.loadModel(options);
      if (!model) {
        model = engine.createModel(options);
        model.isNewModel = true; // 标记为新模型
      }
      return model;
    },
    {
      refreshDeps: [options.uid],
    },
  );
  return { loading, model: data };
}
const Length = observer((props) => {
  const { model } = props;
  return model.hasSubModel('subs') && React.createElement('span', null, model.subModels.subs?.length, ' items');
});
function HelloComponent(props) {
  const { loading, model } = useLoadOrCreateFlowModel({
    uid: props.uid,
    use: 'HelloModel',
  });
  if (loading) {
    return React.createElement('div', null, 'Loading...');
  }
  return React.createElement(
    'div',
    null,
    React.createElement(FlowModelRenderer, { model: model }),
    React.createElement(Length, { model: model }),
  );
}
class HelloModel extends FlowModel {
  isNewModel = false;
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement('h1', null, '\u62D6\u62FD\u6F14\u793A\uFF08DND Example\uFF09'),
      React.createElement(
        'p',
        null,
        '\u4F60\u53EF\u4EE5\u62D6\u52A8\u5B50\u6A21\u578B\u5361\u7247\uFF0C\u6216\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u6DFB\u52A0/\u6E05\u7A7A\u5B50\u6A21\u578B\u3002',
      ),
      React.createElement(
        DndProvider,
        null,
        React.createElement(
          Space,
          null,
          this.mapSubModels('subs', (subModel) =>
            React.createElement(
              Droppable,
              { key: subModel.uid, model: subModel },
              React.createElement(FlowModelRenderer, {
                key: subModel.uid,
                model: subModel,
                showFlowSettings: true,
                extraToolbarItems: [
                  {
                    key: 'drag-handler',
                    component: DragHandler,
                    sort: 1,
                  },
                ],
              }),
            ),
          ),
          React.createElement(
            Space,
            null,
            React.createElement(
              AddSubModelButton,
              {
                model: this,
                subModelKey: 'subs',
                afterSubModelAdd: async (subModel) => {
                  if (this.isNewModel) {
                    await this.save();
                    this.isNewModel = false;
                  }
                },
                items: [
                  {
                    key: 'sub1',
                    useModel: 'HelloSubModel',
                    label: 'Sub Model 1',
                    createModelOptions: {
                      props: {
                        name: 'name1',
                      },
                    },
                  },
                  {
                    key: 'sub2',
                    useModel: 'HelloSubModel',
                    label: 'Sub Model 2',
                    createModelOptions: {
                      props: {
                        name: 'name2',
                      },
                    },
                  },
                ],
              },
              React.createElement(Button, {
                type: 'dashed',
                style: { height: 64, width: 64 },
                size: 'large',
                icon: React.createElement(PlusOutlined, null),
              }),
            ),
            React.createElement(
              Button,
              {
                size: 'large',
                style: { height: 64 },
                onClick: async () => {
                  this.context.engine.modelRepository['clear']();
                  window.location.reload();
                },
              },
              '\u6E05\u7A7A',
            ),
          ),
        ),
      ),
    );
  }
}
class HelloSubModel extends FlowModel {
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        Avatar,
        {
          shape: 'square',
          size: 64,
          src: `https://api.dicebear.com/7.x/miniavs/svg?seed=${Math.floor(Math.random() * 100)}`,
        },
        this.props.name,
      ),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    // 注册 HelloModel 到 flowEngine
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ HelloModel, HelloSubModel });
    this.flowEngine.setModelRepository(new MockFlowModelRepository('load-model-test:'));
    // 添加路由，将模型渲染到根路径（仅用于示例）
    this.router.add('root', {
      path: '/',
      element: React.createElement('div', null, React.createElement(HelloComponent, { uid: 'hello1' })),
    });
  }
}
// 创建应用实例，注册插件（仅用于示例）
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=dnd.js.map
