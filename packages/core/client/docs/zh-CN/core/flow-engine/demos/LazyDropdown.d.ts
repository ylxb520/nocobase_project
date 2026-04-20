import { DropdownProps } from 'antd';
import React from 'react';
export type Item = {
    key?: string;
    type?: 'group' | 'divider';
    label?: React.ReactNode;
    children?: Item[] | (() => Item[] | Promise<Item[]>);
    [key: string]: any;
};
export type ItemsType = Item[] | (() => Item[] | Promise<Item[]>);
interface LazyDropdownMenuProps extends Omit<DropdownProps['menu'], 'items'> {
    items: ItemsType;
}
declare const LazyDropdown: React.FC<Omit<DropdownProps, 'menu'> & {
    menu: LazyDropdownMenuProps;
}>;
export default LazyDropdown;
