import { CardItem, Grid, Plugin, SchemaComponent } from '@nocobase/client';
import React from 'react';
const Hello = () => {
  return React.createElement('h1', null, 'Hello, world!');
};
const HelloPage = () => {
  return React.createElement(
    'div',
    null,
    React.createElement(SchemaComponent, {
      schema: {
        name: 'root',
        type: 'void',
        'x-component': 'Grid',
        properties: {
          hello: Grid.wrap({
            type: 'void',
            'x-settings': 'mySettings',
            'x-decorator': 'CardItem',
            'x-component': 'Hello',
          }),
        },
      },
    }),
  );
};
class PluginHello extends Plugin {
  async load() {
    this.router.add('hello', {
      path: '/',
      Component: HelloPage,
    });
  }
}
const appOptions = {
  router: {
    type: 'memory',
  },
  designable: true,
  components: { Grid, CardItem, Hello },
  plugins: [PluginHello],
};
export { appOptions };
//# sourceMappingURL=schema-settings-common.js.map
