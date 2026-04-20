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
  text?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  disabled?: boolean;
  showDropdownIcon?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
interface ModelByIdProps {
  uid: string;
  modelClassName: string;
  text?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  disabled?: boolean;
  showDropdownIcon?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
type FlowsDropdownButtonProps = ModelProvidedProps | ModelByIdProps;
/**
 * 可自定义的下拉菜单触发按钮组件
 * 支持两种使用方式：
 * 1. 直接提供model: <FlowsDropdownButton model={myModel} />
 * 2. 通过uid和modelClassName获取model: <FlowsDropdownButton uid="model1" modelClassName="MyModel" />
 *
 * 菜单结构：按flow分组显示steps
 */
export declare const FlowsDropdownButton: React.FC<FlowsDropdownButtonProps>;
export {};
