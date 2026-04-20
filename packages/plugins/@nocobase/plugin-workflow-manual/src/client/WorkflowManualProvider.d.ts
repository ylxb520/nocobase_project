/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FC } from 'react';
export declare const todoCollection: {
    title: string;
    name: string;
    fields: ({
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-component-props'?: undefined;
            enum?: undefined;
        };
        target?: undefined;
        foreignKey?: undefined;
        isAssociation?: undefined;
    } | {
        type: string;
        name: string;
        target: string;
        foreignKey: string;
        interface: string;
        isAssociation: boolean;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-component-props': {
                fieldNames: {
                    label: string;
                    value: string;
                };
                showTime?: undefined;
            };
            enum?: undefined;
        };
    } | {
        type: string;
        name: string;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            enum: {
                value: number;
                label: string;
                color: string;
            }[];
            'x-component-props'?: undefined;
        };
        target?: undefined;
        foreignKey?: undefined;
        isAssociation?: undefined;
    } | {
        name: string;
        type: string;
        interface: string;
        uiSchema: {
            type: string;
            title: string;
            'x-component': string;
            'x-component-props': {
                showTime: boolean;
                fieldNames?: undefined;
            };
            enum?: undefined;
        };
        target?: undefined;
        foreignKey?: undefined;
        isAssociation?: undefined;
    })[];
};
/**
 * 1. 扩展几个工作流相关的 collection，防止在区块中因找不到 collection 而报错；
 * @param props
 * @returns
 */
export declare const WorkflowManualProvider: FC;
