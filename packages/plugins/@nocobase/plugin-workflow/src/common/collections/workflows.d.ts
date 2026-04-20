/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
declare const _default: {
    dumpRules: string;
    migrationRules: string[];
    name: string;
    shared: boolean;
    repository: string;
    fields: ({
        name: string;
        type: string;
        primaryKey: boolean;
        allowNull: boolean;
        interface?: undefined;
        uiSchema?: undefined;
        defaultValue?: undefined;
        required?: undefined;
        target?: undefined;
        onDelete?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        name: string;
        type: string;
        primaryKey?: undefined;
        allowNull?: undefined;
        interface?: undefined;
        uiSchema?: undefined;
        defaultValue?: undefined;
        required?: undefined;
        target?: undefined;
        onDelete?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            title: string;
            type: string;
            'x-component': string;
            required: boolean;
            enum?: undefined;
            default?: undefined;
            'x-component-props'?: undefined;
            'x-read-pretty'?: undefined;
        };
        primaryKey?: undefined;
        allowNull?: undefined;
        defaultValue?: undefined;
        required?: undefined;
        target?: undefined;
        onDelete?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        defaultValue: boolean;
        interface: string;
        uiSchema: {
            title: string;
            type: string;
            enum: ({
                label: string;
                value: boolean;
                color: string;
            } | {
                label: string;
                value: boolean;
                color?: undefined;
            })[];
            'x-component': string;
            default: boolean;
            required?: undefined;
            'x-component-props'?: undefined;
            'x-read-pretty'?: undefined;
        };
        primaryKey?: undefined;
        allowNull?: undefined;
        required?: undefined;
        target?: undefined;
        onDelete?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            title: string;
            type: string;
            'x-component': string;
            required?: undefined;
            enum?: undefined;
            default?: undefined;
            'x-component-props'?: undefined;
            'x-read-pretty'?: undefined;
        };
        primaryKey?: undefined;
        allowNull?: undefined;
        defaultValue?: undefined;
        required?: undefined;
        target?: undefined;
        onDelete?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        required: boolean;
        interface: string;
        uiSchema: {
            title: string;
            type: string;
            'x-component': string;
            enum: string;
            required: boolean;
            default?: undefined;
            'x-component-props'?: undefined;
            'x-read-pretty'?: undefined;
        };
        primaryKey?: undefined;
        allowNull?: undefined;
        defaultValue?: undefined;
        target?: undefined;
        onDelete?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        required: boolean;
        defaultValue: {};
        primaryKey?: undefined;
        allowNull?: undefined;
        interface?: undefined;
        uiSchema?: undefined;
        target?: undefined;
        onDelete?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        target: string;
        onDelete: string;
        primaryKey?: undefined;
        allowNull?: undefined;
        interface?: undefined;
        uiSchema?: undefined;
        defaultValue?: undefined;
        required?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        defaultValue: number;
        primaryKey?: undefined;
        allowNull?: undefined;
        interface?: undefined;
        uiSchema?: undefined;
        required?: undefined;
        target?: undefined;
        onDelete?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        defaultValue: boolean;
        interface: string;
        uiSchema: {
            title: string;
            type: string;
            'x-component': string;
            enum: {
                label: string;
                value: boolean;
                color: string;
            }[];
            required: boolean;
            default?: undefined;
            'x-component-props'?: undefined;
            'x-read-pretty'?: undefined;
        };
        primaryKey?: undefined;
        allowNull?: undefined;
        required?: undefined;
        target?: undefined;
        onDelete?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        target: string;
        foreignKey: string;
        sourceKey: string;
        constraints: boolean;
        onDelete: string;
        primaryKey?: undefined;
        allowNull?: undefined;
        interface?: undefined;
        uiSchema?: undefined;
        defaultValue?: undefined;
        required?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        defaultValue: {};
        primaryKey?: undefined;
        allowNull?: undefined;
        interface?: undefined;
        uiSchema?: undefined;
        required?: undefined;
        target?: undefined;
        onDelete?: undefined;
        foreignKey?: undefined;
        sourceKey?: undefined;
        constraints?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        target: string;
        foreignKey: string;
        sourceKey: string;
        constraints: boolean;
        primaryKey?: undefined;
        allowNull?: undefined;
        interface?: undefined;
        uiSchema?: undefined;
        defaultValue?: undefined;
        required?: undefined;
        onDelete?: undefined;
        through?: undefined;
        otherKey?: undefined;
    } | {
        type: string;
        name: string;
        target: string;
        through: string;
        foreignKey: string;
        otherKey: string;
        sourceKey: string;
        constraints: boolean;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-component-props': {
                multiple: boolean;
                fieldNames: {
                    label: string;
                    value: string;
                    color: string;
                };
                mode: string;
            };
            'x-read-pretty': boolean;
            required?: undefined;
            enum?: undefined;
            default?: undefined;
        };
        primaryKey?: undefined;
        allowNull?: undefined;
        defaultValue?: undefined;
        required?: undefined;
        onDelete?: undefined;
    })[];
    indexes: {
        unique: boolean;
        fields: string[];
    }[];
};
export default _default;
