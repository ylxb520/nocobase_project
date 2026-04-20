import React from 'react';
import { MobileTabBar } from '@nocobase/plugin-mobile/client';
const Demo = () => {
    const [clicked, setClicked] = React.useState(false);
    return (React.createElement(React.Fragment, null,
        clicked && 'Clicked',
        React.createElement(MobileTabBar.Item, { title: "Test", icon: "AppstoreOutlined", onClick: () => setClicked(true) })));
};
export default Demo;
//# sourceMappingURL=MobileTabBar.Item-on-click.js.map