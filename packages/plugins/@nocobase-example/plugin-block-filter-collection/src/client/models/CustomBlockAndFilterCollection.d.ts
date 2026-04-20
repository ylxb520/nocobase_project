/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CollectionBlockModel } from '@nocobase/client';
import { MultiRecordResource } from '@nocobase/flow-engine';
import React from 'react';
export declare class CustomBlockAndFilterCollection extends CollectionBlockModel {
  static scene: import('@nocobase/client').BlockSceneType;
  static filterCollection(collection: any): boolean;
  createResource(): MultiRecordResource<unknown>;
  get resource(): MultiRecordResource<any>;
  renderComponent(): React.JSX.Element;
}
