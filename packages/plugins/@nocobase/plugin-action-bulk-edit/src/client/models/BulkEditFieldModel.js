/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FieldModelRenderer, FieldModel, RecordSelectFieldModel, titleField } from '@nocobase/client';
import { Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { BulkEditFormItemValueType } from './types';
import { lang } from '../locale';
import { BulkEditFormItemModel } from './BulkEditFormItemModel';
function toFormFieldValue(value) {
  if (BulkEditFormItemValueType.Clear in value) {
    return null;
  } else if (BulkEditFormItemValueType.ChangedTo in value) {
    return value[BulkEditFormItemValueType.ChangedTo];
  } else if (BulkEditFormItemValueType.RemainsTheSame in value) {
    return;
  }
}
const BulkEditField = (props) => {
  const { fieldModel, formItemModel, bulkEditFieldModel, onChange, ...rest } = props;
  const [type, setType] = useState(BulkEditFormItemValueType.RemainsTheSame);
  const [value, setValue] = useState(null);
  const form = formItemModel.context.blockModel.form;
  const typeChangeHandler = (val) => {
    setType(val);
    const required = val === BulkEditFormItemValueType.ChangedTo;
    // 设置必填状态
    if (required) {
      const rules = [
        {
          required: true,
          message: formItemModel.context.t('The field value is required'),
        },
      ];
      formItemModel?.setProps({ required: true, rules });
    } else {
      formItemModel?.setProps({ required: false, rules: [] });
    }
    const fieldValue = toFormFieldValue({ [val]: value });
    form.setFieldValue(formItemModel.props.name, fieldValue);
  };
  const valueChangeHandler = (val) => {
    const v = val?.target?.value ?? val?.target?.checked ?? val;
    setValue(v);
    onChange?.(v);
  };
  useEffect(() => {
    // 同步 stepParams 到 inner fieldModel
    fieldModel?.setStepParams(bulkEditFieldModel.getStepParams());
  }, []);
  return React.createElement(
    Space,
    {
      className: css`
        display: flex;
        > .ant-space-item {
          width: 100%;
        }
      `,
      direction: 'vertical',
    },
    React.createElement(
      Select,
      { defaultValue: type, value: type, onChange: typeChangeHandler, disabled: props.aclDisabled },
      React.createElement(Select.Option, { value: BulkEditFormItemValueType.RemainsTheSame }, lang('Remains the same')),
      React.createElement(Select.Option, { value: BulkEditFormItemValueType.ChangedTo }, lang('Changed to')),
      React.createElement(Select.Option, { value: BulkEditFormItemValueType.Clear }, lang('Clear')),
    ),
    [BulkEditFormItemValueType.ChangedTo, BulkEditFormItemValueType.AddAttach].includes(type) &&
      React.createElement(FieldModelRenderer, { model: fieldModel, ...rest, onChange: valueChangeHandler }),
  );
};
export class BulkEditFieldModel extends FieldModel {
  setProps(props, value) {
    super.setProps(props, value);
    const innerField = this.subModels?.field;
    innerField?.setProps(props, value);
  }
  setStepParams(flowKeyOrAllParams, stepKeyOrStepsParams, params) {
    super.setStepParams(flowKeyOrAllParams, stepKeyOrStepsParams, params);
    const innerField = this.subModels?.field;
    innerField?.setStepParams(flowKeyOrAllParams, stepKeyOrStepsParams, params);
  }
  async openFlowSettings(options) {
    const flowKey = options?.flowKey;
    const innerField = this.subModels?.field;
    if (flowKey && !this.getFlow(flowKey) && innerField?.openFlowSettings) {
      return innerField.openFlowSettings(options);
    }
    return super.openFlowSettings(options);
  }
  render() {
    const fieldModel = this.subModels.field;
    return React.createElement(BulkEditField, {
      formItemModel: this.parent,
      bulkEditFieldModel: this,
      fieldModel: fieldModel,
      ...this.props,
    });
  }
}
const isBulkEditContext = (ctx) => {
  const parent = ctx?.model?.parent;
  if (!parent) {
    return false;
  }
  if (parent instanceof BulkEditFieldModel) {
    return true;
  }
  const grandParent = parent?.parent;
  return grandParent instanceof BulkEditFormItemModel;
};
const isBulkEditScene = (ctx) => {
  const blockModel = ctx?.blockModel || ctx?.model?.context?.blockModel || ctx?.model?.parent?.context?.blockModel;
  return !!blockModel?.constructor?._isScene?.('bulkEditForm');
};
const getBulkEditFieldNames = (ctx) => {
  const own = ctx?.model?.props?.fieldNames;
  if (own?.label && own?.value) {
    return own;
  }
  const parent = ctx?.model?.parent;
  const parentFieldNames = parent?.props?.fieldNames;
  if (parentFieldNames?.label && parentFieldNames?.value) {
    return parentFieldNames;
  }
  return null;
};
RecordSelectFieldModel.registerAction({
  ...titleField,
  name: 'titleField',
  // 避免 packages/core/flow-engine/src/models/flowModel.tsx applyFlowSettings 时覆盖 Bulk Edit 场景下的配置
  defaultParams: (ctx) => {
    if (isBulkEditContext(ctx)) {
      const existing = getBulkEditFieldNames(ctx);
      if (existing?.label) {
        return { label: existing.label };
      }
    }
    const original = titleField.defaultParams;
    return typeof original === 'function' ? original(ctx) : original;
  },
  // Hide RecordSelectFieldModel's built-in titleField step when in bulk edit context
  async hideInSettings(ctx) {
    if (isBulkEditContext(ctx)) {
      return true;
    }
    const original = titleField.hideInSettings;
    return typeof original === 'function' ? await original(ctx) : !!original;
  },
});
const selectSettingsFlow = RecordSelectFieldModel.globalFlowRegistry?.getFlow?.('selectSettings');
const quickCreateStep = selectSettingsFlow?.getStep?.('quickCreate');
if (quickCreateStep) {
  const existing = quickCreateStep.serialize();
  const originalHide = existing.hideInSettings;
  if (!originalHide?.__bulkEditWrapped) {
    const wrappedHide = (ctx) => {
      if (isBulkEditContext(ctx) || isBulkEditScene(ctx)) {
        return true;
      }
      return typeof originalHide === 'function' ? originalHide(ctx) : !!originalHide;
    };
    wrappedHide.__bulkEditWrapped = true;
    quickCreateStep.setOptions({ hideInSettings: wrappedHide });
  }
}
//# sourceMappingURL=BulkEditFieldModel.js.map
