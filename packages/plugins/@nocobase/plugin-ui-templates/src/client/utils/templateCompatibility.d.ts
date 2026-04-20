/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const TEMPLATE_LIST_PAGE_SIZE = 20;
export declare function normalizeStr(value: unknown): string;
export declare function parseResourceListResponse<T = any>(res: any): {
    rows: T[];
    count?: number;
};
export declare function calcHasMore(args: {
    page: number;
    pageSize: number;
    rowsLength: number;
    count?: number;
}): boolean;
export declare function tWithNs(ctx: any, key: string, options?: Record<string, any>): string;
export declare function resolveTargetResourceByAssociation(ctx: any, init: {
    dataSourceKey?: unknown;
    collectionName?: unknown;
    associationName?: unknown;
}, options?: {
    dataSourceManager?: any;
}): {
    dataSourceKey: string;
    collectionName: string;
} | undefined;
export declare function resolveBaseResourceByAssociation(init: {
    dataSourceKey?: unknown;
    collectionName?: unknown;
    associationName?: unknown;
}): {
    dataSourceKey: string;
    collectionName: string;
} | undefined;
export declare function resolveExpectedResourceInfoByModelChain(ctx: any, startModel?: any, options?: {
    maxDepth?: number;
    dataSourceManager?: any;
    fallbackCollectionFromCtx?: boolean;
    includeAssociationName?: boolean;
}): {
    dataSourceKey?: string;
    collectionName?: string;
    associationName?: string;
};
export type TemplateAssociationMatchStrategy = 'none' | 'exactIfTemplateHasAssociationName' | 'associationResourceOnly';
/**
 * 推断弹窗模板是否需要 record/source 上下文。
 * 用于避免 Collection 模板被误判为 Record 模板（尤其是默认值里带 `{{ ctx.record.* }}` 的情况）。
 */
export type PopupTemplateContextFlags = {
    hasFilterByTk: boolean;
    hasSourceId: boolean;
    /** 是否有足够信息确定 hasFilterByTk（用于运行时决定是否覆盖） */
    confidentFilterByTk: boolean;
    /** 是否有足够信息确定 hasSourceId */
    confidentSourceId: boolean;
};
export type ActionSceneType = 'record' | 'collection' | 'both' | undefined;
/**
 * 根据 Model 类的 _isScene 方法推断 action 场景类型
 */
export declare function resolveActionScene(getModelClass: ((use: string) => any) | undefined, useModel?: unknown): ActionSceneType;
/**
 * 推断弹窗模板的 filterByTk/sourceId 上下文需求
 */
export declare function inferPopupTemplateContextFlags(scene: ActionSceneType, filterByTkExpr?: string, sourceIdExpr?: string): PopupTemplateContextFlags;
/**
 * 从已保存的 openView params 中提取 PopupTemplateContextFlags（用于 copy 模式或无法获取模板记录时的兜底）
 */
export declare function extractPopupTemplateContextFlagsFromParams(params: {
    popupTemplateHasFilterByTk?: boolean;
    popupTemplateHasSourceId?: boolean;
}): PopupTemplateContextFlags;
export declare function getTemplateAvailabilityDisabledReason(ctx: any, tpl: {
    dataSourceKey?: unknown;
    collectionName?: unknown;
    associationName?: unknown;
}, expected: {
    dataSourceKey?: unknown;
    collectionName?: unknown;
    associationName?: unknown;
}, options?: {
    dataSourceManager?: any;
    checkResource?: boolean;
    associationMatch?: TemplateAssociationMatchStrategy;
}): string | undefined;
