/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { FlowRuntimeContext } from '../flowContext';
import { FlowModel } from '../models/flowModel';
import { DefaultStructure, StepDefinition } from '../types';
/**
 * 为 FlowRuntimeContext 设置 steps 属性及其 meta 信息
 * @param ctx FlowRuntimeContext 实例
 * @param flowSteps 流定义
 * @param model FlowModel 实例
 * @param flowKey key
 */
export declare function setupRuntimeContextSteps(ctx: FlowRuntimeContext<any>, flowSteps: Record<string, StepDefinition<FlowModel<DefaultStructure>>>, model: FlowModel, flowKey: string): void;
