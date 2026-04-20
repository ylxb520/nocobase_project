import { Drawer } from 'antd';
import React from 'react';
interface DrawerComponentProps extends React.ComponentProps<typeof Drawer> {
    afterClose?: () => void;
    content?: React.ReactNode;
}
declare const DrawerComponent: React.ForwardRefExoticComponent<DrawerComponentProps & React.RefAttributes<unknown>>;
export default DrawerComponent;
