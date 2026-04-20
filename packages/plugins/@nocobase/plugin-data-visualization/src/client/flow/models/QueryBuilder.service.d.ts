/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare function getFieldOptions(dm: any, compile: (v: any) => string, collectionPath?: string[]): any;
export declare function aliasOf(val: any): string;
export declare function buildOrderFieldOptions(fieldOptions?: any[], dimensionsValue?: any[], measuresValue?: any[]): any[];
export declare function getFormatterOptionsByField(dm: any, collectionPath: string[] | undefined, dimField: any): {
    label: string;
    value: string;
}[];
export declare function getCollectionOptions(dm: any, compile: (v: any) => string): any;
export declare function validateQuery(query: Record<string, any>): {
    success: boolean;
    message: string;
};
