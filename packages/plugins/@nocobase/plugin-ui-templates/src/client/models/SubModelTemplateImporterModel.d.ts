/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CommonItemModel } from '@nocobase/client';
import { FlowModel, FlowContext } from '@nocobase/flow-engine';
type ImporterProps = {
    expectedRootUse?: string | string[];
    expectedDataSourceKey?: string;
    expectedCollectionName?: string;
};
export declare function resolveExpectedRootUse(blockModel: FlowModel | undefined): string | string[];
export declare class SubModelTemplateImporterModel extends CommonItemModel {
    props: ImporterProps;
    resolveExpectedResourceInfo(ctx?: FlowContext, start?: FlowModel): {
        dataSourceKey?: string;
        collectionName?: string;
    };
    afterAddAsSubModel(): Promise<void>;
    save(): Promise<{
        uid: string;
    }>;
    saveStepParams(): Promise<{
        uid: string;
    }>;
    render(): any;
    getTemplateDisabledReason(ctx: FlowContext, tpl: Record<string, any>, expected?: {
        dataSourceKey?: string;
        collectionName?: string;
    }): string | undefined;
    fetchTemplateOptions(ctx: FlowContext, keyword?: string, pagination?: {
        page?: number;
        pageSize?: number;
    }): Promise<{
        options: any[];
        hasMore: boolean;
    }>;
}
export {};
