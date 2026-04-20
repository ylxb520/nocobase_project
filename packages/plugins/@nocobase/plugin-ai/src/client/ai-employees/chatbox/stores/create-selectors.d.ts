/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { StoreApi, UseBoundStore } from 'zustand';
type WithSelectors<S> = S extends {
  getState: () => infer T;
}
  ? S & {
      use: {
        [K in keyof T]: () => T[K];
      };
    }
  : never;
export declare const createSelectors: <S extends UseBoundStore<StoreApi<object>>>(_store: S) => WithSelectors<S>;
export {};
