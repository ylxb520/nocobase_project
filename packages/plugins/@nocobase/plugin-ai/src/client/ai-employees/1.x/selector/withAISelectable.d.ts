/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
type SelectType = 'block' | 'field' | 'form';
export declare function withAISelectable<T = any>(
  WrappedComponent: React.ComponentType,
  options: {
    selectType: SelectType;
  },
): React.FunctionComponent<T>;
export {};
