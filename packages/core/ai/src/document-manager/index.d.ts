/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Document, DocumentOptions, IndexOptions } from 'flexsearch';
import { Index } from './search-index';
export declare class DocumentManager {
  indexes: Map<string, Index>;
  documents: Map<string, Document>;
  addIndex(name: string, options?: IndexOptions): Index;
  getIndex(name: string): Index | undefined;
  addDocument(name: string, options?: DocumentOptions): Document<import('flexsearch').DocumentData, false, false>;
  getDocument(name: string): Document | undefined;
}
export { Index as FlexSearchIndex } from 'flexsearch';
