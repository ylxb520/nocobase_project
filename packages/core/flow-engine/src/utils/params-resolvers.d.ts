/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowContext, FlowModelContext, FlowRuntimeContext } from '../flowContext';
import type { FlowModel } from '../models';
import type { ServerContextParams } from './serverContextParams';
/**
 * 解析 defaultParams，支持静态值和函数形式
 * @param {Record<string, any> | ((ctx: any) => Record<string, any> | Promise<Record<string, any>>)} defaultParams 默认参数
 * @param {FlowRuntimeContext<TModel>} ctx 上下文
 * @returns {Promise<Record<string, any>>} 解析后的参数对象
 */
export declare function resolveDefaultParams<TModel extends FlowModel = FlowModel>(
  defaultParams: Record<string, any> | ((ctx: any) => Record<string, any> | Promise<Record<string, any>>) | undefined,
  ctx: FlowContext,
): Promise<Record<string, any>>;
/**
 * 解析 FlowModelMeta 中的 createModelOptions，支持静态值和函数形式
 * @param defaultOptions - 可以是静态对象或返回对象的函数
 * @param ctx - 模型上下文实例，用于传递给函数形式
 * @returns 解析后的选项对象
 */
export declare function resolveCreateModelOptions(
  createModelOptions:
    | Record<string, any>
    | ((ctx: FlowModelContext, extra?: any) => Record<string, any> | Promise<Record<string, any>>)
    | undefined,
  ctx: FlowModelContext,
  extra?: any,
): Promise<Record<string, any>>;
export type JSONValue =
  | string
  | {
      [key: string]: JSONValue;
    }
  | JSONValue[];
type BatchPayload = {
  template: JSONValue;
  contextParams?: ServerContextParams | undefined;
};
export declare function enqueueVariablesResolve(ctx: FlowRuntimeContext, payload: BatchPayload): Promise<unknown>;
/**
 * 解析参数中的 {{xxx}} 表达式，自动处理异步属性访问
 */
export declare function resolveExpressions<TModel extends FlowModel = FlowModel>(
  params: JSONValue,
  ctx: FlowContext,
): Promise<any>;
/**
 * 预处理表达式字符串，插入必要的 await 和 RecordProxy 检查
 *
 * 1. 统一提取所有一层 ctx 路径（如 ctx.record, ctx.user）
 * 2. 批量 await 获取这些值，判断是否为 RecordProxy 实例
 * 3. 根据预处理结果决定每个多层路径的 await 插入方式
 * 4. 避免重复解析，提高性能
 *
 * @param expression 原始表达式
 * @param ctx FlowContext
 * @returns 预处理后的表达式字符串
 */
export declare function preprocessExpression(expression: string, ctx: FlowContext): Promise<string>;
export {};
