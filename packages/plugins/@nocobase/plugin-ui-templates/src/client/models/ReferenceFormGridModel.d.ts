/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { type CreateModelOptions, FlowModel } from '@nocobase/flow-engine';
export type ReferenceFormGridTargetSettings = {
    /** 模板 uid（flowModelTemplates.uid） */
    templateUid: string;
    /** 模板名称（用于 UI 展示，可选） */
    templateName?: string;
    /** 模板根区块 uid（flowModels.uid） */
    targetUid: string;
    /** 从模板根上取片段的路径，当前仅支持 'subModels.grid' */
    targetPath?: string;
};
export declare class ReferenceFormGridModel extends FlowModel {
    private _scopedEngine?;
    private _targetRoot?;
    private _targetGrid?;
    private _resolvedTargetUid?;
    private _invalidTargetUid?;
    /**
     * 字段模板场景下，模板内 FormItemModel/CollectionFieldModel 的 onInit 会调用 ctx.blockModel.addAppends(fieldPath)。
     * 但模板 root 自身也是一个 CollectionBlockModel，会在未桥接宿主上下文时被识别为 blockModel，导致 appends 写到模板 root 的 resource，
     * 从而宿主表单（如 ApplyFormModel）在刷新记录时缺少关联 appends（例如 users.roles）。
     *
     * 这里在目标 grid 解析完成后扫描字段路径，并把需要的 appends 同步到宿主 block（master + forks），确保关系数据可展示。
     */
    private _syncHostResourceAppends;
    constructor(options: any);
    private _ensureScopedEngine;
    private _getTargetSettings;
    private _syncHostExtraTitle;
    addSubModel<T extends FlowModel>(subKey: string, options: CreateModelOptions | T): T;
    setSubModel(subKey: string, options: CreateModelOptions | FlowModel): FlowModel<import("@nocobase/flow-engine").DefaultStructure>;
    getStepParams(flowKey: string, stepKey: string): any | undefined;
    getStepParams(flowKey: string): Record<string, any> | undefined;
    getStepParams(): Record<string, any>;
    setStepParams(flowKey: string, stepKey: string, params: any): void;
    setStepParams(flowKey: string, stepParams: Record<string, any>): void;
    setStepParams(allParams: Record<string, any>): void;
    saveStepParams(): Promise<any>;
    onDispatchEventStart(eventName: string): Promise<void>;
    clearForks(): void;
    destroy(): Promise<boolean>;
    render(): React.JSX.Element;
}
