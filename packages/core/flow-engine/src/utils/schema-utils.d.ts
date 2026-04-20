/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { ISchema } from '@formily/json-schema';
import type { FlowModel } from '../models';
import { FlowRuntimeContext } from '../flowContext';
import type { StepDefinition, StepUIMode } from '../types';
/**
 * 解析 uiMode，支持静态值和函数形式
 * 函数可以接收 FlowRuntimeContext
 * @param {StepUIMode | ((ctx: FlowRuntimeContext<TModel>) => StepUIMode | Promise<StepUIMode>)} uiMode UI模式定义
 * @param {FlowRuntimeContext<TModel>} ctx 上下文
 * @returns {Promise<StepUIMode>} 解析后的 UI 模式
 */
export declare function resolveUiMode<TModel extends FlowModel = FlowModel>(uiMode: StepUIMode | ((ctx: FlowRuntimeContext<TModel>) => StepUIMode | Promise<StepUIMode>) | undefined, ctx: FlowRuntimeContext<TModel>): Promise<StepUIMode>;
/**
 * 编译 UI Schema 中的表达式
 *
 * @param scope 编译作用域，包含可用的变量和函数（如 t, randomString 等）
 * @param uiSchema 待编译的 UI Schema
 * @param options 编译选项
 * @returns 编译后的 UI Schema
 */
export declare function compileUiSchema(scope: Record<string, any>, uiSchema: any, options?: {
    noCache?: boolean;
}): any;
/**
 * 解析并合并步骤的完整uiSchema
 * 这个函数提取了在多个组件中重复使用的uiSchema解析和合并逻辑
 * @param model 模型实例
 * @param flow 流程定义
 * @param step 步骤定义
 * @returns 合并后的uiSchema对象，如果为空则返回null
 */
export declare function resolveStepUiSchema<TModel extends FlowModel = FlowModel>(model: TModel, flow: any, step: StepDefinition): Promise<Record<string, ISchema> | null>;
/**
 * 判断步骤在设置菜单中是否应被隐藏。
 * - 支持 StepDefinition.hideInSettings 与 ActionDefinition.hideInSettings（step 优先）。
 * - hideInSettings 可为布尔值或函数（接收 FlowRuntimeContext）。
 */
export declare function shouldHideStepInSettings<TModel extends FlowModel = FlowModel>(model: TModel, flow: any, step: StepDefinition): Promise<boolean>;
/**
 * 解析步骤在设置菜单中的禁用状态与提示文案。
 * - 支持 StepDefinition.disabledInSettings 与 ActionDefinition.disabledInSettings（step 优先）。
 * - 支持 StepDefinition.disabledReasonInSettings 与 ActionDefinition.disabledReasonInSettings（step 优先）。
 * - 以上属性均支持静态值与函数（接收 FlowRuntimeContext）。
 */
export declare function resolveStepDisabledInSettings<TModel extends FlowModel = FlowModel>(model: TModel, flow: any, step: StepDefinition): Promise<{
    disabled: boolean;
    reason?: string;
}>;
