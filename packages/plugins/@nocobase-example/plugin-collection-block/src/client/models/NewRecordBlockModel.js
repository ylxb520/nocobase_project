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
export class NewRecordBlockModel extends CollectionBlockModel {
  static scene = BlockSceneEnum.new;
  createResource() {
    const resource = this.context.createResource(SingleRecordResource);
    resource.isNewRecord = true;
    return resource;
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
        React.createElement('strong', null, 'NewRecordBlockModel'),
        '.',
      ),
    );
  }
}
NewRecordBlockModel.define({
  label: tExpr('New record'),
});
//# sourceMappingURL=NewRecordBlockModel.js.map
