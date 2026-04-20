/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Alert, Space } from 'antd';
import { css } from '@emotion/css';
import { useFlowModelById } from '../../../../hooks';
import { useFlowEngine } from '../../../../provider';
import { getT } from '../../../../utils';
import { useFlowContext } from '../../../..';
import { observer } from '../../../../reactive';
// 检测DOM中直接子元素是否包含button元素的辅助函数
const detectButtonInDOM = (container) => {
  if (!container) return false;
  // 只检测直接子元素中的button
  const directChildren = container.children;
  for (let i = 0; i < directChildren.length; i++) {
    const child = directChildren[i];
    // 检查是否是button元素或具有button特征的元素
    if (child.tagName === 'BUTTON' || child.getAttribute('role') === 'button' || child.classList.contains('ant-btn')) {
      return true;
    }
  }
  return false;
};
// 渲染工具栏项目的辅助函数
const renderToolbarItems = (
  model,
  showDeleteButton,
  showCopyUidButton,
  flowEngine,
  settingsMenuLevel,
  extraToolbarItems,
) => {
  const toolbarItems = flowEngine?.flowSettings?.getToolbarItems?.() || [];
  // 合并额外的工具栏项目
  const allToolbarItems = [...toolbarItems, ...(extraToolbarItems || [])];
  // 按 sort 字段排序
  allToolbarItems.sort((a, b) => (a.sort || 0) - (b.sort || 0)).reverse();
  return allToolbarItems
    .filter((itemConfig) => {
      // 检查项目是否应该显示
      return itemConfig.visible ? itemConfig.visible(model) : true;
    })
    .map((itemConfig) => {
      // 渲染项目组件
      const ItemComponent = itemConfig.component;
      // 对于默认设置项目，传递额外的 props
      if (itemConfig.key === 'settings-menu') {
        return React.createElement(ItemComponent, {
          key: itemConfig.key,
          model: model,
          id: model.uid,
          showDeleteButton: showDeleteButton,
          showCopyUidButton: showCopyUidButton,
          menuLevels: settingsMenuLevel,
        });
      }
      // 其他项目只传递 model
      return React.createElement(ItemComponent, { key: itemConfig.key, model: model });
    });
};
// Width in pixels per toolbar item (icon width + spacing)
const TOOLBAR_ITEM_WIDTH = 19;
const toolbarPositionToCSS = {
  inside: `
    top: 2px;
  `,
  above: `
    top: 0px;
    transform: translateY(-100%);
    padding-bottom: 0px;
    margin-bottom: -2px;
  `,
  below: `
    top: 0px;
    transform: translateY(100%);
    padding-top: 2px;
    margin-top: -2px;
  `,
};
// 使用与 NocoBase 一致的悬浮工具栏样式
const floatContainerStyles = ({ showBackground, showBorder, ctx, toolbarPosition = 'inside', toolbarCount }) => css`
  position: relative;

  /* 当检测到button时使用inline-block */
  &.has-button-child {
    display: inline-block;
  }

  /* 正常的hover行为 - 添加延迟显示 */
  &:hover > .nb-toolbar-container {
    opacity: 1;
    transition-delay: 0.1s;

    .nb-toolbar-container-icons {
      display: block;
    }
  }

  /* 当有.hide-parent-menu类时隐藏菜单 */
  &.hide-parent-menu > .nb-toolbar-container {
    opacity: 0 !important;
  }

  > .nb-toolbar-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    opacity: 0;
    background: ${showBackground ? 'var(--colorBgSettingsHover)' : ''};
    border: ${showBorder ? '2px solid var(--colorBorderSettingsHover)' : ''};
    border-radius: ${ctx.themeToken.borderRadiusLG}px;
    pointer-events: none;
    min-width: ${TOOLBAR_ITEM_WIDTH * toolbarCount}px;

    &.nb-in-template {
      background: var(--colorTemplateBgSettingsHover);
    }

    > .nb-toolbar-container-title {
      pointer-events: none;
      position: absolute;
      font-size: 12px;
      padding: 0;
      line-height: 16px;
      height: 16px;
      border-bottom-right-radius: 2px;
      border-radius: 2px;
      top: 2px;
      left: 2px;
      display: flex;
      align-items: center;
      gap: 4px;

      .title-tag {
        padding: 0 3px;
        border-radius: 2px;
        background: var(--colorSettings);
        color: #fff;
        display: inline-flex;
      }
    }

    > .nb-toolbar-container-icons {
      display: none; // 防止遮挡其它 icons
      position: absolute;
      right: 2px;
      ${toolbarPositionToCSS[toolbarPosition] || ''}
      line-height: 16px;
      pointer-events: all;

      .ant-space-item {
        background-color: var(--colorSettings);
        color: #fff;
        line-height: 16px;
        width: 16px;
        height: 16px;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    /* 拖拽把手样式 - 参考 AirTable 样式 */
    > .resize-handle {
      position: absolute;
      pointer-events: all;
      background: var(--colorSettings);
      opacity: 0.6;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        opacity: 0.9;
        background: var(--colorSettingsHover, var(--colorSettings));
      }

      &::before {
        content: '';
        position: absolute;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
      }

      &::after {
        content: '';
        position: absolute;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
      }
    }

    > .resize-handle-left {
      left: -4px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 20px;
      cursor: ew-resize;

      &::before {
        width: 2px;
        height: 2px;
        top: 6px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0 4px 0 rgba(255, 255, 255, 0.9), 0 8px 0 rgba(255, 255, 255, 0.9);
      }
    }

    > .resize-handle-right {
      right: -4px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 20px;
      cursor: ew-resize;

      &::before {
        width: 2px;
        height: 2px;
        top: 6px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0 4px 0 rgba(255, 255, 255, 0.9), 0 8px 0 rgba(255, 255, 255, 0.9);
      }
    }

    > .resize-handle-bottom {
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 6px;
      cursor: ns-resize;

      &::before {
        width: 2px;
        height: 2px;
        left: 6px;
        top: 50%;
        transform: translateY(-50%);
        box-shadow: 4px 0 0 rgba(255, 255, 255, 0.9), 8px 0 0 rgba(255, 255, 255, 0.9);
      }
    }
  }
`;
// 判断是否是通过ID获取模型的props
const isModelByIdProps = (props) => {
  return 'uid' in props && 'modelClassName' in props && Boolean(props.uid) && Boolean(props.modelClassName);
};
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
const FlowsFloatContextMenu = observer((props) => {
  const ctx = useFlowContext();
  // Only render if flowSettings is enabled
  if (!ctx.flowSettingsEnabled) {
    return React.createElement(React.Fragment, null, props.children);
  }
  if (isModelByIdProps(props)) {
    return React.createElement(FlowsFloatContextMenuWithModelById, { ...props });
  } else {
    return React.createElement(FlowsFloatContextMenuWithModel, { ...props });
  }
});
const ResizeHandles = (props) => {
  const isDraggingRef = useRef(false);
  const dragTypeRef = useRef(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const { onDragStart, onDragEnd } = props;
  // 拖拽移动处理函数
  const handleDragMove = useCallback(
    (e) => {
      if (!isDraggingRef.current || !dragTypeRef.current) return;
      const deltaX = e.clientX - dragStartPosRef.current.x;
      const deltaY = e.clientY - dragStartPosRef.current.y;
      let resizeDistance = 0;
      switch (dragTypeRef.current) {
        case 'left':
          // 左侧把手：向左拖为正数，向右拖为负数
          resizeDistance = -deltaX;
          props.model.parent.emitter.emit('onResizeLeft', { resizeDistance, model: props.model });
          break;
        case 'right':
          // 右侧把手：向右拖为正数，向左拖为负数
          resizeDistance = deltaX;
          props.model.parent.emitter.emit('onResizeRight', { resizeDistance, model: props.model });
          break;
        case 'bottom':
          // 底部把手：向下拖为正数，向上拖为负数
          resizeDistance = deltaY;
          props.model.parent.emitter.emit('onResizeBottom', { resizeDistance, model: props.model });
          break;
        case 'corner': {
          // 右下角把手：同时计算宽度和高度变化
          const widthDelta = deltaX;
          const heightDelta = deltaY;
          props.model.parent.emitter.emit('onResizeCorner', { widthDelta, heightDelta, model: props.model });
          break;
        }
      }
    },
    [props.model],
  );
  // 拖拽结束处理函数
  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    dragTypeRef.current = null;
    dragStartPosRef.current = { x: 0, y: 0 };
    // 移除全局事件监听
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    props.model.parent.emitter.emit('onResizeEnd');
    onDragEnd?.();
  }, [handleDragMove, props.model, onDragEnd]);
  // 拖拽开始处理函数
  const handleDragStart = useCallback(
    (e, type) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      dragTypeRef.current = type;
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      // 添加全局事件监听
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      onDragStart?.();
    },
    [handleDragMove, handleDragEnd, onDragStart],
  );
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('div', {
      className: 'resize-handle resize-handle-left',
      title: '\u62D6\u62FD\u8C03\u8282\u5BBD\u5EA6',
      onMouseDown: (e) => handleDragStart(e, 'left'),
    }),
    React.createElement('div', {
      className: 'resize-handle resize-handle-right',
      title: '\u62D6\u62FD\u8C03\u8282\u5BBD\u5EA6',
      onMouseDown: (e) => handleDragStart(e, 'right'),
    }),
  );
};
// 使用传入的model
const FlowsFloatContextMenuWithModel = observer(
  ({
    model,
    children,
    enabled = true,
    showDeleteButton = true,
    showCopyUidButton = true,
    containerStyle,
    className,
    showBackground = true,
    showBorder = true,
    showTitle = false,
    showDragHandle = false,
    settingsMenuLevel,
    extraToolbarItems,
    toolbarStyle,
    toolbarPosition = 'inside',
  }) => {
    const [hideMenu, setHideMenu] = useState(false);
    const [hasButton, setHasButton] = useState(false);
    const containerRef = useRef(null);
    const flowEngine = useFlowEngine();
    const [style, setStyle] = useState({});
    const toolbarContainerRef = useRef(null);
    const toolbarContainerStyle = useMemo(() => ({ ...toolbarStyle, ...style }), [style, toolbarStyle]);
    // 检测DOM中是否包含button元素
    useEffect(() => {
      if (containerRef.current) {
        const hasButtonElement = detectButtonInDOM(containerRef.current);
        setHasButton(hasButtonElement);
      }
    }, [children]); // 当children变化时重新检测
    // 使用MutationObserver监听DOM变化
    useEffect(() => {
      if (!containerRef.current) return;
      const observer = new MutationObserver(() => {
        if (containerRef.current) {
          const hasButtonElement = detectButtonInDOM(containerRef.current);
          setHasButton(hasButtonElement);
        }
      });
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'role'],
      });
      return () => {
        observer.disconnect();
      };
    }, []);
    const handleChildHover = useCallback((e) => {
      const target = e.target;
      const childWithMenu = target.closest('[data-has-float-menu]');
      // 如果悬浮的是子元素（且不是当前容器），则隐藏当前菜单
      if (childWithMenu && childWithMenu !== containerRef.current) {
        setHideMenu(true);
      } else {
        setHideMenu(false);
      }
    }, []);
    if (!model) {
      const t = getT(model || {});
      return React.createElement(Alert, { message: t('Invalid model provided'), type: 'error' });
    }
    // 如果未启用或没有children，直接返回children
    if (!enabled || !children) {
      return React.createElement(React.Fragment, null, children);
    }
    return React.createElement(
      'div',
      {
        ref: containerRef,
        className: `${floatContainerStyles({
          showBackground,
          showBorder,
          ctx: model.context,
          toolbarPosition,
          toolbarCount: getToolbarCount(flowEngine, extraToolbarItems),
        })} ${hideMenu ? 'hide-parent-menu' : ''} ${hasButton ? 'has-button-child' : ''} ${className || ''}`,
        style: containerStyle,
        'data-has-float-menu': 'true',
        onMouseMove: handleChildHover,
      },
      children,
      React.createElement(
        'div',
        { ref: toolbarContainerRef, className: 'nb-toolbar-container', style: toolbarContainerStyle },
        showTitle &&
          (model.title || model.extraTitle) &&
          React.createElement(
            'div',
            { className: 'nb-toolbar-container-title' },
            model.title && React.createElement('span', { className: 'title-tag' }, model.title),
            model.extraTitle && React.createElement('span', { className: 'title-tag' }, model.extraTitle),
          ),
        React.createElement(
          'div',
          {
            className: 'nb-toolbar-container-icons',
            onClick: (e) => e.stopPropagation(),
            onMouseDown: (e) => e.stopPropagation(),
            onMouseMove: (e) => e.stopPropagation(),
          },
          React.createElement(
            Space,
            { size: 3, align: 'center' },
            renderToolbarItems(
              model,
              showDeleteButton,
              showCopyUidButton,
              flowEngine,
              settingsMenuLevel,
              extraToolbarItems,
            ),
          ),
        ),
        showDragHandle &&
          React.createElement(ResizeHandles, {
            model: model,
            onDragStart: () => setStyle({ opacity: 1 }),
            onDragEnd: () => setStyle({}),
          }),
      ),
    );
  },
  {
    displayName: 'FlowsFloatContextMenuWithModel',
  },
);
// 通过useModelById hook获取model
const FlowsFloatContextMenuWithModelById = observer(
  ({
    uid,
    modelClassName,
    children,
    enabled = true,
    showDeleteButton = true,
    showCopyUidButton = true,
    containerStyle,
    className,
    showTitle = false,
    settingsMenuLevel,
    extraToolbarItems: extraToolbarItems,
    toolbarPosition,
  }) => {
    const model = useFlowModelById(uid, modelClassName);
    const flowEngine = useFlowEngine();
    if (!model) {
      return React.createElement(Alert, {
        message: flowEngine.translate('Model with ID {{uid}} not found', { uid }),
        type: 'error',
      });
    }
    return React.createElement(
      FlowsFloatContextMenuWithModel,
      {
        model: model,
        enabled: enabled,
        showDeleteButton: showDeleteButton,
        showCopyUidButton: showCopyUidButton,
        containerStyle: containerStyle,
        className: className,
        showTitle: showTitle,
        settingsMenuLevel: settingsMenuLevel,
        extraToolbarItems: extraToolbarItems,
        toolbarPosition: toolbarPosition,
      },
      children,
    );
  },
  {
    displayName: 'FlowsFloatContextMenuWithModelById',
  },
);
export { FlowsFloatContextMenu };
function getToolbarCount(flowEngine, extraToolbarItems) {
  const toolbarItems = flowEngine?.flowSettings?.getToolbarItems?.() || [];
  const allToolbarItems = [...toolbarItems, ...(extraToolbarItems || [])];
  return allToolbarItems.length;
}
//# sourceMappingURL=FlowsFloatContextMenu.js.map
