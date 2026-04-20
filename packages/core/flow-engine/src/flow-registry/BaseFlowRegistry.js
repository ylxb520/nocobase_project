/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowDefinition } from '../FlowDefinition';
import { observable } from '@formily/reactive';
/**
 * 抽象基类，封装通用的 Flow Registry 逻辑
 * 子类只需实现持久化相关的方法
 */
export class BaseFlowRegistry {
  flows;
  constructor() {
    this.flows = observable.shallow(new Map());
  }
  addFlows(flows) {
    for (const [flowKey, flowOptions] of Object.entries(flows || {})) {
      this.addFlow(flowKey, flowOptions);
    }
  }
  addFlow(flowKey, flowOptions) {
    const flow = new FlowDefinition(
      {
        ...flowOptions,
        key: flowKey,
      },
      this,
    );
    this.flows.set(flowKey, flow);
    return flow;
  }
  hasFlow(flowKey) {
    const flow = this.flows.get(flowKey);
    return !!flow;
  }
  getFlow(flowKey) {
    return this.flows.get(flowKey);
  }
  getFlows() {
    return this.flows;
  }
  removeFlow(flowKey) {
    this.flows.delete(flowKey);
  }
  mapFlows(callback) {
    const flows = this.getFlows();
    return [...flows.values()].map((flow) => callback(flow));
  }
  moveStep(flowKey, sourceStepKey, targetStepKey) {
    const flow = this.getFlow(flowKey);
    if (!flow) {
      throw new Error(`Flow '${flowKey}' not found`);
    }
    flow.moveStep(sourceStepKey, targetStepKey);
  }
}
//# sourceMappingURL=BaseFlowRegistry.js.map
