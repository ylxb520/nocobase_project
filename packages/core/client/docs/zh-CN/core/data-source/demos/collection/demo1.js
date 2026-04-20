import React from 'react';
import { CollectionProvider, useCollection } from '@nocobase/client';
import { createApp } from '../createApp';
const Demo = () => {
  const collection = useCollection();
  return React.createElement('pre', null, JSON.stringify(collection.getField('username'), null, 2));
};
const Root = () => {
  return React.createElement(CollectionProvider, { name: 'users' }, React.createElement(Demo, null));
};
export default createApp(Root);
//# sourceMappingURL=demo1.js.map
