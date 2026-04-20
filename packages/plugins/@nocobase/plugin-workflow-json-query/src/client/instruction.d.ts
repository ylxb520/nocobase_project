/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Instruction, WorkflowVariableInput, WorkflowVariableTextArea } from '@nocobase/plugin-workflow/client';
declare function getEngineOptions(): any[];
declare function renderEngineReference(key: string): React.JSX.Element;
export default class extends Instruction {
    title: string;
    type: string;
    group: string;
    description: string;
    icon: React.JSX.Element;
    fieldset: {
        engine: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            enum: string;
            required: boolean;
            default: string;
        };
        source: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                changeOnSelect: boolean;
            };
            required: boolean;
        };
        expression: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            required: boolean;
            'x-reactions': {
                dependencies: string[];
                fulfill: {
                    state: {
                        visible: string;
                    };
                    schema: {
                        description: string;
                    };
                };
            };
        };
        model: {
            type: string;
            title: string;
            description: string;
            'x-decorator': string;
            'x-component': string;
            items: {
                type: string;
                properties: {
                    path: {
                        type: string;
                        'x-component': string;
                        'x-component-props': {
                            title: string;
                        };
                        properties: {
                            path: {
                                type: string;
                                name: string;
                                required: boolean;
                                'x-decorator': string;
                                'x-component': string;
                            };
                        };
                    };
                    alias: {
                        type: string;
                        'x-component': string;
                        'x-component-props': {
                            title: string;
                        };
                        properties: {
                            alias: {
                                type: string;
                                name: string;
                                'x-decorator': string;
                                'x-component': string;
                            };
                        };
                    };
                    label: {
                        type: string;
                        'x-component': string;
                        'x-component-props': {
                            title: string;
                        };
                        properties: {
                            label: {
                                type: string;
                                name: string;
                                required: boolean;
                                'x-decorator': string;
                                'x-component': string;
                            };
                        };
                    };
                    operations: {
                        type: string;
                        'x-component': string;
                        'x-component-props': {
                            dataIndex: string;
                            fixed: string;
                            className: string;
                        };
                        properties: {
                            remove: {
                                type: string;
                                'x-component': string;
                            };
                        };
                    };
                };
            };
            properties: {
                add: {
                    type: string;
                    'x-component': string;
                    'x-component-props': {
                        defaultValue: {};
                    };
                    title: string;
                };
            };
        };
    };
    scope: {
        renderEngineReference: typeof renderEngineReference;
        getEngineOptions: typeof getEngineOptions;
    };
    components: {
        ArrayTable: import("@formily/reactive-react").ReactFC<import("antd").TableProps<any>> & import("@formily/antd-v5").ArrayBaseMixins & {
            Column: import("@formily/reactive-react").ReactFC<import("antd").TableColumnProps<any>>;
            Addition: import("@formily/reactive-react").ReactFC<import("@formily/antd-v5").IArrayBaseAdditionProps>;
        };
        WorkflowVariableInput: typeof WorkflowVariableInput;
        WorkflowVariableTextArea: typeof WorkflowVariableTextArea;
    };
    useVariables({ key, title, config }: {
        key: any;
        title: any;
        config: any;
    }, { types, fieldNames }: {
        types: any;
        fieldNames?: import("@nocobase/client").FieldNames;
    }): {
        [x: string]: any;
        children: any;
    };
    testable: boolean;
}
export {};
