/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const NAMESPACE = "@nocobase/plugin-workflow-custom-action-trigger";
export declare const EVENT_TYPE = "custom-action";
export declare const CONTEXT_TYPE: {
    GLOBAL: number;
    SINGLE_RECORD: number;
    MULTIPLE_RECORDS: number;
};
export declare const CONTEXT_TYPE_OPTIONS: {
    label: string;
    value: number;
    tooltip: string;
}[];
