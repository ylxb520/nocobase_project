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
    fields: ({
        name: string;
        type: string;
        primaryKey: boolean;
        allowNull: boolean;
        interface?: undefined;
        uiSchema?: undefined;
        defaultValue?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        otherKey?: undefined;
        targetKey?: undefined;
        through?: undefined;
    } | {
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            title: string;
            type: string;
            'x-component': string;
            required: boolean;
        };
        primaryKey?: undefined;
        allowNull?: undefined;
        defaultValue?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        otherKey?: undefined;
        targetKey?: undefined;
        through?: undefined;
    } | {
        type: string;
        name: string;
        defaultValue: string;
        primaryKey?: undefined;
        allowNull?: undefined;
        interface?: undefined;
        uiSchema?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        otherKey?: undefined;
        targetKey?: undefined;
        through?: undefined;
    } | {
        type: string;
        name: string;
        target: string;
        foreignKey: string;
        otherKey: string;
        targetKey: string;
        through: string;
        primaryKey?: undefined;
        allowNull?: undefined;
        interface?: undefined;
        uiSchema?: undefined;
        defaultValue?: undefined;
    } | {
        type: string;
        name: string;
        primaryKey?: undefined;
        allowNull?: undefined;
        interface?: undefined;
        uiSchema?: undefined;
        defaultValue?: undefined;
        target?: undefined;
        foreignKey?: undefined;
        otherKey?: undefined;
        targetKey?: undefined;
        through?: undefined;
    })[];
};
export default _default;
