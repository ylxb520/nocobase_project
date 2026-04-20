/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { CollectionOptions, Fields, Sort } from '@nocobase/database';
import type { FilterGroupType } from '@nocobase/utils';
declare const _default: CollectionOptions;
export default _default;
export type AIContextDatasource = {
  id: string;
  title: string;
  description: string;
  datasource: string;
  collectionName: string;
  fields?: Fields;
  appends?: string[];
  filter?: FilterGroupType;
  sort?: Sort[];
  limit: number;
  enabled: boolean;
};
