/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { parse } from '@nocobase/utils';
import _ from 'lodash';
export class Environment {
  vars = {};
  setVariable(key, value) {
    this.vars[key] = value;
  }
  removeVariable(key) {
    delete this.vars[key];
  }
  getVariablesAndSecrets() {
    return this.vars;
  }
  getVariables() {
    return this.vars;
  }
  renderJsonTemplate(template, options) {
    if (options?.omit) {
      const omitTemplate = _.omit(template, options.omit);
      const parsed = parse(omitTemplate)({
        $env: this.vars,
      });
      for (const key of options.omit) {
        _.set(parsed, key, _.get(template, key));
      }
      return parsed;
    }
    return parse(template)({
      $env: this.vars,
    });
  }
}
//# sourceMappingURL=environment.js.map
