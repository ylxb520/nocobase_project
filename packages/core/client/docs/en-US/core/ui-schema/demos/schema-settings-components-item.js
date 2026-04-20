/**
 * defaultShowCode: true
 */
import React, { useState } from 'react';
import { Application, SchemaSettings, SchemaSettingsItem, useDesignable } from '@nocobase/client';
import { appOptions } from './schema-settings-common';
import { observer, useField } from '@formily/react';
import { Button, Input, Space } from 'antd';
const MarkdownEdit = () => {
  const field = useField();
  return React.createElement(SchemaSettingsItem, {
    title: 'Edit markdown',
    onClick: () => {
      field.editable = true;
    },
  });
};
const mySettings = new SchemaSettings({
  name: 'mySettings',
  items: [
    {
      name: 'markdown',
      Component: MarkdownEdit,
    },
    {
      name: 'disabled',
      Component() {
        return React.createElement(SchemaSettingsItem, { title: 'Disabled', disabled: true });
      },
    },
  ],
});
const Hello = observer((props) => {
  const field = useField();
  const { content } = props;
  const [inputVal, setInputVal] = useState(content);
  const { patch } = useDesignable();
  return field.editable
    ? React.createElement(
        Space,
        null,
        React.createElement(Input, {
          placeholder: 'input value',
          value: inputVal,
          onChange: (e) => setInputVal(e.target.value),
        }),
        React.createElement(
          Space,
          null,
          React.createElement(
            Button,
            {
              onClick: () => {
                field.editable = false;
                setInputVal(content);
              },
            },
            'Cancel',
          ),
          React.createElement(
            Button,
            {
              type: 'primary',
              onClick: () => {
                field.editable = false;
                patch({
                  'x-component-props': {
                    content: inputVal,
                  },
                });
              },
            },
            'Submit',
          ),
        ),
      )
    : React.createElement('h1', null, content);
});
const app = new Application({
  ...appOptions,
  schemaSettings: [mySettings],
});
app.addComponents({ Hello });
export default app.getRootComponent();
//# sourceMappingURL=schema-settings-components-item.js.map
