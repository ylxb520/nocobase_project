/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FormItemModel } from '@nocobase/client';
import _ from 'lodash';
import { BulkEditFieldV2 } from '../component/BulkEditFieldV2';
import { tExpr, FieldModelRenderer, FormItem } from '@nocobase/flow-engine';
function buildDynamicName(nameParts, fieldIndex) {
  if (!fieldIndex?.length) {
    return nameParts;
  }
  // 取最后一个索引
  const [lastField, indexStr] = fieldIndex[fieldIndex.length - 1].split(':');
  const idx = Number(indexStr);
  // 找到 lastField 在 nameParts 的位置
  const lastIndex = nameParts.indexOf(lastField);
  if (lastIndex === -1) {
    // 找不到对应字段，直接返回原始 nameParts
    return nameParts;
  }
  // 结果 = [索引, ...lastField 后面的字段]
  return [idx, ...nameParts.slice(lastIndex + 1)];
}
export class BulkEditFormItemModel extends FormItemModel {
  static defineChildren(ctx) {
    const fileds = ctx.collection.getFields();
    const children = FormItemModel.defineChildren(ctx) || [];
    return children
      .filter((child) => {
        const field = fileds.find((f) => f.name === child.key);
        const canEdit =
          field?.interface &&
          !field?.uiSchema?.['x-read-pretty'] &&
          field.interface !== 'snapshot' &&
          field.type !== 'sequence';
        return canEdit;
      })
      .map((child) => ({
        ...child,
        // useModel: 'BulkEditFormItemModel',
        createModelOptions: () => {
          const options = child.createModelOptions();
          return {
            ...options,
            use: 'BulkEditFormItemModel',
          };
        },
      }));
  }
  renderItem() {
    const fieldModel = this.subModels.field;
    // 行索引（来自数组子表单）
    const idx = this.context.fieldIndex;
    const fieldKey = this.context.fieldKey;
    const parentFieldPathArray = this.parent?.context.fieldPathArray || [];
    // 嵌套场景下继续传透，为字段子模型创建 fork
    const modelForRender =
      idx != null
        ? (() => {
            const fork = fieldModel.createFork({}, `${fieldKey}`);
            fork.context.defineProperty('fieldIndex', {
              get: () => idx,
            });
            fork.context.defineProperty('fieldKey', {
              get: () => fieldKey,
            });
            if (this.context.currentObject) {
              fork.context.defineProperty('currentObject', {
                get: () => this.context.currentObject,
              });
            }
            if (this.context.pattern) {
              fork.context.defineProperty('pattern', {
                get: () => this.context.pattern,
              });
            }
            return fork;
          })()
        : fieldModel;
    const mergedProps = this.context.pattern ? { ...this.props, pattern: this.context.pattern } : this.props;
    const fieldPath = buildDynamicName(this.props.name, idx);
    this.context.defineProperty('fieldPathArray', {
      value: [...parentFieldPathArray, ..._.castArray(fieldPath)],
    });
    const record = this.context.currentObject || this.context.record;
    return React.createElement(
      FormItem,
      {
        ...mergedProps,
        name: fieldPath,
        validateFirst: true,
        disabled:
          this.props.disabled ||
          (!_.isEmpty(record) && !record.__is_new__ && this.props.aclDisabled) ||
          (!_.isEmpty(record) && record.__is_new__ && this.props.aclCreateDisabled),
      },
      React.createElement(BulkEditFieldV2, {
        formItemModel: this,
        field: React.createElement(FieldModelRenderer, { model: modelForRender, name: fieldPath }),
      }),
    );
  }
}
BulkEditFormItemModel.define({
  label: tExpr('Display fields'),
});
const baseEditItemSettingsFlow = FormItemModel.globalFlowRegistry?.getFlow?.('editItemSettings');
if (baseEditItemSettingsFlow) {
  const data = baseEditItemSettingsFlow.serialize();
  const { key, steps, ...rest } = data;
  // 过滤掉不需要的配置项，但保留 titleField 以便我们可以替换它
  const { initialValue, required, validation, pattern, ...filteredSteps } = steps || {};
  if (filteredSteps?.model) {
    filteredSteps.model = {
      ...filteredSteps.model,
      use: 'bulkEditFieldComponent',
    };
  }
  BulkEditFormItemModel.registerFlow({
    key: 'editItemSettings',
    ...rest,
    steps: filteredSteps,
  });
}
//# sourceMappingURL=BulkEditFormItemModel.js.map
