/**
 * defaultShowCode: true
 */
import { useFieldSchema } from '@formily/react';
import {
  Action,
  Application,
  CardItem,
  Form,
  FormItem,
  Grid,
  Input,
  SchemaInitializer,
  SchemaInitializerActionModal,
  useSchemaInitializer,
} from '@nocobase/client';
import React from 'react';
import { appOptions } from './schema-initializer-common';
const myInitializer = new SchemaInitializer({
  name: 'myInitializer',
  wrap: Grid.wrap,
  Component: () => {
    const { insert } = useSchemaInitializer();
    return React.createElement(SchemaInitializerActionModal, {
      title: 'Add Card',
      buttonText: 'Add Card',
      onSubmit: ({ title }) => {
        insert({
          type: 'void',
          title,
          'x-decorator': 'CardItem',
          'x-component': 'Hello',
        });
      },
      schema: {
        title: {
          type: 'string',
          title: 'Title',
          required: true,
          'x-component': 'Input',
          'x-decorator': 'FormItem',
        },
      },
    });
  },
});
const Hello = () => {
  const schema = useFieldSchema();
  return React.createElement('h1', null, 'Hello, world! ', schema.title);
};
const app = new Application({
  ...appOptions,
  components: {
    FormItem,
    Action,
    Input,
    Form,
    Hello,
    CardItem,
  },
  schemaInitializers: [myInitializer],
});
export default app.getRootComponent();
//# sourceMappingURL=schema-initializer-components-action-modal-1.js.map
