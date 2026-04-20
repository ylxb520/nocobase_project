/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { extractUsedVariableNames as _extractUsedVariableNames, extractUsedVariablePaths as _extractUsedVariablePaths } from '@nocobase/shared';
import type { Collection } from '../data-source';
import type { FlowContext, PropertyMeta, PropertyMetaFactory } from '../flowContext';
import { type RecordRef, type ServerContextParams } from '../utils/serverContextParams';
import type { JSONValue } from './params-resolvers';
export declare function inferRecordRef(ctx: FlowContext): RecordRef | undefined;
export declare function inferViewRecordRef(ctx: FlowContext): RecordRef | undefined;
export declare function getViewRecordFromParent(flowContext: FlowContext, viewContext: FlowContext): unknown;
export declare function createViewRecordResolveOnServer(ctx: FlowContext, getLocalRecord: () => unknown): (subPath: string) => boolean;
/**
 * 创建一个用于 “ctx.record” 变量的 resolveOnServer 判定函数：
 * - 若本地 record 不存在：统一走服务端；
 * - 若本地 record 存在：
 *   - 访问空子路径（"{{ ctx.record }}"）时使用本地值，不走服务端；
 *   - 访问非关联字段（如 id/title）：使用本地值；
 *   - 访问关联字段：
 *     - 若本地该字段无值（undefined/null），则交给服务端解析（无论是 "author" 还是 "author.name"）；
 *     - 若本地已有值，则仅在访问子属性且本地缺少该子属性值时交给服务端。
 */
export declare function createRecordResolveOnServerWithLocal(collectionAccessor: () => Collection | null, valueAccessor: () => unknown): (subPath: string) => boolean;
export declare function inferParentRecordRef(ctx: FlowContext): RecordRef | undefined;
export type RecordParamsBuilder = (ctx: FlowContext) => RecordRef | Promise<RecordRef> | undefined;
/**
 * Build a PropertyMeta for a record-like property with variablesParams included.
 */
export declare function buildRecordMeta(collectionAccessor: () => Collection | null, title?: string, paramsBuilder?: RecordParamsBuilder): Promise<PropertyMeta | null>;
/**
 * Convenience helper to create a PropertyMetaFactory for a record-like variable.
 * It sets the factory.title so UI can display an immediate label before lazy resolution.
 */
export declare function createRecordMetaFactory(collectionAccessor: () => Collection | null, title: string, paramsBuilder?: RecordParamsBuilder): PropertyMetaFactory;
/**
 * Sugar for the most common case: a current record meta bound to FlowContext.
 * - Title: t('Current record')
 * - Params: inferRecordRef(ctx)
 */
export declare function createCurrentRecordMetaFactory(ctx: FlowContext, collectionAccessor: () => Collection | null, options?: {
    title?: string;
}): PropertyMetaFactory;
/**
 * Extract top-level ctx variable names used inside a JSON template.
 * Supports dot and bracket notations, e.g. {{ ctx.record.id }}, {{ ctx['parentRecord'].name }}.
 */
export declare const extractUsedVariableNames: typeof _extractUsedVariableNames;
/**
 * Extract used top-level ctx variables with their subpaths.
 * Returns a map: varName -> string[] subPaths
 * Examples:
 *  - {{ ctx.user.id }}        => { user: ['id'] }
 *  - {{ ctx['user'].roles[0].name }} => { user: ['roles[0].name'] }
 *  - {{ ctx.view.record.id }} => { view: ['record.id'] }
 *  - {{ ctx.twice(21) }}      => { twice: [''] } // method call -> empty subPath
 */
export declare const extractUsedVariablePaths: typeof _extractUsedVariablePaths;
/**
 * 根据模板中用到的 ctx 变量，收集并构建服务端解析所需的 contextParams。
 * - 通过 FlowContext 的 PropertyMeta.buildVariablesParams 收集 RecordRef
 * - 仅包含模板中实际使用到的顶层变量键，避免无谓膨胀
 */
export declare function collectContextParamsForTemplate(ctx: FlowContext, template: JSONValue): Promise<ServerContextParams | undefined>;
