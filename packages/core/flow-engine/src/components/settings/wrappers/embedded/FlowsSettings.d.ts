/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
interface ModelProvidedProps {
  model: any;
  expandAll?: boolean;
  children?: React.ReactNode;
}
interface ModelByIdProps {
  uid: string;
  modelClassName: string;
  expandAll?: boolean;
  children?: React.ReactNode;
}
type FlowsSettingsProps = ModelProvidedProps | ModelByIdProps;
/**
 * FlowsSettings组件 - 简单的流程配置界面
 *
 * 功能特性：
 * - 流程配置界面
 * - Wrapper 模式支持
 *
 * 支持两种使用方式：
 * 1. 直接提供model: <FlowsSettings model={myModel} />
 * 2. 通过uid和modelClassName获取model: <FlowsSettings uid="model1" modelClassName="MyModel" />
 *
 * 支持两种模式：
 * 1. 独立设置界面: <FlowsSettings model={myModel} />
 * 2. Wrapper模式: <FlowsSettings model={myModel}>{children}</FlowsSettings>
 *
 * @param props.expandAll 是否展开所有Collapse，默认为false
 * @param props.children 子组件，如果提供则作为wrapper模式
 */
declare const FlowsSettings: React.FC<FlowsSettingsProps>;
export { FlowsSettings };
