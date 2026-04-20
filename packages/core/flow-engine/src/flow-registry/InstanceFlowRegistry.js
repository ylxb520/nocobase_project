/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BaseFlowRegistry } from './BaseFlowRegistry';
export class InstanceFlowRegistry extends BaseFlowRegistry {
  model;
  static _type = 'instance';
  constructor(model) {
    super();
    this.model = model;
  }
  async save() {
    await this.model.saveStepParams();
  }
  async saveFlow(flow) {
    await this.model.saveStepParams();
  }
  async destroyFlow(flowKey) {
    this.removeFlow(flowKey);
    // TODO
    await this.model.saveStepParams();
  }
  async moveStep(flowKey, sourceStepKey, targetStepKey) {
    super.moveStep(flowKey, sourceStepKey, targetStepKey);
    await this.model.saveStepParams();
  }
}
//# sourceMappingURL=InstanceFlowRegistry.js.map
