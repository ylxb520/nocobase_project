/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
declare const _default: {
    name: string;
    createdBy: boolean;
    updatedBy: boolean;
    template: string;
    fields: ({
        interface: string;
        type: string;
        name: string;
        deletable: boolean;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-read-pretty'?: undefined;
            'x-component-props'?: undefined;
        };
        field?: undefined;
        comment?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        defaultValue?: undefined;
    } | {
        interface: string;
        type: string;
        name: string;
        deletable: boolean;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-read-pretty': boolean;
            'x-component-props'?: undefined;
        };
        field?: undefined;
        comment?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        defaultValue?: undefined;
    } | {
        interface: string;
        type: string;
        name: string;
        deletable: boolean;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-read-pretty': boolean;
            'x-component-props': {
                stringMode: boolean;
                step: string;
            };
        };
        field?: undefined;
        comment?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        defaultValue?: undefined;
    } | {
        interface: string;
        type: string;
        name: string;
        field: string;
        deletable: boolean;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-read-pretty': boolean;
            'x-component-props'?: undefined;
        };
        comment?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        defaultValue?: undefined;
    } | {
        comment: string;
        type: string;
        name: string;
        target: string;
        foreignKey: string;
        deletable: boolean;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-read-pretty': boolean;
            'x-component-props'?: undefined;
        };
        interface?: undefined;
        field?: undefined;
        defaultValue?: undefined;
    } | {
        type: string;
        name: string;
        deletable: boolean;
        defaultValue: {};
        interface?: undefined;
        uiSchema?: undefined;
        field?: undefined;
        comment?: undefined;
        target?: undefined;
        foreignKey?: undefined;
    } | {
        type: string;
        name: string;
        interface?: undefined;
        deletable?: undefined;
        uiSchema?: undefined;
        field?: undefined;
        comment?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        defaultValue?: undefined;
    })[];
};
export default _default;
