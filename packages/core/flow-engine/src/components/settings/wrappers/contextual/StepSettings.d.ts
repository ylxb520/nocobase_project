/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { StepSettingsProps } from '../../../../types';
import { openStepSettingsDialog } from './StepSettingsDialog';
import { openStepSettingsDrawer } from './StepSettingsDrawer';
/**
 * 统一的步骤设置入口函数
 * 根据步骤的 uiMode 配置自动选择使用 Dialog 或 Drawer
 * @param props.model 模型实例
 * @param props.flowKey 流程Key
 * @param props.stepKey 步骤Key
 * @param props.width 对话框/抽屉宽度，默认为600
 * @param props.title 自定义标题，默认使用step的title
 * @returns Promise<any> 返回表单提交的值
 */
declare const openStepSettings: ({ model, flowKey, stepKey, width, title }: StepSettingsProps) => Promise<any>;
export { openStepSettings, openStepSettingsDialog, openStepSettingsDrawer };
