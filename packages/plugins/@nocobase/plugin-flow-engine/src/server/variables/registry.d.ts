/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { HttpRequestContext } from '../template/contexts';
import { ResourcerContext } from '@nocobase/resourcer';
export type JSONValue = string | {
    [key: string]: JSONValue;
} | JSONValue[];
export type VarScope = 'global' | 'request';
export interface RequiredParamSpec {
    name: string;
    required?: boolean;
    defaultValue?: any;
}
export interface VariableDef {
    name: string;
    scope: VarScope;
    requiredParams?: RequiredParamSpec[];
    attach: (ctx: HttpRequestContext, koaCtx: ResourcerContext, params?: any, usage?: VarUsage) => Promise<void> | void;
}
export type VarUsage = {
    [varName: string]: string[];
};
declare class VariableRegistry {
    private vars;
    register(def: VariableDef): void;
    get(name: string): VariableDef;
    list(): VariableDef[];
    extractUsage(template: JSONValue): VarUsage;
    validate(template: JSONValue, contextParams: any): {
        ok: boolean;
        missing?: string[];
    };
    attachUsedVariables(ctx: HttpRequestContext, koaCtx: ResourcerContext, template: JSONValue, contextParams: any): Promise<void>;
}
export declare const variables: VariableRegistry;
/** 仅测试使用：重置变量注册表为内置默认集 */
/**
 * 从使用路径推断查询所需的 fields 与 appends。
 * @param paths 使用到的子路径数组
 * @param params 显式参数（仅用于兼容签名）
 */
export declare function inferSelectsFromUsage(paths?: string[], _params?: unknown): {
    generatedAppends?: string[];
    generatedFields?: string[];
};
export {};
