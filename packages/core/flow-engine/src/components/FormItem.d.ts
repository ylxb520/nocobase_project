/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import type { FormItemProps } from 'antd';
type ChildExtraProps = Record<string, any>;
interface ExtendedFormItemProps extends FormItemProps {
  labelWidth?: number | string;
  labelWrap?: boolean;
  showLabel?: boolean;
}
export declare const FormItem: ({
  children,
  showLabel,
  labelWidth,
  ...rest
}: ExtendedFormItemProps & ChildExtraProps) => React.JSX.Element;
export {};
