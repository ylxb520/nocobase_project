/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const typeInterfaceMap: {
    array: () => {
        interface: string;
        uiSchema: {
            'x-component': string;
            'x-component-props': {
                autoSize: {
                    minRows: number;
                };
            };
            default: any;
        };
    };
    json: () => {
        interface: string;
        uiSchema: {
            'x-component': string;
            'x-component-props': {
                autoSize: {
                    minRows: number;
                };
            };
            default: any;
        };
    };
    jsonb: () => {
        interface: string;
        uiSchema: {
            'x-component': string;
            'x-component-props': {
                autoSize: {
                    minRows: number;
                };
            };
            default: any;
        };
    };
    date: () => {
        interface: string;
        uiSchema: {
            'x-component': string;
            'x-component-props': {
                dateFormat: string;
                showTime: boolean;
            };
        };
    };
    datetime: () => {
        interface: string;
        uiSchema: {
            'x-component': string;
            'x-component-props': {
                dateFormat: string;
                showTime: boolean;
            };
        };
    };
    datetimeTz: () => {
        interface: string;
        uiSchema: {
            'x-component': string;
            'x-component-props': {
                dateFormat: string;
                showTime: boolean;
            };
        };
    };
    datetimeNoTz: () => {
        interface: string;
        uiSchema: {
            type: string;
            'x-component': string;
            'x-component-props': {
                showTime: boolean;
                utc: boolean;
            };
        };
    };
    dateOnly: () => {
        interface: string;
        uiSchema: {
            type: string;
            'x-component': string;
            'x-component-props': {
                dateOnly: boolean;
            };
        };
    };
    time: () => {
        interface: string;
        uiSchema: {
            type: string;
            'x-component': string;
            'x-component-props': {
                format: string;
            };
        };
    };
    integer: () => {
        interface: string;
        uiSchema: {
            type: string;
            'x-component': string;
            'x-component-props': {
                stringMode: boolean;
                step: string;
            };
            'x-validator': string;
        };
    };
    bigInt: () => {
        interface: string;
        uiSchema: {
            'x-component': string;
            'x-component-props': {
                style: {
                    width: string;
                };
            };
        };
    };
    float: () => {
        interface: string;
        uiSchema: {
            type: string;
            'x-component': string;
            'x-component-props': {
                stringMode: boolean;
                step: string;
            };
        };
    };
    double: () => {
        interface: string;
        uiSchema: {
            type: string;
            'x-component': string;
            'x-component-props': {
                stringMode: boolean;
                step: string;
            };
        };
    };
    real: () => {
        interface: string;
        uiSchema: {
            type: string;
            'x-component': string;
            'x-component-props': {
                stringMode: boolean;
                step: string;
            };
        };
    };
    decimal: () => {
        interface: string;
        uiSchema: {
            type: string;
            'x-component': string;
            'x-component-props': {
                stringMode: boolean;
                step: string;
            };
        };
    };
    string: () => {
        interface: string;
        uiSchema: {
            'x-component': string;
            'x-component-props': {
                style: {
                    width: string;
                };
            };
        };
    };
    text: () => {
        interface: string;
        uiSchema: {
            type: string;
            'x-component': string;
        };
    };
    password: () => {
        interface: string;
        hidden: boolean;
        uiSchema: {
            type: string;
            'x-component': string;
        };
    };
    uid: () => {
        interface: string;
        uiSchema: {
            'x-component': string;
            'x-component-props': {
                style: {
                    width: string;
                };
            };
        };
    };
    uuid: () => {
        interface: string;
        uiSchema: {
            'x-component': string;
            'x-component-props': {
                style: {
                    width: string;
                };
            };
        };
    };
    boolean: () => {
        interface: string;
        uiSchema: {
            type: string;
            'x-component': string;
        };
    };
    belongsTo: string;
    belongsToMany: string;
    hasMany: string;
    hasOne: string;
    context: string;
    virtual: string;
    radio: string;
    set: string;
    sort: string;
    point: string;
    polygon: string;
    lineString: string;
    circle: string;
};
