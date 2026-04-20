/**
 * iframe: true
 */
import { MobilePageHeader, MobilePageProvider } from '@nocobase/plugin-mobile/client';
import React from 'react';
const App = () => {
    return (React.createElement(MobilePageProvider, null,
        React.createElement(MobilePageHeader, null,
            React.createElement("div", null, "content"))));
};
export default App;
//# sourceMappingURL=pages-page-header-basic.js.map