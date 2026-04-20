/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import userEvent from '@testing-library/user-event';
import { getFormItemElement } from './common';
import { expectNoTsError } from '../utils';
export async function inputChecker(options) {
  const formItem = getFormItemElement({ Component: 'Input', ...options });
  const input = formItem.querySelector('input');
  if (options.oldValue) {
    expectNoTsError(input).toHaveValue(options.oldValue);
  }
  if (options.newValue) {
    await userEvent.clear(input);
    await userEvent.type(input, options.newValue);
  }
}
//# sourceMappingURL=input.js.map
