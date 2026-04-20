/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BaseRecordResource } from '@nocobase/flow-engine';
export declare class ChartResource<TData = any> extends BaseRecordResource<TData> {
    resourceName: string;
    private refreshTimer;
    protected request: {
        url: string;
        method: string;
        params: Record<string, any>;
        data: Record<string, any>;
        headers: Record<string, any>;
    };
    setQueryParams(query: Record<string, any>, mark?: string): this;
    setFilter(filter: Record<string, any>): this;
    parseQuery(query: Record<string, any>): {
        mode: any;
        sql: any;
        dataSource: any;
        collection: any;
        measures: any;
        dimensions: any;
        filter: any;
        orders: any;
        limit: any;
        offset: any;
    };
    run(): Promise<any>;
    refresh(): Promise<void>;
}
