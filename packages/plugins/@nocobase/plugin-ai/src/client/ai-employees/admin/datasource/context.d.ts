/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="react" />
import { Collection } from '@nocobase/flow-engine';
export declare class CurrentCollection {
  readonly collection: Collection;
  constructor(collection: Collection);
  get displayName(): string;
}
export declare const CollectionContext: import('react').Context<CurrentCollection>;
export declare const useCollectionContext: () => CurrentCollection;
