/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FC, ReactNode } from 'react';
interface MobilePopupProps {
  title?: string;
  visible: boolean;
  minHeight?: number | string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}
export declare const MobilePopup: FC<MobilePopupProps>;
export {};
