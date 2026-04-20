import { useField, useFieldSchema } from '@formily/react';
import {
  Application,
  CardItem,
  FormItem,
  Grid,
  Input,
  Plugin,
  SchemaComponent,
  SchemaSettings,
  SchemaSettingsModalItem,
  createDesignable,
  useAPIClient,
  useRefreshFieldSchema,
  useSchemaSettings,
  useSchemaSettingsRender,
} from '@nocobase/client';
import React, { useMemo } from 'react';
class PluginHello extends Plugin {
  async load() {
    this.router.add('hello', {
      path: '/',
      Component: HelloPage,
    });
  }
}
export const SchemaSettingsBlockTitleItem = function BlockTitleItem() {
  const { dn } = useSchemaSettings();
  return React.createElement(SchemaSettingsModalItem, {
    title: 'Edit block title',
    schema: {
      type: 'object',
      title: 'Edit block title',
      properties: {
        title: {
          title: 'Block title',
          type: 'string',
          default: dn.getSchemaAttribute('x-decorator-props.title'),
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-compile-omitted': ['default'],
        },
      },
    },
    onSubmit: ({ title }) => {
      dn.shallowMerge({
        'x-decorator-props': {
          title,
        },
      });
    },
  });
};
const mySettings = new SchemaSettings({
  name: 'mySettings',
  items: [
    {
      name: 'blockTitle',
      Component: SchemaSettingsBlockTitleItem,
    },
  ],
});
const Hello = (props) => {
  return React.createElement('h1', null, 'Hello, world! ', React.createElement(Demo, null), props.children);
};
const Demo = () => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const api = useAPIClient();
  const refreshFieldSchema = useRefreshFieldSchema();
  const dn = useMemo(
    () =>
      createDesignable({
        current: fieldSchema.parent,
        model: field.parent,
        api,
        refresh: () => refreshFieldSchema({ refreshParentSchema: true }),
      }),
    [api, field.parent, fieldSchema.parent, refreshFieldSchema],
  );
  const { render, exists } = useSchemaSettingsRender(fieldSchema['x-settings'], {
    fieldSchema: dn.current,
    field: dn.model,
    dn,
  });
  return React.createElement(
    'div',
    null,
    React.createElement('div', null, render()),
    React.createElement(
      'div',
      null,
      '\u53EF\u4EE5\u8FDB\u884C\u53C2\u6570\u7684\u4E8C\u6B21\u8986\u76D6\uFF1A',
      render({ style: { color: 'red' } }),
    ),
  );
};
const HelloPage = () => {
  return React.createElement(
    'div',
    null,
    React.createElement(SchemaComponent, {
      schema: {
        name: 'root',
        type: 'void',
        'x-decorator': 'CardItem',
        'x-decorator-props': {
          title: 'aaa',
        },
        properties: {
          hello1: {
            type: 'void',
            'x-settings': 'mySettings',
            'x-decorator': 'CardItem',
            'x-component': 'Hello',
          },
          hello2: {
            type: 'void',
            'x-settings': 'mySettings',
            'x-decorator': 'CardItem',
            'x-component': 'Hello',
          },
        },
      },
    }),
  );
};
const app = new Application({
  schemaSettings: [mySettings],
  router: {
    type: 'memory',
  },
  designable: true,
  components: { FormItem, Input, Grid, CardItem, Hello },
  plugins: [PluginHello],
});
export default app.getRootComponent();
//# sourceMappingURL=schema-settings-render.js.map
