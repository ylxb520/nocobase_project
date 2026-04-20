/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * 通用的 Event 注册表基类（abstract）。
 * 抽取共享的注册逻辑，具体查询由子类实现。
 */
import type { FlowModel } from '../models';
import type { EventDefinition } from '../types';
export declare abstract class BaseEventRegistry<TModel extends FlowModel = FlowModel> {
    protected events: Map<string, EventDefinition<TModel>>;
    protected onEventRegistered(): void;
    registerEvents(defs: Record<string, EventDefinition<TModel>>): void;
    registerEvent(def: EventDefinition<TModel>): void;
    abstract getEvent<T extends FlowModel = FlowModel>(name: string): EventDefinition<T> | undefined;
    abstract getEvents<T extends FlowModel = FlowModel>(): Map<string, EventDefinition<T>>;
}
