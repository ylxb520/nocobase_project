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
import { Instruction, WorkflowVariableInput } from '@nocobase/plugin-workflow/client';
import { useCollectionDataSource } from '@nocobase/client';
declare function VariableTargetSelect({ value, onChange }: {
    value: any;
    onChange: any;
}): React.JSX.Element;
export default class extends Instruction {
    title: string;
    type: string;
    group: string;
    description: string;
    icon: React.JSX.Element;
    fieldset: {
        target: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
        };
        value: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                useTypedConstant: boolean;
                changeOnSelect: boolean;
            };
            default: string;
        };
    };
    scope: {
        useCollectionDataSource: typeof useCollectionDataSource;
    };
    components: {
        WorkflowVariableInput: typeof WorkflowVariableInput;
        VariableTargetSelect: typeof VariableTargetSelect;
    };
    useVariables({ key, title, config }: {
        key: any;
        title: any;
        config: any;
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
}
export {};
