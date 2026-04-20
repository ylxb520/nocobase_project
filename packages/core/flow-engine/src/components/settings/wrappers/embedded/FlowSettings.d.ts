/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowModel } from '../../../../models';
interface ModelProvidedProps {
  model: FlowModel;
  flowKey: string;
}
interface ModelByIdProps {
  uid: string;
  flowKey: string;
  modelClassName: string;
}
type FlowSettingsProps = ModelProvidedProps | ModelByIdProps;
/**
 * FlowSettings组件 - 单个流程的详细配置表单（embedded版本）
 *
 * 特点：
 * - 实时保存到model
 * - 适用于嵌入式配置界面
 *
 * 支持两种使用方式：
 * 1. 直接提供model: <FlowSettings model={myModel} flowKey="workflow1" />
 * 2. 通过uid和modelClassName获取model: <FlowSettings uid="model1" modelClassName="MyModel" flowKey="workflow1" />
 */
declare const FlowSettings: React.FC<FlowSettingsProps>;
export { FlowSettings };
