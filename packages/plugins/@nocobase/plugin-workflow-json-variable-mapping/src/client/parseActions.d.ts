/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare function getObjPaths(obj: any, prefix?: string, paths?: any[], options?: {
    parseArray: boolean;
    keys: any[];
}): any[];
export declare const useParseJsonAction: () => {
    run(): Promise<void>;
};
export declare const useClearItemsAction: () => {
    run(): Promise<void>;
};
