/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Instruction } from '.';
import { WorkflowVariableInput } from '../variable';
export default class extends Instruction {
    title: string;
    type: string;
    group: string;
    description: string;
    icon: React.JSX.Element;
    fieldset: {
        value: {
            type: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                changeOnSelect: boolean;
                useTypedConstant: boolean;
                nullable: boolean;
                autoSize: {
                    minRows: number;
                };
                placeholder: string;
            };
            title: string;
        };
    };
    scope: {};
    components: {
        ArrayItems: import("@formily/reactive-react").ReactFC<React.HTMLAttributes<HTMLDivElement>> & import("@formily/antd-v5").ArrayBaseMixins & {
            Item: import("@formily/reactive-react").ReactFC<React.HTMLAttributes<HTMLDivElement> & {
                type?: "divide" | "card";
            }>;
        };
        WorkflowVariableInput: typeof WorkflowVariableInput;
    };
    useVariables({ key, title }: {
        key: any;
        title: any;
    }, { types }: {
        types: any;
    }): {
        value: any;
        label: any;
    };
}
