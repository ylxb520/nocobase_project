/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils/client';
import mathjs from './engines/mathjs';
import formulajs from './engines/formulajs';
import string from './engines/string';
export const evaluators = new Registry();
evaluators.register('formula.js', formulajs);
evaluators.register('math.js', mathjs);
evaluators.register('string', string);
export function getOptions() {
  return Array.from(evaluators.getEntities()).reduce(
    (result, [value, options]) => result.concat({ value, ...options }),
    [],
  );
}
export default evaluators;
//# sourceMappingURL=index.js.map
