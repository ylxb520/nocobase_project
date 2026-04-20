/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
import * as actions from './actions';
export * as utils from './utils';
export * from './constants';
/**
 * @internal
 */
export function registerActions(api) {
  api.actions(
    lodash.pick(actions, [
      'add',
      'create',
      'destroy',
      'get',
      'list',
      'remove',
      'set',
      'toggle',
      'update',
      'move',
      'firstOrCreate',
      'updateOrCreate',
    ]),
  );
}
export default actions;
//# sourceMappingURL=index.js.map
