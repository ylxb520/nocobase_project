/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BlockSceneEnum, CollectionBlockModel } from '@nocobase/client';
import { MultiRecordResource } from '@nocobase/flow-engine';
import React from 'react';
import { tExpr } from '../locale';
export class ManyRecordBlockModel extends CollectionBlockModel {
  static scene = BlockSceneEnum.many;
  createResource() {
    return this.context.createResource(MultiRecordResource);
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
        React.createElement('strong', null, 'ManyRecordBlockModel'),
        '.',
      ),
      React.createElement('pre', null, JSON.stringify(this.resource.getData(), null, 2)),
    );
  }
}
ManyRecordBlockModel.define({
  label: tExpr('Many records'),
});
//# sourceMappingURL=ManyRecordBlockModel.js.map
