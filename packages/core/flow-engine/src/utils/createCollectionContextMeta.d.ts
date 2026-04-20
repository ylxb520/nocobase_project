/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { Collection } from '../data-source';
import type { PropertyMetaFactory } from '../flowContext';
export declare function createCollectionContextMeta(
  collectionOrFactory: Collection | (() => Collection | null),
  title?: string,
  includeNonFilterable?: boolean,
): PropertyMetaFactory;
