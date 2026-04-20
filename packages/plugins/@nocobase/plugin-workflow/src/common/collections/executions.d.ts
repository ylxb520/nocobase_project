/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
declare const _default: {
    dumpRules: {
        group: string;
    };
    migrationRules: string[];
    name: string;
    shared: boolean;
    fields: ({
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-component-props': {
                fieldNames?: undefined;
            };
            'x-read-pretty': boolean;
            'x-decorator'?: undefined;
            enum?: undefined;
        };
        primaryKey: boolean;
        allowNull: boolean;
        target?: undefined;
        foreignKey?: undefined;
        unique?: undefined;
        onDelete?: undefined;
        defaultValue?: undefined;
    } | {
        type: string;
        name: string;
        target: string;
        foreignKey: string;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-component-props': {
                fieldNames: {
                    label: string;
                    value: string;
                };
            };
            'x-read-pretty': boolean;
            'x-decorator'?: undefined;
            enum?: undefined;
        };
        primaryKey?: undefined;
        allowNull?: undefined;
        unique?: undefined;
        onDelete?: undefined;
        defaultValue?: undefined;
    } | {
        type: string;
        name: string;
        interface?: undefined;
        uiSchema?: undefined;
        primaryKey?: undefined;
        allowNull?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        unique?: undefined;
        onDelete?: undefined;
        defaultValue?: undefined;
    } | {
        type: string;
        name: string;
        unique: boolean;
        interface?: undefined;
        uiSchema?: undefined;
        primaryKey?: undefined;
        allowNull?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        onDelete?: undefined;
        defaultValue?: undefined;
    } | {
        type: string;
        name: string;
        onDelete: string;
        interface?: undefined;
        uiSchema?: undefined;
        primaryKey?: undefined;
        allowNull?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        unique?: undefined;
        defaultValue?: undefined;
    } | {
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            title: string;
            type: string;
            'x-component': string;
            'x-decorator': string;
            enum: string;
            'x-component-props'?: undefined;
            'x-read-pretty'?: undefined;
        };
        primaryKey?: undefined;
        allowNull?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        unique?: undefined;
        onDelete?: undefined;
        defaultValue?: undefined;
    } | {
        type: string;
        name: string;
        defaultValue: boolean;
        interface?: undefined;
        uiSchema?: undefined;
        primaryKey?: undefined;
        allowNull?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        unique?: undefined;
        onDelete?: undefined;
    } | {
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-component-props': {
                fieldNames?: undefined;
            };
            'x-read-pretty': boolean;
            'x-decorator'?: undefined;
            enum?: undefined;
        };
        primaryKey?: undefined;
        allowNull?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        unique?: undefined;
        onDelete?: undefined;
        defaultValue?: undefined;
    })[];
    indexes: {
        fields: string[];
    }[];
};
export default _default;
