/**
 * defaultShowCode: true
 */
import { TableOutlined } from '@ant-design/icons';
import { Application, SchemaInitializer, SchemaInitializerItem, useSchemaInitializerItem } from '@nocobase/client';
import React from 'react';
import { appOptions } from './schema-initializer-common';
const Demo = () => {
  const { name, foo, icon } = useSchemaInitializerItem();
  return React.createElement(SchemaInitializerItem, { icon: icon, title: `${name} - ${foo}` });
};
const myInitializer = new SchemaInitializer({
  name: 'myInitializer',
  title: 'Button Text',
  items: [
    {
      name: 'a',
      foo: 'bar',
      icon: React.createElement(TableOutlined, null),
      Component: Demo,
    },
  ],
});
const app = new Application({
  ...appOptions,
  schemaInitializers: [myInitializer],
});
export default app.getRootComponent();
//# sourceMappingURL=schema-initializer-hooks-item.js.map
