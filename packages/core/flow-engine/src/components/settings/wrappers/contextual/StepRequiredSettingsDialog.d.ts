/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowModel } from '../../../../models';
/**
 * 分步表单对话框的属性接口
 */
export interface StepFormDialogProps {
  model: FlowModel;
  dialogWidth?: number | string;
  dialogTitle?: string;
}
/**
 * StepFormDialog组件 - 使用 FormDialog 和 FormStep 显示所有需要配置参数的步骤
 * @param props.model 模型实例
 * @param props.dialogWidth 对话框宽度，默认为800
 * @param props.dialogTitle 自定义对话框标题，默认为"步骤参数配置"
 * @returns Promise<any> 返回表单提交的值
 */
declare const openRequiredParamsStepFormDialog: ({
  model,
  dialogWidth,
  dialogTitle,
}: StepFormDialogProps) => Promise<any>;
export { openRequiredParamsStepFormDialog };
