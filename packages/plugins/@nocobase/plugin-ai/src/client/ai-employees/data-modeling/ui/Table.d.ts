/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { CollectionDataType, FieldDataType } from '../types';
export declare const Table: React.FC<{
  collections: any[];
  updateCollectionRecord: (collectionIndex: number, collection: CollectionDataType) => Promise<void>;
  updateFieldRecord: (collectionIndex: number, fieldIndex: number, field: FieldDataType) => Promise<void>;
}>;
