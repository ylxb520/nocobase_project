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
  children?: React.ReactNode;
  enabled?: boolean;
  position?: 'right' | 'left';
  showDeleteButton?: boolean;
}
interface ModelByIdProps {
  uid: string;
  modelClassName: string;
  children?: React.ReactNode;
  enabled?: boolean;
  position?: 'right' | 'left';
  showDeleteButton?: boolean;
}
type FlowsContextMenuProps = ModelProvidedProps | ModelByIdProps;
/**
 * FlowsContextMenu组件 - 右键菜单组件
 *
 * 功能特性：
 * - 右键菜单
 * - Wrapper 模式支持
 * - 删除功能
 * - 按flow分组显示steps
 *
 * 支持两种使用方式：
 * 1. 直接提供model: <FlowsContextMenu model={myModel}>{children}</FlowsContextMenu>
 * 2. 通过uid和modelClassName获取model: <FlowsContextMenu uid="model1" modelClassName="MyModel">{children}</FlowsContextMenu>
 *
 * @param props.children 子组件，必须提供
 * @param props.enabled 是否启用右键菜单，默认为true
 * @param props.position 右键菜单位置，默认为right
 * @param props.showDeleteButton 是否显示删除按钮，默认为true
 */
declare const FlowsContextMenu: React.FC<FlowsContextMenuProps>;
export { FlowsContextMenu };
