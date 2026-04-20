import { observer } from '@formily/reactive-react';
import { Application, MockFlowModelRepository, Plugin } from '@nocobase/client';
import { AddSubModelButton, FlowModel, FlowModelRenderer, useFlowEngine } from '@nocobase/flow-engine';
import { useRequest } from 'ahooks';
import { Button, Card, Space } from 'antd';
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
      React.createElement('h1', null, 'Hello, NocoBase1!'),
      React.createElement('p', null, 'This is a simple block rendered by HelloModel.'),
      React.createElement(
        Space,
        { direction: 'vertical' },
        this.mapSubModels('subs', (subModel) =>
          React.createElement(FlowModelRenderer, { key: subModel.uid, model: subModel, showFlowSettings: true }),
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
                // 如果是新模型，可能需要进行一些初始化操作
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
            React.createElement(Button, { type: 'primary' }, 'Add Sub Model'),
          ),
          React.createElement(
            Button,
            {
              onClick: async () => {
                this.context.engine.modelRepository['clear']();
                window.location.reload();
              },
            },
            'Clear',
          ),
        ),
      ),
    );
  }
}
class HelloSubModel extends FlowModel {
  render() {
    return React.createElement(
      Card,
      { title: `Hello SubModel - ${this.props.name}` },
      React.createElement('p', null, 'This is a sub-model rendered by HelloSubModel.'),
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
//# sourceMappingURL=load-or-create-model.js.map
