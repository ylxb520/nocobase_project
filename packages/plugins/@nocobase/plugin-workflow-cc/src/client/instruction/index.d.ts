/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import React from 'react';
import { Instruction, WorkflowVariableTextArea, UsersAddition, UsersSelect, useNodeContext } from '@nocobase/plugin-workflow/client';
import { SchemaConfig, SchemaConfigButton, CCInterfaceConfig, CCTaskCardConfigButton } from './SchemaConfig';
export default class extends Instruction {
    title: string;
    type: string;
    group: string;
    description: string;
    icon: React.JSX.Element;
    fieldset: {
        users: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                className: string;
            };
            items: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    className: string;
                };
                properties: {
                    sort: {
                        type: string;
                        'x-decorator': string;
                        'x-component': string;
                    };
                    input: {
                        type: string;
                        'x-decorator': string;
                        'x-component': string;
                    };
                    remove: {
                        type: string;
                        'x-decorator': string;
                        'x-component': string;
                    };
                };
            };
            required: boolean;
            properties: {
                add: {
                    type: string;
                    'x-component': string;
                };
            };
        };
        ccDetail: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-reactions': {
                fulfill: {
                    state: {
                        visible: string;
                    };
                };
            }[];
            properties: {
                ccDetail: {
                    type: string;
                    'x-component': string;
                };
            };
            required: boolean;
        };
        ccUid: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-reactions': {
                fulfill: {
                    state: {
                        visible: string;
                    };
                };
            }[];
        };
        taskCardUid: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
        };
        title: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            description: string;
            default: string;
        };
        notifications: {
            type: string;
            'x-component': string;
        };
    };
    createDefaultConfig(): {};
    scope: {
        useNodeContext: typeof useNodeContext;
    };
    components: {
        ArrayItems: import("@formily/reactive-react").ReactFC<React.HTMLAttributes<HTMLDivElement>> & import("@formily/antd-v5").ArrayBaseMixins & {
            Item: import("@formily/reactive-react").ReactFC<React.HTMLAttributes<HTMLDivElement> & {
                type?: "divide" | "card";
            }>;
        };
        UsersSelect: typeof UsersSelect;
        UsersAddition: typeof UsersAddition;
        SchemaConfigButton: typeof SchemaConfigButton;
        SchemaConfig: typeof SchemaConfig;
        CCInterfaceConfig: typeof CCInterfaceConfig;
        CCTaskCardConfigButton: typeof CCTaskCardConfigButton;
        WorkflowVariableTextArea: typeof WorkflowVariableTextArea;
    };
}
