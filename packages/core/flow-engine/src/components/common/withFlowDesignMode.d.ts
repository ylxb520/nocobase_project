/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
/**
 * 高阶组件：仅在设计模式启用时渲染子组件
 *
 * @param WrappedComponent 要包装的组件
 * @returns 包装后的组件，只在 flowSettingsEnabled 为 true 时渲染
 *
 * @example
 * ```tsx
 * const MyComponent = withFlowDesignMode(({ model, ...props }) => {
 *   // 这些计算只在设计模式启用时才会执行
 *   const expensiveData = useMemo(() => complexCalculation(), []);
 *
 *   return <div>{expensiveData}</div>;
 * });
 * ```
 */
export declare function withFlowDesignMode<P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>,
): React.MemoExoticComponent<import('@formily/reactive-react').ReactFC<React.PropsWithoutRef<P>>>;
