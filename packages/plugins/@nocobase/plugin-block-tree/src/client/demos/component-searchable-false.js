import React from 'react';
import { Tree } from '@nocobase/plugin-block-tree/client';
import { getMockData } from './fixtures/getMockData';
const App = () => {
  return React.createElement(Tree, { treeData: getMockData(), searchable: false });
};
export default App;
//# sourceMappingURL=component-searchable-false.js.map
