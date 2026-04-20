/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * 模型类级事件注册表（每个 FlowModel 子类一个）。
 * - 仅维护“当前类自有”的事件；
 * - 通过父类注册表实现继承合并，并在本类内部做缓存；
 * - 内部有查询缓存，避免重复计算。
 */
import type { EventDefinition } from '../types';
import type { FlowModel } from '../models';
import { BaseEventRegistry } from './BaseEventRegistry';
export declare class ModelEventRegistry extends BaseEventRegistry {
    private readonly modelClass;
    private readonly parentRegistry;
    private changeMarker;
    private mergedCache?;
    constructor(modelClass: typeof FlowModel, parentRegistry?: ModelEventRegistry | null);
    protected onEventRegistered(): void;
    /**
     * 获取“包含继承”的合并事件（父 → 子），内部带缓存。
     */
    getEvents<TModel extends FlowModel = FlowModel>(): Map<string, EventDefinition<TModel>>;
    /**
     * 解析指定名称的事件（优先本类，未命中递归父类）。
     */
    getEvent<TModel extends FlowModel = FlowModel>(name: string): EventDefinition<TModel> | undefined;
}
