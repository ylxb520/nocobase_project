import React from 'react';
import { MobileTitleProvider, useMobileTitle } from '@nocobase/plugin-mobile/client';
const InnerPage = () => {
    const { title, setTitle } = useMobileTitle();
    return (React.createElement("div", null,
        React.createElement("h1", null, title),
        React.createElement("button", { onClick: () => setTitle('Hello World') }, "Set Title")));
};
const Demo = () => {
    return (React.createElement(MobileTitleProvider, null,
        React.createElement(InnerPage, null)));
};
export default Demo;
//# sourceMappingURL=MobileTitleProvider-basic.js.map