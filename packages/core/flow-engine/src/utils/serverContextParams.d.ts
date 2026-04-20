/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { FlowContext } from '../flowContext';
export type RecordRef = {
    collection?: string;
    id?: any;
    filterByTk?: any;
    dataSourceKey?: string;
    associationName?: string;
    sourceId?: any;
    fields?: string[];
    appends?: string[];
    record?: any;
};
export type BuildServerContextParamsInput = Record<string, any>;
export type ServerContextParams = Record<string, NormalizedRecordParams>;
export type NormalizedRecordParams = {
    collection: string;
    filterByTk: any;
    dataSourceKey?: string;
    associationName?: string;
    sourceId?: any;
    fields?: string[];
    appends?: string[];
};
export declare function buildServerContextParams(ctx: FlowContext, input?: BuildServerContextParamsInput): ServerContextParams | undefined;
