/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare function convertDatasetFormats(data: Record<string, any>[]): {
    objects: any[];
    rows: any[];
    columns: any[];
    dimensions?: undefined;
} | {
    dimensions: string[];
    objects: Record<string, any>[];
    rows: string[][];
    columns: any[][];
};
/**
 * Normalize ECharts option for dataset-based pie charts.
 * Fixes `{c}` showing `[object Object]` when `dataset.source` is an array of objects by rewriting `{c}` to `{@<valueField>}`.
 */
export declare function normalizeEChartsOption(option: any): any;
export declare const formatters: {
    datetime: {
        label: string;
        value: string;
    }[];
    date: {
        label: string;
        value: string;
    }[];
    time: {
        label: string;
        value: string;
    }[];
};
export declare function sleep(ms: number): Promise<void>;
export declare function appendColon(label: string, lang?: string): string;
export declare const isDebugEnabled: () => boolean;
export declare const debugLog: (...args: any[]) => void;
