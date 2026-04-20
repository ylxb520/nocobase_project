/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const table_m2m: {
    logging: boolean;
    autoGenId: boolean;
    createdBy: boolean;
    updatedBy: boolean;
    createdAt: boolean;
    updatedAt: boolean;
    sortable: boolean;
    name: string;
    template: string;
    fields: ({
        name: string;
        type: string;
        autoIncrement: boolean;
        primaryKey: boolean;
        allowNull: boolean;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-read-pretty': boolean;
            'x-component-props'?: undefined;
        };
        interface: string;
        target?: undefined;
        foreignKey?: undefined;
    } | {
        name: string;
        interface: string;
        type: string;
        target: string;
        foreignKey: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-component-props': {
                fieldNames: {
                    value: string;
                    label: string;
                };
            };
            'x-read-pretty': boolean;
        };
        autoIncrement?: undefined;
        primaryKey?: undefined;
        allowNull?: undefined;
    })[];
    title: string;
};
