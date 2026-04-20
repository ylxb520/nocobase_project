/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="react" />
import { PopoverProps as AntdPopoverProps } from 'antd';
import { FlowContext } from '../flowContext';
import { ViewNavigation } from './ViewNavigation';
export type FlowView = {
    type: 'drawer' | 'popover' | 'dialog' | 'embed';
    inputArgs: any;
    Header: React.FC<{
        title?: React.ReactNode;
        extra?: React.ReactNode;
    }> | null;
    Footer: React.FC<{
        children?: React.ReactNode;
    }> | null;
    close: (result?: any, force?: boolean) => void;
    update: (newConfig: any) => void;
    navigation?: ViewNavigation;
    /** 页面的销毁方法 */
    destroy?: () => void;
    /** 提交流配置表单里的值。仅流配置视图中可访问到该方法 */
    submit?: () => Promise<any>;
};
type TargetProps = {
    target?: HTMLElement | string | null;
};
type ViewType = 'drawer' | 'popover' | 'dialog' | 'embed';
type ViewProps = {
    content: React.ReactNode | ((view: FlowView) => React.ReactNode);
    width?: number | string;
    /**
     * 是否继承父类上下文
     * @default true
     */
    inheritContext?: boolean;
    /**
     * 阻止关闭 View
     */
    preventClose?: boolean;
    inputArgs?: any;
    onOpen?: (view: FlowView, context: FlowContext) => void;
    [key: string]: any;
};
type PopoverProps = AntdPopoverProps & {} & ViewProps & TargetProps;
export declare class FlowViewer {
    protected ctx: FlowContext;
    protected types: {
        drawer: any;
        popover: any;
        dialog: any;
        embed: any;
    };
    zIndex: any;
    constructor(ctx: FlowContext, types: {
        drawer: any;
        popover: any;
        dialog: any;
        embed: any;
    });
    getNextZIndex(): any;
    open(props: ViewProps & {
        type: ViewType;
    } & TargetProps): any;
    dialog(props: ViewProps): any;
    drawer(props: ViewProps): any;
    popover(props: PopoverProps): any;
    embed(props: ViewProps & TargetProps): any;
}
export {};
