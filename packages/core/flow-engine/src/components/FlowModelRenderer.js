/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 *
 * @example
 * // 基本使用
 * <FlowModelRenderer model={myModel} />
 *
 * // 显示设置但隐藏删除按钮
 * <FlowModelRenderer
 *   model={myModel}
 *   showFlowSettings={true}
 *   hideRemoveInSettings={true}
 * />
 *
 * // 显示设置和title
 * <FlowModelRenderer
 *   model={myModel}
 *   showFlowSettings={true}
 *   showTitle={true}
 * />
 *
 * // 使用右键菜单模式并隐藏删除按钮
 * <FlowModelRenderer
 *   model={myModel}
 *   showFlowSettings={true}
 *   flowSettingsVariant="contextMenu"
 *   hideRemoveInSettings={true}
 * />
 */
import _ from 'lodash';
import React, { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FlowModelProvider, useApplyAutoFlows } from '../hooks';
import { getAutoFlowError, setAutoFlowError } from '../utils';
import { FlowErrorFallback } from './FlowErrorFallback';
import { FlowsContextMenu } from './settings/wrappers/contextual/FlowsContextMenu';
import { FlowsFloatContextMenu } from './settings/wrappers/contextual/FlowsFloatContextMenu';
import { observer } from '../reactive';
/**
 * 内部组件：带有 useApplyAutoFlows 的渲染器
 */
const FlowModelRendererWithAutoFlows = observer(
  ({
    model,
    showFlowSettings,
    flowSettingsVariant,
    hideRemoveInSettings,
    showTitle,
    inputArgs,
    showErrorFallback,
    settingsMenuLevel,
    extraToolbarItems,
    fallback,
  }) => {
    // hidden 占位由模型自身处理；无需在此注入
    const { loading: pending, error: autoFlowsError } = useApplyAutoFlows(model, inputArgs, {
      throwOnError: false,
      useCache: model.context.useCache,
    });
    // 将错误下沉到 model 实例上，供内容层读取（类型安全的 WeakMap 存储）
    setAutoFlowError(model, autoFlowsError || null);
    if (pending) {
      return React.createElement(React.Fragment, null, fallback);
    }
    return React.createElement(
      FlowModelProvider,
      { model: model },
      React.createElement(FlowModelRendererCore, {
        model: model,
        showFlowSettings: showFlowSettings,
        flowSettingsVariant: flowSettingsVariant,
        hideRemoveInSettings: hideRemoveInSettings,
        showTitle: showTitle,
        showErrorFallback: showErrorFallback,
        settingsMenuLevel: settingsMenuLevel,
        extraToolbarItems: extraToolbarItems,
      }),
    );
  },
);
// 移除不带 beforeRender 执行的渲染器，统一触发 beforeRender 事件
/**
 * 核心渲染逻辑组件
 */
