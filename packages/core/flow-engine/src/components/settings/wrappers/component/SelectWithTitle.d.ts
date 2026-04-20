/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
export interface SelectWithTitleProps {
  title?: any;
  getDefaultValue?: any;
  options?: any;
  fieldNames?: any;
  itemKey?: string;
  onChange?: (...args: any[]) => void;
  dropdownRender?: any;
}
export declare function SelectWithTitle({
  title,
  getDefaultValue,
  onChange,
  options,
  fieldNames,
  itemKey,
  ...others
}: SelectWithTitleProps): React.JSX.Element;
