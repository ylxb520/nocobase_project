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
import { ToolbarItemConfig } from '../../../../types';
interface ModelProvidedProps {
  model: FlowModel<any>;
  children?: React.ReactNode;
  enabled?: boolean;
  showDeleteButton?: boolean;
  showCopyUidButton?: boolean;
  containerStyle?: React.CSSProperties;
  toolbarStyle?: React.CSSProperties;
  className?: string;
  /**
   * @default true
   */
  showBorder?: boolean;
  /**
   * @default true
   */
  showBackground?: boolean;
  /**
   * @default false
   */
  showTitle?: boolean;
  /**
   * @default false
   */
  showDragHandle?: boolean;
  /**
   * Settings menu levels: 1=current model only (default), 2=include sub-models
   */
  settingsMenuLevel?: number;
  /**
   * Extra toolbar items to add to this context menu instance
   */
  extraToolbarItems?: ToolbarItemConfig[];
  /**
   * @default 'inside'
   */
  toolbarPosition?: 'inside' | 'above' | 'below';
}
interface ModelByIdProps {
  uid: string;
  modelClassName: string;
  children?: React.ReactNode;
  enabled?: boolean;
  showDeleteButton?: boolean;
  showCopyUidButton?: boolean;
  containerStyle?: React.CSSProperties;
  className?: string;
  /**
   * @default true
   */
  showBorder?: boolean;
  /**
   * @default true
   */
  showBackground?: boolean;
  /**
   * @default false
   */
  showTitle?: boolean;
  /**
   * Settings menu levels: 1=current model only (default), 2=include sub-models
   */
  settingsMenuLevel?: number;
  /**
   * Extra toolbar items to add to this context menu instance
   */
  extraToolbarItems?: ToolbarItemConfig[];
  /**
   * @default 'inside'
   */
  toolbarPosition?: 'inside' | 'above' | 'below';
}
type FlowsFloatContextMenuProps = ModelProvidedProps | ModelByIdProps;
/**
 * FlowsFloatContextMenu组件 - 悬浮配置图标组件
 *
 * 功能特性：
 * - 鼠标悬浮显示右上角配置图标
 * - 点击图标显示配置菜单
 * - 支持删除功能
 * - Wrapper 模式支持
 * - 使用与 NocoBase x-settings 一致的样式
 * - 按flow分组显示steps
 *
 * 支持两种使用方式：
 * 1. 直接提供model: <FlowsFloatContextMenu model={myModel}>{children}</FlowsFloatContextMenu>
 * 2. 通过uid和modelClassName获取model: <FlowsFloatContextMenu uid="model1" modelClassName="MyModel">{children}</FlowsFloatContextMenu>
 *
 * @param props.children 子组件，必须提供
 * @param props.enabled 是否启用悬浮菜单，默认为true
 * @param props.showDeleteButton 是否显示删除按钮，默认为true
 * @param props.showCopyUidButton 是否显示复制UID按钮，默认为true
 * @param props.containerStyle 容器自定义样式
 * @param props.className 容器自定义类名
 * @param props.showTitle 是否在边框左上角显示模型title，默认为false
 * @param props.settingsMenuLevel 设置菜单层级：1=仅当前模型(默认)，2=包含子模型
 * @param props.extraToolbarItems 额外的工具栏项目，仅应用于此实例
 */
declare const FlowsFloatContextMenu: React.FC<FlowsFloatContextMenuProps>;
export { FlowsFloatContextMenu };
