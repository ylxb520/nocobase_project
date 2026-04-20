/**
 * defaultShowCode: true
 */
import React from 'react';
import { Application, SchemaSettings, SchemaSettingsItem } from '@nocobase/client';
import { appOptions } from './schema-settings-common';
const CommonDemo = (props) => {
  return React.createElement(SchemaSettingsItem, { title: props.title });
};
const mySettings = new SchemaSettings({
  name: 'mySettings',
  items: [
    {
      name: 'a',
      Component: CommonDemo,
      componentProps: {
        title: 'componentProps',
      },
    },
    {
      name: 'b',
      Component: CommonDemo,
      useComponentProps() {
        return {
          title: 'useComponentProps',
        };
      },
    },
  ],
});
const app = new Application({
  ...appOptions,
  schemaSettings: [mySettings],
});
export default app.getRootComponent();
//# sourceMappingURL=schema-settings-options-item-props.js.map
