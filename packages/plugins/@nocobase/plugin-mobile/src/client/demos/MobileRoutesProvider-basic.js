import { Plugin } from '@nocobase/client';
import { mockApp } from '@nocobase/client/demo-utils';
import { MobileRoutesProvider, MobileTitleProvider, useMobileRoutes, useMobileTitle, } from '@nocobase/plugin-mobile/client';
import React from 'react';
const InnerPage = () => {
    const { routeList } = useMobileRoutes();
    const { title } = useMobileTitle();
    return (React.createElement("div", null,
        React.createElement("h1", null, title),
        React.createElement("div", null, routeList.length)));
};
const Demo = () => {
    return (React.createElement(MobileTitleProvider, null,
        React.createElement(MobileRoutesProvider, null,
            React.createElement(InnerPage, null))));
};
class DemoPlugin extends Plugin {
    async load() {
        this.app.router.add('root', { path: '/page' });
        this.app.router.add('root.test', { path: '/page/test', Component: Demo });
    }
}
const app = mockApp({
    router: {
        type: 'memory',
        initialEntries: ['/page/test'],
    },
    plugins: [DemoPlugin],
    apis: {
        'mobileRoutes:listAccessible': {
            data: [
                {
                    id: 10,
                    createdAt: '2024-07-08T13:22:33.763Z',
                    updatedAt: '2024-07-08T13:22:33.763Z',
                    parentId: null,
                    title: 'Test1',
                    icon: 'AppstoreOutlined',
                    schemaUid: 'test',
                    type: 'page',
                    options: null,
                    sort: 1,
                    createdById: 1,
                    updatedById: 1,
                },
                {
                    id: 13,
                    createdAt: '2024-07-08T13:23:01.929Z',
                    updatedAt: '2024-07-08T13:23:12.433Z',
                    parentId: null,
                    title: 'Test2',
                    icon: 'aliwangwangoutlined',
                    schemaUid: null,
                    type: 'link',
                    options: {
                        schemaUid: null,
                        url: 'https://github.com',
                        params: [{}],
                    },
                },
            ],
        },
    },
});
export default app.getRootComponent();
//# sourceMappingURL=MobileRoutesProvider-basic.js.map