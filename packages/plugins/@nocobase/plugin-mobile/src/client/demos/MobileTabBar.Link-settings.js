import { Plugin, SchemaComponent } from '@nocobase/client';
import { mockApp } from '@nocobase/client/demo-utils';
import { MobileProviders, MobileTabBar, getMobileTabBarItemSchema, mobileTabBarLinkSettings, } from '@nocobase/plugin-mobile/client';
import React from 'react';
import { schemaViewer } from './fixtures/schemaViewer';
const schema = getMobileTabBarItemSchema({
    id: 1,
    type: 'link',
    title: 'Link',
    icon: 'AppstoreOutlined',
    options: {
        url: 'https://github.com',
    },
});
const Demo = () => {
    return (React.createElement("div", null,
        React.createElement(MobileProviders, null,
            React.createElement(SchemaComponent, { schema: schemaViewer(schema, 'x-component-props') }))));
};
class DemoPlugin extends Plugin {
    async load() {
        this.app.router.add('root', { path: '/', Component: Demo });
    }
}
const app = mockApp({
    router: {
        type: 'memory',
        initialEntries: ['/'],
    },
    components: {
        MobileTabBar,
    },
    plugins: [DemoPlugin],
    schemaSettings: [mobileTabBarLinkSettings],
    designable: true,
    apis: {
        'mobileRoutes:listAccessible': {
            data: [],
        },
        'mobileRoutes:update': {
            data: [],
        },
    },
});
export default app.getRootComponent();
//# sourceMappingURL=MobileTabBar.Link-settings.js.map