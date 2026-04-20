/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { FC } from 'react';
import { FallbackProps } from 'react-error-boundary';
/**
 * 简化版的错误回退组件，专为 flow-engine 设计
 * 保持与原始 ErrorFallback 相同的样式和结构
 */
export declare const FlowErrorFallback: FC<FallbackProps> & {
  Modal: FC<
    FallbackProps & {
      children?: React.ReactNode;
    }
  >;
};
/**
 * 模态框版本的错误回退组件
 */
export declare const FlowErrorFallbackModal: FC<
  FallbackProps & {
    children?: React.ReactNode;
  }
>;
