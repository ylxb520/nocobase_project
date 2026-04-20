/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { iconChecker } from './icon';
import { radioChecker } from './radio';
import { inputChecker } from './input';
import { numberChecker } from './number';
import { textareaChecker } from './textarea';
import { collectionFieldChecker } from './collectionField';
export * from './icon';
export * from './radio';
export * from './icon';
const checkers = {
  icon: iconChecker,
  radio: radioChecker,
  input: inputChecker,
  collectionField: collectionFieldChecker,
  number: numberChecker,
  textarea: textareaChecker,
};
export async function checkFormItems(list) {
  for (const item of list) {
    const type = item.type;
    const checker = checkers[type];
    await checker(item);
  }
}
//# sourceMappingURL=index.js.map
