/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
interface LoadCollectionProps {
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  [key: string]: any;
}
export declare const LoadCollection: React.FC<LoadCollectionProps>;
export default LoadCollection;
