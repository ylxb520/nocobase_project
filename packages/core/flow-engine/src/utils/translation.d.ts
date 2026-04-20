/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { TFuncKey, TOptions } from 'i18next';
import type { FlowModel } from '../models';
/**
 * 获取带有 flow-engine 命名空间的翻译函数
 * @param model FlowModel 实例
 * @returns 翻译函数，自动使用 flow-engine 命名空间
 */
export declare function getT(model: FlowModel): (key: string, options?: any) => string;
export declare function tExpr(text: TFuncKey | TFuncKey[], options?: TOptions): string;
/**
 * @deprecated use tExpr from `@nocobase/flow-engine` instead
 */
export declare function escapeT(text: TFuncKey | TFuncKey[], options?: TOptions): string;
