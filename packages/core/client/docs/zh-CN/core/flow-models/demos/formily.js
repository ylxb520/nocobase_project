import { FormButtonGroup, FormItem, Input, Submit } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer, FlowsSettings } from '@nocobase/flow-engine';
import { Card } from 'antd';
import React from 'react';
const schema = {
  type: 'object',
  properties: {
    input: {
      type: 'string',
      title: 'input box',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'Hello, NocoBase!',
      required: true,
      'x-component-props': {
        style: {
          width: 240,
        },
      },
    },
    textarea: {
      type: 'string',
      title: 'text box',
      required: true,
      default: 'This is a text box.',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        style: {
          width: 400,
        },
      },
    },
  },
};
class FormilyFlowModel extends FlowModel {
  SchemaField;
  form;
  onInit(options) {
    this.SchemaField = createSchemaField({
      components: {
        Input,
        FormItem,
      },
    });
    this.form = createForm();
  }
  render() {
    return React.createElement(
      FormProvider,
      { form: this.form },
      React.createElement(this.SchemaField, { schema: this.props.schema }),
      React.createElement(FormButtonGroup, null, React.createElement(Submit, { onSubmit: console.log }, 'Submit')),
      React.createElement('br', null),
      React.createElement(Card, null, React.createElement('pre', null, JSON.stringify(this.form.values, null, 2))),
    );
  }
}
FormilyFlowModel.registerFlow('defaultFlow', {
  steps: {
    step1: {
      uiSchema: {
        schema: {
          type: 'string',
          title: 'Formily Schema',
          'x-component': 'Input.TextArea',
          'x-component-props': {
            autoSize: true,
          },
        },
      },
      async handler(ctx, params) {
        try {
          ctx.model.setProps('schema', JSON.parse(params.schema));
          ctx.model.form.clearFormGraph();
        } catch (error) {
          // skip
        }
      },
    },
  },
});
class PluginFormilyModel extends Plugin {
  async load() {
    this.flowEngine.registerModels({ FormilyFlowModel });
    const model = this.flowEngine.createModel({
      use: 'FormilyFlowModel',
      // props: {
      //   schema,
      // },
      stepParams: {
        defaultFlow: {
          step1: {
            schema: JSON.stringify(schema, null, 2),
          },
        },
      },
    });
    this.router.add('root', {
      path: '/',
      element: React.createElement(
        'div',
        null,
        React.createElement(FlowModelRenderer, { model: model }),
        React.createElement('br', null),
        React.createElement(FlowsSettings, { model: model }),
      ),
    });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginFormilyModel],
});
export default app.getRootComponent();
//# sourceMappingURL=formily.js.map
