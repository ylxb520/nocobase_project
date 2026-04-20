import React from 'react';
import { mockApp } from '@nocobase/client/demo-utils';
import { SchemaComponent, Plugin } from '@nocobase/client';
import { MobilePageNavigationBar, MobilePageProvider, MobileTitleProvider } from '@nocobase/plugin-mobile/client';
const schema = {
    type: 'void',
    name: 'test',
    'x-component': 'MobilePageNavigationBar',
};
const Demo = () => {
    return (React.createElement("div", { style: { position: 'relative' } },
        React.createElement(MobileTitleProvider, { title: "Title" },
            React.createElement(MobilePageProvider, { displayPageTitle: false },
                React.createElement(SchemaComponent, { schema: schema })))));
};
class DemoPlugin extends Plugin {
    async load() {
        this.app.addComponents({ MobilePageNavigationBar });
        this.app.router.add('root', { path: '/', Component: Demo });
    }
}
const app = mockApp({
    plugins: [DemoPlugin],
    designable: true,
});
export default app.getRootComponent();
//# sourceMappingURL=pages-navigation-bar-title-false.js.map