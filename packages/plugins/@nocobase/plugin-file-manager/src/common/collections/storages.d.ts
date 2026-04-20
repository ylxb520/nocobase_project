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
        title?: undefined;
        comment?: undefined;
        translation?: undefined;
        trim?: undefined;
        unique?: undefined;
        defaultValue?: undefined;
    } | {
        title: string;
        comment: string;
        type: string;
        name: string;
        translation: boolean;
        trim: boolean;
        primaryKey?: undefined;
        allowNull?: undefined;
        unique?: undefined;
        defaultValue?: undefined;
    } | {
        title: string;
        type: string;
        name: string;
        unique: boolean;
        trim: boolean;
        primaryKey?: undefined;
        allowNull?: undefined;
        comment?: undefined;
        translation?: undefined;
        defaultValue?: undefined;
    } | {
        comment: string;
        type: string;
        name: string;
        primaryKey?: undefined;
        allowNull?: undefined;
        title?: undefined;
        translation?: undefined;
        trim?: undefined;
        unique?: undefined;
        defaultValue?: undefined;
    } | {
        comment: string;
        type: string;
        name: string;
        defaultValue: {};
        primaryKey?: undefined;
        allowNull?: undefined;
        title?: undefined;
        translation?: undefined;
        trim?: undefined;
        unique?: undefined;
    } | {
        comment: string;
        type: string;
        name: string;
        defaultValue: string;
        trim: boolean;
        primaryKey?: undefined;
        allowNull?: undefined;
        title?: undefined;
        translation?: undefined;
        unique?: undefined;
    } | {
        comment: string;
        type: string;
        name: string;
        defaultValue: string;
        primaryKey?: undefined;
        allowNull?: undefined;
        title?: undefined;
        translation?: undefined;
        trim?: undefined;
        unique?: undefined;
    } | {
        comment: string;
        type: string;
        name: string;
        defaultValue: boolean;
        primaryKey?: undefined;
        allowNull?: undefined;
        title?: undefined;
        translation?: undefined;
        trim?: undefined;
        unique?: undefined;
    } | {
        type: string;
        name: string;
        defaultValue: boolean;
        primaryKey?: undefined;
        allowNull?: undefined;
        title?: undefined;
        comment?: undefined;
        translation?: undefined;
        trim?: undefined;
        unique?: undefined;
    } | {
        type: string;
        name: string;
        defaultValue: {};
        primaryKey?: undefined;
        allowNull?: undefined;
        title?: undefined;
        comment?: undefined;
        translation?: undefined;
        trim?: undefined;
        unique?: undefined;
    })[];
};
export default _default;
