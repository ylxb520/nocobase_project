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
import { RadioWithTooltip } from '../components/RadioWithTooltip';
import { useWorkflowVariableOptions, WorkflowVariableTextArea } from '../variable';
declare function NodeComponent({ data }: {
    data: any;
}): React.JSX.Element;
export default class extends Instruction {
    title: string;
    type: string;
    group: string;
    description: string;
    icon: React.JSX.Element;
    fieldset: {
        continueOnNoMatch: {
            type: string;
            title: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                options: {
                    label: string;
                    value: boolean;
                }[];
            };
            default: boolean;
        };
    };
    branching: {
        label: string;
        value: number;
    }[];
    scope: {
        renderEngineReference: (key: string) => React.JSX.Element;
        useWorkflowVariableOptions: typeof useWorkflowVariableOptions;
    };
    components: {
        WorkflowVariableTextArea: typeof WorkflowVariableTextArea;
        RadioWithTooltip: typeof RadioWithTooltip;
    };
    Component: typeof NodeComponent;
    createDefaultConfig(): {
        conditions: {
            uid: string;
        }[];
        continueOnNoMatch: boolean;
    };
}
export {};