const FlowModelRendererCore = observer(
  ({
    model,
    showFlowSettings,
    flowSettingsVariant,
    hideRemoveInSettings,
    showTitle,
    showErrorFallback,
    settingsMenuLevel,
    extraToolbarItems,
  }) => {
    const wrapWithErrorBoundary = (children) => {
      if (showErrorFallback) {
        return React.createElement(ErrorBoundary, { FallbackComponent: FlowErrorFallback }, children);
      }
      return children;
    };
    const ContentOrError = () => {
      const autoError = getAutoFlowError(model);
      if (autoError) {
        // 将 beforeRender 事件错误转化为内容区错误，由内层边界兜住
        throw autoError;
      }
      const rendered = model.render();
      // RenderFunction 模式：render 返回函数，作为组件类型渲染，避免函数作为子节点的警告
      if (typeof rendered === 'function') {
        return React.createElement(rendered);
      }
      return React.createElement(React.Fragment, null, rendered);
    };
    // 如果不显示流程设置，直接返回模型内容（可能包装 ErrorBoundary）
    // 当模型类或 use 变化时重挂载内容，规避组件内部状态残留
    const rawUse = model?.use;
    const resolvedName = model?.constructor?.name || model.uid;
    const contentKey = typeof rawUse === 'string' ? `${rawUse}:${model.uid}` : `${resolvedName}:${model.uid}`;
    if (!showFlowSettings) {
      return wrapWithErrorBoundary(
        React.createElement('div', { key: contentKey }, React.createElement(ContentOrError, null)),
      );
    }
    // 根据 flowSettingsVariant 包装相应的设置组件
    switch (flowSettingsVariant) {
      case 'dropdown':
        return React.createElement(
          FlowsFloatContextMenu,
          {
            showTitle: showTitle,
            model: model,
            showDeleteButton: !hideRemoveInSettings,
            showBackground: _.isObject(showFlowSettings) ? showFlowSettings.showBackground : undefined,
            showBorder: _.isObject(showFlowSettings) ? showFlowSettings.showBorder : undefined,
            showDragHandle: _.isObject(showFlowSettings) ? showFlowSettings.showDragHandle : undefined,
            settingsMenuLevel: settingsMenuLevel,
            extraToolbarItems: extraToolbarItems,
            toolbarStyle: _.isObject(showFlowSettings) ? showFlowSettings.style : undefined,
            toolbarPosition: _.isObject(showFlowSettings) ? showFlowSettings.toolbarPosition : undefined,
          },
          wrapWithErrorBoundary(
            React.createElement('div', { key: contentKey }, React.createElement(ContentOrError, null)),
          ),
        );
      case 'contextMenu':
        return React.createElement(
          FlowsContextMenu,
          { model: model, showDeleteButton: !hideRemoveInSettings },
          wrapWithErrorBoundary(
            React.createElement('div', { key: contentKey }, React.createElement(ContentOrError, null)),
          ),
        );
      case 'modal':
        // TODO: 实现 modal 模式的流程设置
        console.warn('FlowModelRenderer: modal variant is not implemented yet');
        return wrapWithErrorBoundary(React.createElement(ContentOrError, null));
      case 'drawer':
        // TODO: 实现 drawer 模式的流程设置
        console.warn('FlowModelRenderer: drawer variant is not implemented yet');
        return wrapWithErrorBoundary(React.createElement(ContentOrError, null));
      default:
        console.warn(
          `FlowModelRenderer: Unknown flowSettingsVariant '${flowSettingsVariant}', falling back to dropdown`,
        );
        return React.createElement(
          FlowsFloatContextMenu,
          {
            showTitle: showTitle,
            model: model,
            showDeleteButton: !hideRemoveInSettings,
            showBackground: _.isObject(showFlowSettings) ? showFlowSettings.showBackground : undefined,
            showBorder: _.isObject(showFlowSettings) ? showFlowSettings.showBorder : undefined,
            showDragHandle: _.isObject(showFlowSettings) ? showFlowSettings.showDragHandle : undefined,
            settingsMenuLevel: settingsMenuLevel,
            extraToolbarItems: extraToolbarItems,
            toolbarStyle: _.isObject(showFlowSettings) ? showFlowSettings.style : undefined,
            toolbarPosition: _.isObject(showFlowSettings) ? showFlowSettings.toolbarPosition : undefined,
          },
          wrapWithErrorBoundary(
            React.createElement('div', { key: contentKey }, React.createElement(ContentOrError, null)),
          ),
        );
    }
  },
  {
    displayName: 'FlowModelRendererCore',
  },
);
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
export const FlowModelRenderer = observer(
  ({
    model,
    fallback = null,
    showFlowSettings = false,
    flowSettingsVariant = 'dropdown',
    hideRemoveInSettings = false,
    showTitle = false,
    inputArgs,
    showErrorFallback = true,
    settingsMenuLevel,
    extraToolbarItems,
    useCache,
  }) => {
    useEffect(() => {
      if (model?.context) {
        model.context.defineProperty('useCache', {
          value: typeof useCache === 'boolean' ? useCache : model.context.useCache,
        });
      }
    }, [model?.context, useCache]);
    if (!model || typeof model.render !== 'function') {
      // 可以选择渲染 null 或者一个错误/提示信息
      console.warn('FlowModelRenderer: Invalid model or render method not found.', model);
      return null;
    }
    // 构建渲染内容：统一在渲染前触发 beforeRender 事件（带缓存）
    const content = React.createElement(FlowModelRendererWithAutoFlows, {
      model: model,
      showFlowSettings: showFlowSettings,
      flowSettingsVariant: flowSettingsVariant,
      hideRemoveInSettings: hideRemoveInSettings,
      showTitle: showTitle,
      inputArgs: inputArgs,
      showErrorFallback: showErrorFallback,
      settingsMenuLevel: settingsMenuLevel,
      extraToolbarItems: extraToolbarItems,
      fallback: fallback,
    });
    // 当需要错误回退时，将整体包裹在 ErrorBoundary 和 FlowModelProvider 中
    // 这样既能捕获 useApplyAutoFlows 中抛出的错误，也能在回退组件中获取 model 上下文
    if (showErrorFallback) {
      return React.createElement(
        FlowModelProvider,
        { model: model },
        React.createElement(ErrorBoundary, { FallbackComponent: FlowErrorFallback }, content),
      );
    }
    return content;
  },
);
// 为需要进一步优化渲染的场景提供一个 Memo 包装版本
// 仅在父级重渲且 props 浅比较未变时跳过渲染；不影响内部响应式更新
export const MemoFlowModelRenderer = React.memo(FlowModelRenderer);
MemoFlowModelRenderer.displayName = 'MemoFlowModelRenderer';
//# sourceMappingURL=FlowModelRenderer.js.map
