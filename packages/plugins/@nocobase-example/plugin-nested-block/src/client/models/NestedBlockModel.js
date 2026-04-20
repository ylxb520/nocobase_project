/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BlockModel } from '@nocobase/client';
import React from 'react';
import { tExpr } from '../locale';
export class NestedSub1BlockModel extends BlockModel {
  renderComponent() {
    return React.createElement(
      'div',
      null,
      React.createElement('h1', null, 'Hello, NocoBase!'),
      React.createElement(
        'p',
        null,
        'This is a simple block rendered by ',
        React.createElement('strong', null, 'NestedSub1BlockModel'),
        '.',
      ),
    );
  }
}
NestedSub1BlockModel.define({
  label: tExpr('Sub 1'),
  hide: true,
});
export class NestedSub2BlockModel extends BlockModel {
  renderComponent() {
    return React.createElement(
      'div',
      null,
      React.createElement('h1', null, 'Hello, NocoBase!'),
      React.createElement(
        'p',
        null,
        'This is a simple block rendered by ',
        React.createElement('strong', null, 'NestedSub2BlockModel'),
        '.',
      ),
    );
  }
}
NestedSub2BlockModel.define({
  label: tExpr('Sub 2'),
  hide: true,
});
export class NestedBlockModel extends BlockModel {
  static defineChildren(ctx) {
    return this.buildChildrenFromModels(ctx, [NestedSub1BlockModel, NestedSub2BlockModel]);
  }
}
NestedBlockModel.define({
  label: tExpr('Nested block'),
});
//# sourceMappingURL=NestedBlockModel.js.map
