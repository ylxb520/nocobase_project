/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowModel } from '../models';
import { ToolbarItemConfig } from '../types';
export interface FlowModelRendererProps {
  model?: FlowModel;
  uid?: string;
  fallback?: React.ReactNode;
  key?: React.Key;
  /** 是否显示流程设置入口（如按钮、菜单等） */
  showFlowSettings?:
    | boolean
    | {
        showBackground?: boolean;
        showBorder?: boolean;
        showDragHandle?: boolean;
        /** 自定义工具栏样式 */
        style?: React.CSSProperties;
        /**
         * @default 'inside'
         */
        toolbarPosition?: 'inside' | 'above' | 'below';
      };
  /** 流程设置的交互风格 */
  flowSettingsVariant?: 'dropdown' | 'contextMenu' | 'modal' | 'drawer';
  /** 是否在设置中隐藏移除按钮 */
  hideRemoveInSettings?: boolean;
  /** 是否在边框左上角显示模型title，默认 false */
  showTitle?: boolean;
  /** 传递给 beforeRender 事件的运行时参数 */
  inputArgs?: Record<string, any>;
  /** 是否在最外层包装 FlowErrorFallback 组件，默认 false */
  showErrorFallback?: boolean;
  /** 设置菜单层级：1=仅当前模型(默认)，2=包含子模型 */
  settingsMenuLevel?: number;
  /** 额外的工具栏项目，仅应用于此实例 */
  extraToolbarItems?: ToolbarItemConfig[];
  useCache?: boolean;
}
/**
 * A React component responsible for rendering a FlowModel.
 * It delegates the actual rendering logic to the `render` method of the provided model.
 *
 * @param {FlowModelRendererProps} props - The component's props.
 * @param {FlowModel} props.model - The FlowModel instance to render.
 * @param {string} props.uid - The unique identifier for the flow model.
 * @param {boolean} props.showFlowSettings - Whether to show flow settings entry (buttons, menus, etc.).
 * @param {string} props.flowSettingsVariant - The interaction style for flow settings.
 * @param {boolean} props.hideRemoveInSettings - Whether to hide remove button in settings.
 * @param {boolean} props.showTitle - Whether to show model title in the top-left corner of the border.
 * @param {any} props.inputArgs - Runtime arguments to pass to beforeRender event flows.
 * @param {number} props.settingsMenuLevel - Settings menu levels: 1=current model only (default), 2=include sub-models.
 * @param {ToolbarItemConfig[]} props.extraToolbarItems - Extra toolbar items to add to this renderer instance.
 * @returns {React.ReactNode | null} The rendered output of the model, or null if the model or its render method is invalid.
 */
export declare const FlowModelRenderer: React.FC<FlowModelRendererProps>;
export declare const MemoFlowModelRenderer: React.NamedExoticComponent<FlowModelRendererProps>;
