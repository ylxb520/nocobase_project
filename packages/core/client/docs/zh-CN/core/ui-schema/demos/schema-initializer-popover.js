import { observer, useField, useFieldSchema } from '@formily/react';
import {
  Application,
  Plugin,
  SchemaComponent,
  SchemaInitializer,
  useDesignable,
  useSchemaInitializerRender,
} from '@nocobase/client';
import { Button } from 'antd';
import React from 'react';
const Hello = observer(() => {
  const field = useField();
  return React.createElement(
    'div',
    { style: { marginBottom: 20, padding: '0 20px', height: 50, lineHeight: '50px', background: '#f1f1f1' } },
    field.title,
  );
});
const MyInitializerComponent = () => {
  const { insertBeforeEnd } = useDesignable();
  return React.createElement(
    Button,
    {
      onClick: () =>
        insertBeforeEnd({
          type: 'void',
          title: Math.random(),
          'x-component': 'Hello',
        }),
    },
    'Add block',
  );
};
const myInitializer = new SchemaInitializer({
  name: 'myInitializer',
  popover: false,
  Component: MyInitializerComponent,
});
const AddBlockButton = observer(
  () => {
    const fieldSchema = useFieldSchema();
    const { render } = useSchemaInitializerRender(fieldSchema['x-initializer']);
    return render();
  },
  { displayName: 'AddBlockButton' },
);
const Page = observer(
  (props) => {
    return React.createElement('div', null, props.children, React.createElement(AddBlockButton, null));
  },
  { displayName: 'Page' },
);
const Root = () => {
  return React.createElement(
    'div',
    null,
    React.createElement(SchemaComponent, {
      components: { Page, Hello, AddBlockButton },
      schema: {
        type: 'void',
        name: 'page',
        'x-component': 'Page',
        'x-initializer': 'myInitializer',
        properties: {
          hello1: {
            type: 'void',
            title: 'Test1',
            'x-component': 'Hello',
          },
          hello2: {
            type: 'void',
            title: 'Test2',
            'x-component': 'Hello',
          },
        },
      },
    }),
  );
};
class MyPlugin extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add(myInitializer);
    this.app.router.add('root', {
      path: '/',
      Component: Root,
    });
  }
}
const app = new Application({
  router: {
    type: 'memory',
    initialEntries: ['/'],
  },
  plugins: [MyPlugin],
  designable: true,
});
export default app.getRootComponent();
//# sourceMappingURL=schema-initializer-popover.js.map
