/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowModel } from '@nocobase/flow-engine';
/**
 * 字段模板 copy 模式只会 duplicate `subModels.grid`，而历史模板可能把部分配置（如布局/连动规则）
 * 存在模板 root 上。reference 模式通过 getStepParams 的 fallback 能读到这些值，但 copy 模式需要
 * 主动把这些 stepParams 合并进 grid 的 stepParams，避免丢失。
 *
 * - 仅在 grid 上缺失对应 stepKey 时才回填（不覆盖 grid 上已有值）
 * - 返回 patched 标记，方便调用方决定是否需要 `saveStepParams()`
 */
export declare function patchGridOptionsFromTemplateRoot(templateRoot: FlowModel | undefined, gridOptions: any): {
    options: any;
    patched: boolean;
};
