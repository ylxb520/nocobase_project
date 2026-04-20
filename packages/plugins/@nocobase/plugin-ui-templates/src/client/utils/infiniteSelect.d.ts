/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export type PaginatedOptionsResult<T = any> = {
    options: T[];
    hasMore: boolean;
};
export declare const defaultSelectOptionComparator: (a: any, b: any) => number;
export declare function mergeSelectOptions(prev: any[], next: any[], options?: {
    getKey?: (item: any) => string;
    comparator?: (a: any, b: any) => number;
}): any[];
export declare function bindInfiniteScrollToFormilySelect(field: any, fetchPage: (keyword: string, page: number, pageSize: number) => Promise<PaginatedOptionsResult<any>>, options?: {
    pageSize?: number;
    debounceMs?: number;
    scrollThreshold?: number;
    composingKey?: string;
    comparator?: (a: any, b: any) => number;
}): {
    resetAndLoad: (keyword: string) => Promise<void>;
    loadMore: () => Promise<void>;
    cancelSearch: () => void;
};
