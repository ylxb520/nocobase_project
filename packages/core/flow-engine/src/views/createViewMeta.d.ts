/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { FlowContext, PropertyMetaFactory } from '../flowContext';
import type { FlowView } from './FlowView';
/**
 * 为 ctx.popup 构建元信息：
 * - popup.record：当前弹窗记录（服务端解析）
 * - popup.resource：数据源信息（前端解析）
 * - popup.parent：上级弹窗（无限级，前端解析；不存在则禁用/为空）
 */
export declare function createPopupMeta(ctx: FlowContext, anchorView?: FlowView): PropertyMetaFactory;
/**
 * 根据视图堆栈构建 popup 运行时值（resource + parent 链）
 */
interface PopupNodeResource {
    dataSourceKey: string;
    collectionName?: string;
    associationName?: string;
    filterByTk?: any;
    sourceId?: any;
}
interface PopupNode {
    uid?: string;
    resource: PopupNodeResource;
    parent?: PopupNode;
}
export declare function buildPopupRuntime(ctx: FlowContext, view: FlowView): Promise<PopupNode | undefined>;
/**
 * 在视图上下文中注册 popup 变量（统一消除重复）
 */
export declare function registerPopupVariable(ctx: FlowContext, view: FlowView): void;
export {};
