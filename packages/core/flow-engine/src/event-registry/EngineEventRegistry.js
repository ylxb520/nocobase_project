/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BaseEventRegistry } from './BaseEventRegistry';
export class EngineEventRegistry extends BaseEventRegistry {
  getEvent(name) {
    return this.events.get(name);
  }
  getEvents() {
    return new Map(this.events);
  }
}
//# sourceMappingURL=EngineEventRegistry.js.map
