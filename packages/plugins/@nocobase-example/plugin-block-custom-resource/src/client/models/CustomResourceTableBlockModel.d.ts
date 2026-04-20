/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BlockModel } from '@nocobase/client';
import { SingleRecordResource } from '@nocobase/flow-engine';
import React from 'react';
export declare class CustomBlockWithResourceModel extends BlockModel {
  createResource(): SingleRecordResource<unknown>;
  get resource(): SingleRecordResource<any>;
  onInit(options: any): void;
  renderComponent(): React.JSX.Element;
}
