/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * 模型类级动作注册表（每个 FlowModel 子类一个）。
 * - 仅维护“当前类自有”的动作；
 * - 通过父类注册表实现继承合并，并在本类内部做缓存；
 * - 内部有查询缓存，避免重复计算。
 */
import type { ActionDefinition } from '../types';
import type { FlowModel } from '../models';
import type { FlowContext } from '../flowContext';
import { BaseActionRegistry } from './BaseActionRegistry';
export declare class ModelActionRegistry extends BaseActionRegistry<FlowModel, FlowContext> {
  private readonly modelClass;
  private readonly parentRegistry;
  private changeMarker;
  private mergedCache?;
  constructor(modelClass: typeof FlowModel, parentRegistry?: ModelActionRegistry | null);
  onActionRegistered(): void;
  /**
   * 获取“包含继承”的合并动作（父 → 子），内部带缓存。
   */
  getActions<TModel extends FlowModel = FlowModel, TCtx extends FlowContext = FlowContext>(): Map<
    string,
    ActionDefinition<TModel, TCtx>
  >;
  /**
   * 解析指定名称的动作（优先本类，未命中递归父类）。
   */
  getAction<TModel extends FlowModel = FlowModel, TCtx extends FlowContext = FlowContext>(
    name: string,
  ): ActionDefinition<TModel, TCtx> | undefined;
}
