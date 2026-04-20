/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils/client';
import React from 'react';
import { useWorkflowVariableOptions } from '../variable';
interface Calculator {
    name: string;
    type: 'boolean' | 'number' | 'string' | 'date' | 'unknown' | 'null' | 'array';
    group: string;
}
export declare const calculators: Registry<Calculator>;
export declare function CalculationConfig({ value, onChange, useVariableHook }: {
    value: any;
    onChange: any;
    useVariableHook?: typeof useWorkflowVariableOptions;
}): React.JSX.Element;
export {};
