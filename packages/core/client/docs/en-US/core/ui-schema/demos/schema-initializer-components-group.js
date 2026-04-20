import { Application, SchemaInitializer, SchemaInitializerItemGroup } from '@nocobase/client';
import React from 'react';
import { appOptions } from './schema-initializer-common';
const myInitializer = new SchemaInitializer({
  name: 'myInitializer',
  title: 'Button Text',
  items: [
    {
      name: 'a',
      title: 'A Group Title',
      type: 'itemGroup',
      children: [
        {
          name: 'a1',
          type: 'item',
          title: 'A1',
        },
        {
          name: 'a2',
          type: 'item',
          title: 'A2',
        },
      ],
    },
    {
      name: 'b',
      title: 'B Group Title',
      type: 'itemGroup',
      divider: true,
      useChildren() {
        // 动态子元素
        return [
          {
            name: 'b1',
            type: 'item',
            title: 'B1',
          },
          {
            name: 'b2',
            type: 'item',
            title: 'B2',
          },
        ];
      },
    },
    {
      name: 'c',
      Component: () => {
        return React.createElement(SchemaInitializerItemGroup, {
          title: 'C Group Title',
          items: [
            {
              name: 'c1',
              type: 'item',
              title: 'C1',
            },
          ],
        });
      },
    },
  ],
});
const app = new Application({
  ...appOptions,
  schemaInitializers: [myInitializer],
});
export default app.getRootComponent();
//# sourceMappingURL=schema-initializer-components-group.js.map
