/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Selector } from '../../types';
export declare const AISelectionContext: React.Context<{
  selectable: string;
  selector?: Selector;
  startSelect: (selectType: string, selector?: Selector) => void;
  stopSelect: () => void;
  collect: (uid: string, key: string, value: any) => void;
  ctx: {
    [key: string]: Record<string, any>;
  };
}>;
export declare const useAISelectionContext: () => {
  selectable: string;
  selector?: Selector;
  startSelect: (selectType: string, selector?: Selector) => void;
  stopSelect: () => void;
  collect: (uid: string, key: string, value: any) => void;
  ctx: {
    [key: string]: Record<string, any>;
  };
};
export declare const AISelectionProvider: React.FC<{
  children: React.ReactNode;
}>;
