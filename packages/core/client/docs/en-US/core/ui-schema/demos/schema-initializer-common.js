import { Grid, Plugin, SchemaComponent } from '@nocobase/client';
import React from 'react';
const HelloPage = () => {
  return React.createElement(
    'div',
    null,
    React.createElement(SchemaComponent, {
      schema: {
        name: 'root',
        type: 'void',
        'x-component': 'Grid',
        'x-initializer': 'myInitializer',
        properties: {},
      },
    }),
  );
};
class PluginHello extends Plugin {
  async load() {
    this.app.addComponents({ Grid });
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
  plugins: [PluginHello],
};
export { appOptions };
//# sourceMappingURL=schema-initializer-common.js.map
