/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { SchemaInitializerItemType } from '@nocobase/client';
export declare const submitToWorkflowActionInitializer: SchemaInitializerItemType;
export declare const recordTriggerWorkflowActionInitializer: SchemaInitializerItemType;
export declare const recordTriggerWorkflowActionLinkInitializer: {
    schema: any;
    name: string;
    Component?: string | React.ComponentType<any>;
    sort?: number;
    componentProps?: Omit<any, "children">;
    useComponentProps?: () => Omit<any, "children">;
    useVisible?: () => boolean;
    children?: SchemaInitializerItemType<any>[];
    hideIfNoChildren?: boolean;
    useChildren?: () => SchemaInitializerItemType<any>[];
};
export declare const globalTriggerWorkflowActionInitializer: {
    name: string;
    title: string;
    Component: string;
    schema: {
        title: string;
        'x-component': string;
        'x-use-component-props': string;
        'x-settings': string;
        'x-decorator': string;
        'x-action-settings': {
            onSuccess: {
                manualClose: boolean;
                redirecting: boolean;
                successMessage: string;
            };
            refreshDataBlockRequest: boolean;
            triggerWorkflows: any[];
        };
        'x-toolbar-props': {
            initializer: boolean;
            showBorder: boolean;
        };
        'x-action': string;
    };
};
export declare function DataBlockTriggerWorkflowActionSchemaInitializerItem(props: any): React.JSX.Element;
export declare function WorkbenchTriggerWorkflowActionSchemaInitializerItem(props: any): React.JSX.Element;
