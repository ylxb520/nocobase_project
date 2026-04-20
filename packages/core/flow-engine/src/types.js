/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export var ActionScene;
(function (ActionScene) {
  /** 块级联动规则可用 */
  ActionScene[(ActionScene['BLOCK_LINKAGE_RULES'] = 1)] = 'BLOCK_LINKAGE_RULES';
  /** 表单字段级联动规则可用 */
  ActionScene[(ActionScene['FIELD_LINKAGE_RULES'] = 2)] = 'FIELD_LINKAGE_RULES';
  /** 子表单字段级联动规则可用 */
  ActionScene[(ActionScene['SUB_FORM_FIELD_LINKAGE_RULES'] = 3)] = 'SUB_FORM_FIELD_LINKAGE_RULES';
  /** 详情字段级联动规则可用 */
  ActionScene[(ActionScene['DETAILS_FIELD_LINKAGE_RULES'] = 4)] = 'DETAILS_FIELD_LINKAGE_RULES';
  /** 按钮级联动规则可用 */
  ActionScene[(ActionScene['ACTION_LINKAGE_RULES'] = 5)] = 'ACTION_LINKAGE_RULES';
  /** 动态事件流可用 */
  ActionScene[(ActionScene['DYNAMIC_EVENT_FLOW'] = 6)] = 'DYNAMIC_EVENT_FLOW';
})(ActionScene || (ActionScene = {}));
//# sourceMappingURL=types.js.map
