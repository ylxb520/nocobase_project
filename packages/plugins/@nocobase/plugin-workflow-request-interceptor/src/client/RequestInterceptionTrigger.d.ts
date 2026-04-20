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
import { SchemaInitializerItemType, useCollectionDataSource } from '@nocobase/client';
import { Trigger, RadioWithTooltip, CheckboxGroupWithTooltip, TriggerCollectionRecordSelect, WorkflowVariableWrapper } from '@nocobase/plugin-workflow/client';
import React from 'react';
import { SubModelItem } from '@nocobase/flow-engine';
declare function useVariables(config: any, options: any): (import("@nocobase/plugin-workflow/client").VariableOption | {
    label: string;
    value: string;
    children: ({
        label: string;
        value: string;
        children?: undefined;
    } | {
        label: string;
        value: string;
        children: import("@nocobase/plugin-workflow/client").VariableOption[];
    })[];
})[];
export default class extends Trigger {
    sync: boolean;
    title: string;
    description: string;
    fieldset: {
        collection: {
            type: string;
            title: string;
            required: boolean;
            'x-decorator': string;
            'x-component': string;
            "x-reactions": {
                target: string;
                effects: string[];
                fulfill: {
                    state: {
                        value: any[];
                    };
                };
            }[];
        };
        global: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                direction: string;
                options: {
                    label: string;
                    value: boolean;
                }[];
            };
            default: boolean;
        };
        actions: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                direction: string;
                options: {
                    label: string;
                    value: string;
                }[];
            };
            required: boolean;
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
        action: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                allowClear: boolean;
            };
            enum: {
                label: string;
                value: string;
            }[];
            default: string;
            required: boolean;
        };
        target: {
            type: string;
            title: string;
            description: string;
            'x-decorator': string;
            'x-component': string;
            default: any;
            required: boolean;
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
        useCollectionDataSource: typeof useCollectionDataSource;
        useValueObject(): boolean;
    };
    components: {
        FieldsSelect: React.MemoExoticComponent<import("@formily/react").ReactFC<Omit<any, "ref">>>;
        RadioWithTooltip: typeof RadioWithTooltip;
        CheckboxGroupWithTooltip: typeof CheckboxGroupWithTooltip;
        WorkflowVariableWrapper: typeof WorkflowVariableWrapper;
        TriggerCollectionRecordSelect: typeof TriggerCollectionRecordSelect;
    };
    isActionTriggerable_deprecated: (config: any, context: any) => boolean;
    actionTriggerableScope: (config: any, scope: any) => boolean;
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
