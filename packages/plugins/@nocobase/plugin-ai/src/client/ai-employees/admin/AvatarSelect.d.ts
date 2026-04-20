/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
export declare const Avatar: React.FC<{
  srcs: [string, string][];
  size?: 'small' | 'large';
  selectable?: boolean;
  highlightItem?: string;
  onClick?: (name: string) => void;
}>;
export declare const AvatarSelect: React.FC<{
  disabled?: boolean;
}>;
