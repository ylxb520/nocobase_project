/**
 * defaultShowCode: true
 */
import { Application, SchemaInitializer, SchemaInitializerItem } from '@nocobase/client';
import React from 'react';
import { appOptions } from './schema-initializer-common';
const Demo = () => {
  // 最终渲染 `SchemaInitializerItem`
  return React.createElement(SchemaInitializerItem, { title: 'Component Demo' });
};
const myInitializer = new SchemaInitializer({
  name: 'myInitializer',
  title: 'Button Text',
  items: [
    {
      name: 'a',
      Component: Demo, // 通过 Component 定义
    },
    {
      name: 'b',
      type: 'item',
      title: 'type Demo',
    },
  ],
});
const app = new Application({
  ...appOptions,
  schemaInitializers: [myInitializer],
});
export default app.getRootComponent();
//# sourceMappingURL=schema-initializer-options-item-define.js.map
