/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BlockSceneEnum, CollectionBlockModel } from '@nocobase/client';
import { SingleRecordResource } from '@nocobase/flow-engine';
import React from 'react';
import { tExpr } from '../locale';
export class OneRecordBlockModel extends CollectionBlockModel {
  static scene = BlockSceneEnum.one;
  createResource() {
    return this.context.createResource(SingleRecordResource);
  }
  get resource() {
    return this.context.resource;
  }
  renderComponent() {
    return React.createElement(
      'div',
      null,
      React.createElement('h1', null, 'Hello, NocoBase!'),
      React.createElement(
        'p',
        null,
        'This is a simple block rendered by ',
        React.createElement('strong', null, 'OneRecordBlockModel'),
        '.',
      ),
      React.createElement('pre', null, JSON.stringify(this.resource.getData(), null, 2)),
    );
  }
}
OneRecordBlockModel.define({
  label: tExpr('One record'),
});
//# sourceMappingURL=OneRecordBlockModel.js.map
