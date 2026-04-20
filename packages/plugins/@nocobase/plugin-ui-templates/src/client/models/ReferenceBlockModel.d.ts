/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { BlockModel } from '@nocobase/client';
/**
 * ReferenceBlockModel（插件版）
 * - 通过配置 targetUid（实例 model.uid）引用并渲染另一个区块；
 * - 在 BlockScoped 引擎中实例化目标区块，隔离模型实例与事件缓存；
 * - 与目标区块建立父子关系（目标仅作为 Reference 的子模型用于设置菜单聚合，不做持久化）；
 * - 当目标缺失/非法/循环时，渲染占位提示；
 * - title 仅展示目标标题；模板信息通过 extraTitle 展示（配置态双标签）。
 */
export declare class ReferenceBlockModel extends BlockModel {
    constructor(options: any);
    settingsMenuLevel: number;
    private _scopedEngine?;
    private _targetModel?;
    private _resolvedTargetUid?;
    private _invalidTargetUid?;
    private _bridgeTargetContext;
    get title(): any;
    onInit(option: any): void;
    private _getTargetUidFromParams;
    private _syncExtraTitle;
    private _ensureScopedEngine;
    /**
     * 解析最终目标模型：
     * - 支持 reference-of-reference 扁平化（直到非 ReferenceBlockModel）；
     * - 简单循环检测（A→B→A 等）；
     * - 目标缺失或非法时返回 null。
     */
    private _resolveFinalTarget;
    onDispatchEventStart(eventName: string): Promise<void>;
    destroy(): Promise<boolean>;
    /**
     * 重写 serialize 方法，排除 target 子模型的序列化
     * 这样在保存引用区块时不会连带保存目标区块，避免破坏目标区块的父子关系
     */
    serialize(): Record<string, any>;
    renderComponent(): React.JSX.Element;
    render(): any;
}
