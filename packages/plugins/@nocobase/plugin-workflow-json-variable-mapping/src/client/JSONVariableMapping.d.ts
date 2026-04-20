/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Instruction, WorkflowVariableInput, Fieldset } from '@nocobase/plugin-workflow/client';
export default class extends Instruction {
    title: string;
    type: string;
    group: string;
    description: string;
    icon: React.JSX.Element;
    fieldset: {
        dataSource: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-decorator-props': {};
            'x-component': string;
            'x-component-props': {
                nullable: boolean;
                changeOnSelect: boolean;
            };
        };
        example: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-decorator-props': {
                layout: string;
            };
            'x-component': string;
            'x-component-props': {
                placeholder: string;
                autoSize: {
                    minRows: number;
                    maxRows: number;
                };
            };
        };
        parseArray: {
            type: string;
            description: string;
            'x-decorator': string;
            'x-component': string;
            'x-content': string;
            default: boolean;
        };
        parseActions: {
            type: string;
            description: string;
            'x-decorator': string;
            'x-component': string;
            properties: {
                parseJsonAction: {
                    type: string;
                    title: string;
                    'x-component': string;
                    'x-component-props': {
                        useAction: string;
                        size: string;
                    };
                };
                clearItems: {
                    type: string;
                    title: string;
                    'x-component': string;
                    'x-component-props': {
                        useAction: string;
                        size: string;
                        confirm: {
                            title: string;
                            content: string;
                        };
                    };
                    'x-reactions': {
                        dependencies: string[];
                        fulfill: {
                            state: {
                                disabled: string;
                            };
                        };
                    }[];
                };
            };
        };
        variables: {
            type: string;
            'x-decorator': string;
            'x-decorator-props': {
                layout: string;
            };
            'x-component': string;
            'x-component-props': {
                style: {
                    marginTop: number;
                };
            };
            default: any[];
            items: {
                type: string;
                properties: {
                    space: {
                        type: string;
                        'x-component': string;
                        properties: {
                            path: {
                                type: string;
                                'x-decorator': string;
                                'x-component': string;
                                'x-component-props': {
                                    placeholder: string;
                                };
                                'x-disabled': boolean;
                            };
                            alias: {
                                type: string;
                                'x-decorator': string;
                                'x-component': string;
                                'x-component-props': {
                                    placeholder: string;
                                };
                            };
                            remove: {
                                type: string;
                                'x-decorator': string;
                                'x-component': string;
                            };
                        };
                    };
                };
            };
        };
    };
    scope: {
        useParseJsonAction: () => {
            run(): Promise<void>;
        };
        useClearItemsAction: () => {
            run(): Promise<void>;
        };
    };
    components: {
        Space: React.ForwardRefExoticComponent<import("antd").SpaceProps & React.RefAttributes<HTMLDivElement>> & {
            Compact: React.FC<import("antd/es/space/Compact").SpaceCompactProps>;
        };
        WorkflowVariableInput: typeof WorkflowVariableInput;
        Fieldset: typeof Fieldset;
    };
    useVariables({ key, title, config }: {
        key: any;
        title: any;
        config: any;
    }, options: any): {
        value: any;
        label: any;
        children: any;
    };
}
