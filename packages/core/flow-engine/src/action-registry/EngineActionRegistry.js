/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BaseActionRegistry } from './BaseActionRegistry';
export class EngineActionRegistry extends BaseActionRegistry {
  getAction(name) {
    return this.actions.get(name);
  }
  getActions() {
    return new Map(this.actions);
  }
}
//# sourceMappingURL=EngineActionRegistry.js.map
