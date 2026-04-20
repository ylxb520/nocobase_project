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
import { SchemaInitializerItemType, useCollectionDataSource } from '@nocobase/client';
import { Trigger, TriggerCollectionRecordSelect, WorkflowVariableWrapper, RadioWithTooltip, useWorkflowAnyExecuted } from '@nocobase/plugin-workflow/client';
import { TriggerScopeProvider } from './components';
import { SubModelItem } from '@nocobase/flow-engine';
declare function useVariables(config: any, options: any): import("@nocobase/plugin-workflow/client").VariableOption[];
export default class extends Trigger {
    title: string;
    description: string;
    fieldset: {
        type: {
            type: string;
            title: string;
            description: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                options: {
                    label: string;
                    value: number;
                    tooltip: string;
                }[];
            };
            default: number;
            'x-disabled': string;
        };
        collection: {
            type: string;
            title: string;
            required: boolean;
            'x-decorator': string;
            'x-component': string;
            'x-disabled': string;
            "x-reactions": ({
                target: string;
                effects: string[];
                fulfill: {
                    state: {
                        value: any[];
                        visible?: undefined;
                    };
                };
                dependencies?: undefined;
            } | {
                dependencies: string[];
                fulfill: {
                    state: {
                        visible: string;
                        value?: undefined;
                    };
                };
                target?: undefined;
                effects?: undefined;
            })[];
        };
        appends: {
            type: string;
            title: string;
            description: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                multiple: boolean;
                useCollection(): any;
            };
            'x-reactions': {
                dependencies: string[];
                fulfill: {
                    state: {
                        visible: string;
                    };
                };
            }[];
        };
    };
    triggerFieldset: {
        data: {
            type: string;
            'x-component': string;
            'x-component-props': {
                types: number[];
            };
            properties: {
                data: {
                    type: string;
                    title: string;
                    description: string;
                    'x-decorator': string;
                    'x-component': string;
                    default: any;
                    required: boolean;
                };
            };
        };
        filterByTk: {
            type: string;
            'x-component': string;
            'x-component-props': {
                types: number[];
            };
            properties: {
                filterByTk: {
                    type: string;
                    title: string;
                    description: string;
                    'x-decorator': string;
                    'x-component': string;
                    'x-component-props': {
                        multiple: boolean;
                        objectValue: boolean;
                    };
                    default: any[];
                    required: boolean;
                };
            };
        };
        userId: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                nullable: boolean;
                changeOnSelect: boolean;
                variableOptions: {
                    types: ((field: any) => boolean)[];
                };
                render(props: any): React.JSX.Element;
            };
            default: any;
            required: boolean;
        };
        roleName: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                nullable: boolean;
                changeOnSelect: boolean;
                variableOptions: {
                    types: ((field: any) => boolean)[];
                };
                render(props: any): React.JSX.Element;
            };
            default: any;
        };
    };
    validate(values: any): any;
    scope: {
        useWorkflowAnyExecuted: typeof useWorkflowAnyExecuted;
        useCollectionDataSource: typeof useCollectionDataSource;
    };
    components: {
        TriggerScopeProvider: typeof TriggerScopeProvider;
        TriggerCollectionRecordSelect: typeof TriggerCollectionRecordSelect;
        WorkflowVariableWrapper: typeof WorkflowVariableWrapper;
        RadioWithTooltip: typeof RadioWithTooltip;
    };
    isActionTriggerable_deprecated: (config: any, context: any) => boolean;
    useVariables: typeof useVariables;
    useInitializers(config: any): SchemaInitializerItemType | null;
    /**
     * 2.0
     */
    getCreateModelMenuItem({ config }: {
        config: any;
    }): SubModelItem;
}
export {};
