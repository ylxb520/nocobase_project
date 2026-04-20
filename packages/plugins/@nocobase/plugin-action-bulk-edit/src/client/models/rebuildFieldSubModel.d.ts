/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * 通用的字段子模型重建工具：
 * - 保留原有 uid
 * - 通过 FieldModel 入口 + fieldBinding.use 动态选择目标字段类
 * - 支持同步父项模式（pattern）
 * - 重建后触发 beforeRender（useCache: false）
 */
import { FieldModel } from '@nocobase/client';
import { FlowModel } from '@nocobase/flow-engine';
type FieldParentModel = FlowModel & {
  subModels: FlowModel['subModels'] & {
    field?: FieldModel;
  };
  getFieldSettingsInitParams?: () => unknown;
};
type RebuildOptions = {
  parentModel: FieldParentModel;
  targetUse: string;
  defaultProps?: Record<string, unknown>;
  pattern?: string;
  fieldSettingsInit?: unknown;
};
export declare function getFieldBindingUse(fieldModel?: FieldModel): string | undefined;
export declare function rebuildFieldSubModel({
  parentModel,
  targetUse,
  defaultProps,
  pattern,
  fieldSettingsInit,
}: RebuildOptions): Promise<void>;
export {};
