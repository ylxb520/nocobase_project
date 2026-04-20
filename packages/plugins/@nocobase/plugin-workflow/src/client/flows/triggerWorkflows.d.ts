/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="react" />
type SchemaOptions = {
    WorkflowSelectComponent?: React.ComponentType<any>;
    optionFilter?: (option: {
        key: string;
        type: string;
        config: any;
    }) => boolean;
    usingContext?: boolean;
    filter?: Record<string, any>;
};
export declare function createTriggerWorkflowsSchema({ WorkflowSelectComponent, optionFilter, usingContext, filter, }?: SchemaOptions): (ctx: any) => {
    group: {
        type: string;
        'x-decorator': string;
        'x-component': string;
        items: {
            type: string;
            properties: {
                sort: {
                    type: string;
                    'x-component': string;
                    'x-component-props': {
                        width: number;
                        title: string;
                        align: string;
                    };
                    properties: {
                        sort: {
                            type: string;
                            'x-component': string;
                        };
                    };
                };
                workflowKey: {
                    type: string;
                    'x-component': string;
                    'x-component-props': {
                        title: string;
                    };
                    properties: {
                        workflowKey: {
                            type: string;
                            'x-decorator': string;
                            'x-component': import("react").ComponentType<any>;
                            'x-component-props': {
                                scope: string;
                                placeholder: string;
                                optionFilter: (option: {
                                    key: string;
                                    type: string;
                                    config: any;
                                }) => boolean;
                                collection?: string;
                                filter: Record<string, any>;
                            };
                            required: boolean;
                        };
                    };
                };
                operations: {
                    type: string;
                    'x-component': string;
                    'x-component-props': {
                        width: number;
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
                title: string;
                'x-component': string;
            };
        };
    };
};
export {};
