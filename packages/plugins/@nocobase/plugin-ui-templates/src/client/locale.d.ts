/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { FlowModel } from '@nocobase/flow-engine';
export declare const NAMESPACE: string;
export declare function useT(): (str: string, options?: Record<string, any>) => string;
export declare function tStr(key: string): string;
/**
 * 获取带有插件命名空间的翻译函数（用于非组件环境）
 * @param model FlowModel 实例
 * @returns 翻译函数，使用插件命名空间
 */
export declare function getPluginT(model: FlowModel): (key: string, options?: any) => string;
