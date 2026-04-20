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
export function getFieldBindingUse(fieldModel) {
  const bindingUse = fieldModel?.stepParams?.fieldBinding?.use;
  return typeof bindingUse === 'string' ? bindingUse : undefined;
}
export async function rebuildFieldSubModel({ parentModel, targetUse, defaultProps, pattern, fieldSettingsInit }) {
  const fieldModel = parentModel.subModels['field'];
  const fieldUid = fieldModel?.uid;
  const prevSubModels = fieldModel?.serialize?.()?.subModels;
  // RecordPickerFieldModel 的子model提前创建会报错
  for (const key in prevSubModels) {
    const subModel = prevSubModels[key];
    if (subModel.delegateToParent === false) {
      delete prevSubModels[key];
    }
  }
  const prevStepParams = fieldModel?.stepParams || {};
  const nextFieldSettingsInit = fieldSettingsInit ?? parentModel.getFieldSettingsInitParams?.();
  const nextStepParams = {
    ...prevStepParams,
    fieldBinding: { ...prevStepParams.fieldBinding, use: targetUse },
    fieldSettings: {
      init: nextFieldSettingsInit,
    },
  };
  const engine = parentModel.flowEngine;
  if (fieldUid) {
    fieldModel?.invalidateFlowCache('beforeRender', true);
    engine.removeModelWithSubModels(fieldUid);
  }
  const subModel = parentModel.setSubModel('field', {
    uid: fieldUid,
    use: FieldModel,
    props: { ...(defaultProps || {}), ...(pattern ? { pattern } : {}) },
    stepParams: nextStepParams,
    // Preserve existing subModels (e.g. SubTable columns) so switching field component back and forth
    // does not require a full page refresh to restore the UI.
    subModels: prevSubModels,
  });
  await subModel.dispatchEvent('beforeRender', undefined, { useCache: false });
  await parentModel.save();
}
//# sourceMappingURL=rebuildFieldSubModel.js.map
