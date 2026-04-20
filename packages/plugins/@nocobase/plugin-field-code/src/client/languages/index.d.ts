/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const LANGUAGES_LIST: ({
    value: string;
    label: string;
    load(): Promise<import("@codemirror/language").LanguageSupport>;
} | {
    value: string;
    label: string;
    load(): Promise<import("@codemirror/language").LanguageSupport>;
} | {
    value: string;
    label: string;
    load(): Promise<import("@codemirror/language").StreamLanguage<unknown>>;
})[];
export declare const LANGUAGES_MAP: {
    [k: string]: {
        value: string;
        label: string;
        load(): Promise<import("@codemirror/language").LanguageSupport>;
    } | {
        value: string;
        label: string;
        load(): Promise<import("@codemirror/language").LanguageSupport>;
    } | {
        value: string;
        label: string;
        load(): Promise<import("@codemirror/language").StreamLanguage<unknown>>;
    };
};
