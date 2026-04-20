/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const flowModelTemplatesCollection: {
    name: string;
    filterTargetKey: string;
    fields: ({
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            required: boolean;
            'x-component': string;
            'x-component-props'?: undefined;
            'x-disabled'?: undefined;
            'x-hidden'?: undefined;
        };
    } | {
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-component-props': {
                rows: number;
            };
            required?: undefined;
            'x-disabled'?: undefined;
            'x-hidden'?: undefined;
        };
    } | {
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-disabled': boolean;
            required?: undefined;
            'x-component-props'?: undefined;
            'x-hidden'?: undefined;
        };
    } | {
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-disabled': boolean;
            'x-hidden': boolean;
            required?: undefined;
            'x-component-props'?: undefined;
        };
    })[];
};
