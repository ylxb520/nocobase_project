import { Application, Plugin } from '@nocobase/client';
import { defineFlow, FlowModel, FlowModelRenderer, useFlowSettingsContext } from '@nocobase/flow-engine';
import { model } from '@formily/reactive';
import { Button, Checkbox, Space } from 'antd';
import React from 'react';
import { observer } from '@formily/react';
class ObservablePropsModel extends FlowModel {
  intervalId = null;
  constructor(options) {
    super(options);
    this.context.defineProperty('selectable', {
      get: () => model({ value: true }), // observable上下文
    });
    this.context.defineProperty('width', {
      get: () => model({ value: '60%' }), // observable上下文
    });
  }
  render() {
    return React.createElement(Button, null, 'Button');
  }
}
const SettingComponent = observer(() => {
  const ctx = useFlowSettingsContext();
  return React.createElement(
    'div',
    { style: { padding: '16px 0' } },
    React.createElement(
      Space,
      { direction: 'vertical', style: { width: '100%' }, size: 'middle' },
      React.createElement(
        'div',
        null,
        React.createElement(
          Checkbox,
          {
            checked: ctx.selectable.value,
            onChange: (e) => {
              ctx.selectable.value = e.target.checked;
            },
          },
          '\u53EF\u9009\u72B6\u6001',
        ),
        React.createElement(
          'div',
          { style: { marginTop: 8, fontSize: '12px', color: '#666' } },
          '\u5F53\u524D: ',
          ctx.selectable.value ? '可选(mask半透明)' : '不可选(mask不透明)',
        ),
      ),
      React.createElement(
        'div',
        { style: { paddingTop: 8, borderTop: '1px solid #f0f0f0' } },
        React.createElement(
          Button,
          {
            size: 'small',
            onClick: () => {
              ctx.width.value = parseInt(ctx.width.value) + 1 + '%';
            },
          },
          '\u589E\u52A0\u5F39\u7A97\u5BBD\u5EA6',
        ),
        React.createElement(
          'div',
          { style: { marginTop: 4, fontSize: '12px', color: '#999' } },
          '\u5F53\u524D\u5BBD\u5EA6: ',
          ctx.width.value,
        ),
      ),
    ),
  );
});
const observablePropsFlow = defineFlow({
  key: 'observablePropsFlow',
  title: 'Observable Props Flow',
  steps: {
    myStep: {
      title: 'My Step',
      uiSchema: {
        text: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': SettingComponent,
        },
      },
      uiMode: (ctx) => ({
        type: 'dialog',
        props: {
          width: ctx.width.value,
          title: 'Title',
          styles: {
            mask: {
              backgroundColor: ctx.selectable.value ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)',
            },
          },
        },
      }),
      handler(ctx, params) {},
    },
  },
});
ObservablePropsModel.registerFlow(observablePropsFlow);
class ObservablePropsPlugin extends Plugin {
  async load() {
    this.flowEngine.flowSettings.forceEnable();
    this.flowEngine.registerModels({ ObservablePropsModel });
    const model = this.flowEngine.createModel({
      uid: 'observable-props-model',
      use: 'ObservablePropsModel',
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model, showFlowSettings: true }),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [ObservablePropsPlugin],
});
export default app.getRootComponent();
//# sourceMappingURL=observable-props.js.map
