import React from 'react';
import { CollectionProvider, Collection, useCollection, Plugin } from '@nocobase/client';
import { createApp } from '../createApp';
class TestMixin extends Collection {
  test() {
    const { name } = this.options;
    return 'test ' + name;
  }
}
class Test2Mixin extends Collection {
  test2() {
    const { name } = this.options;
    return 'test2 ' + name;
  }
}
const Demo = () => {
  const collection = useCollection();
  return React.createElement(
    'div',
    null,
    React.createElement('div', null, 'test: ', collection.test()),
    React.createElement('div', null, 'test2: ', collection.test2()),
    React.createElement('div', null, 'fields.length: ', collection.getFields().length),
  );
};
const Root = () => {
  return React.createElement(CollectionProvider, { name: 'users' }, React.createElement(Demo, null));
};
class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.addCollectionMixins([TestMixin, Test2Mixin]);
  }
}
export default createApp(Root, {
  plugins: [MyPlugin],
});
//# sourceMappingURL=mixins.js.map
