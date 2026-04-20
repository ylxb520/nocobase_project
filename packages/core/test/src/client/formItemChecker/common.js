/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { expectNoTsError } from '../utils';
export function getFormItemElement({ container = document.body, Component, label }) {
  const preSelector = `div[aria-label^="block-item-${Component}-"]`;
  const selector = label ? `${preSelector}[aria-label$="${label}"]` : preSelector;
  const formItem = container.querySelector(selector);
  expectNoTsError(formItem).toBeInTheDocument();
  return formItem;
}
//# sourceMappingURL=common.js.map
