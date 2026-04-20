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
      React.createElement('h1', null, '\u6B22\u8FCE\u6765\u5230 NocoBase\uFF01'),
      React.createElement('p', null, '\u8FD9\u662F\u7531 HelloModel \u6E32\u67D3\u7684\u793A\u4F8B\u533A\u5757\u3002'),
      React.createElement(
        Space,
        { direction: 'vertical', style: { width: '100%' } },
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
                  label: 'Card 1',
                  createModelOptions: {
                    props: {
                      name: 'name1',
                    },
                  },
                },
                {
                  key: 'sub2',
                  useModel: 'HelloSubModel',
                  label: 'Card 2',
                  createModelOptions: {
                    props: {
                      name: 'name2',
                    },
                  },
                },
              ],
            },
            React.createElement(Button, { type: 'primary' }, 'Add Card'),
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
      { ...this.props },
      React.createElement('div', {
        dangerouslySetInnerHTML: {
          __html: this.props.children,
        },
      }),
    );
  }
}
HelloSubModel.registerFlow({
  key: 'cardSettings',
  title: '卡片设置',
  steps: {
    setProps: {
      title: '通用属性',
      uiSchema: {
        title: {
          title: 'Card Title',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
        },
        children: {
          title: 'Card Content',
          'x-component': 'Input.TextArea',
          'x-decorator': 'FormItem',
        },
      },
      defaultParams: {
        title: 'Hello, NocoBase!',
        children: 'This is a simple card rendered by HelloModel.',
      },
      handler(ctx, params) {
        ctx.model.setProps(params);
      },
    },
  },
});
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
//# sourceMappingURL=multi-card.js.map
