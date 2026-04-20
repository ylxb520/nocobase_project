import React from 'react';
import _ from 'lodash';
import { useFieldSchema } from '@formily/react';
function ShowSchema({ children, schemaKey }) {
  const filedSchema = useFieldSchema();
  const key = schemaKey ? `properties.schema.${schemaKey}` : `properties.schema`;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('pre', null, JSON.stringify(_.get(filedSchema.toJSON(), key), null, 2)),
    children,
  );
}
export function schemaViewer(schema, schemaKey) {
  return {
    type: 'void',
    name: 'schema-viewer',
    'x-component': ShowSchema,
    'x-component-props': {
      schemaKey,
    },
    properties: {
      schema,
    },
  };
}
//# sourceMappingURL=schemaViewer.js.map
