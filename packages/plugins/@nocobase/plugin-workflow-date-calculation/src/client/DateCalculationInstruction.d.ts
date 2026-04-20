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
import { Instruction, RadioWithTooltip, WorkflowVariableInput } from '@nocobase/plugin-workflow/client';
import { SubModelItem } from '@nocobase/flow-engine';
export default class extends Instruction {
    title: string;
    type: string;
    group: string;
    description: string;
    icon: React.JSX.Element;
    fieldset: {
        input: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                changeOnSelect: boolean;
                useTypedConstant: string[];
                parseOptions: {
                    stringToDate: boolean;
                };
            };
            required: boolean;
            default: string;
        };
        inputType: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                options: {
                    label: React.JSX.Element;
                    value: string;
                    tooltip: string;
                }[];
            };
            default: string;
            'x-reactions': {
                target: string;
                effects: string[];
                fulfill: {
                    state: {
                        value: any[];
                    };
                };
            }[];
        };
        steps: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            items: {
                type: string;
                'x-decorator': string;
                'x-component': string;
                'x-component-props': {
                    className: string;
                };
                properties: {
                    meta: {
                        type: string;
                        'x-component': string;
                        'x-component-props': {
                            className: string;
                        };
                        properties: {
                            function: {
                                type: string;
                                'x-component': string;
                            };
                            remove: {
                                type: string;
                                'x-decorator': string;
                                'x-component': string;
                                'x-component-props': {
                                    size: string;
                                    style: {
                                        position: string;
                                        right: string;
                                        top: string;
                                        padding: number;
                                        display: string;
                                        alignItems: string;
                                        justifyContent: string;
                                    };
                                };
                            };
                        };
                    };
                    arguments: {
                        type: string;
                        'x-component': string;
                    };
                };
            };
            properties: {
                add: {
                    type: string;
                    'x-component': string;
                };
            };
        };
    };
    components: {
        WorkflowVariableInput: typeof WorkflowVariableInput;
        RadioWithTooltip: typeof RadioWithTooltip;
        ArrayItems: import("@formily/react").ReactFC<React.HTMLAttributes<HTMLDivElement>> & import("@formily/antd-v5").ArrayBaseMixins & {
            Item: import("@formily/react").ReactFC<React.HTMLAttributes<HTMLDivElement> & {
                type?: "divide" | "card";
            }>;
        };
        Calculation: {
            Step({ children }: {
                children: any;
            }): React.JSX.Element;
            Title({ value }: {
                value: any;
            }): React.JSX.Element;
            Arguments(): React.JSX.Element;
            Addition(): React.JSX.Element;
            Removable({ children }: {
                children: any;
            }): any;
        };
        Space: React.ForwardRefExoticComponent<import("antd").SpaceProps & React.RefAttributes<HTMLDivElement>> & {
            Compact: React.FC<import("antd/es/space/Compact").SpaceCompactProps>;
        };
    };
    useVariables({ key, title }: {
        key: any;
        title: any;
    }, { types, fieldNames }: {
        types: any;
        fieldNames?: {
            readonly label: "label";
            readonly value: "value";
            readonly children: "children";
        };
    }): {
        value: any;
        label: any;
    };
    useInitializers(node: any): SchemaInitializerItemType;
    /**
     * 2.0
     */
    getCreateModelMenuItem({ node }: {
        node: any;
    }): SubModelItem;
    testable: boolean;
}
