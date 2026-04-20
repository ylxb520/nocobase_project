import React from 'react';
import { Tree } from '@nocobase/plugin-block-tree/client';
import { getMockData } from './fixtures/getMockData';
const App = () => {
  return React.createElement(Tree, { treeData: getMockData() });
};
export default App;
//# sourceMappingURL=component-basic.js.map
