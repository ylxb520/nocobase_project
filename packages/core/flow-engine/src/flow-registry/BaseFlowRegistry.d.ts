/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowDefinitionOptions } from '../types';
import { FlowDefinition } from '../FlowDefinition';
type FlowKey = string;
export interface IFlowRepository {
  addFlows(flowDefs: Record<string, Omit<FlowDefinitionOptions, 'key'>>): void;
  addFlow(flowKey: string, flowOptions: Omit<FlowDefinitionOptions, 'key'>): FlowDefinition | void;
  removeFlow(flowKey: string): void;
  getFlows(): Map<string, FlowDefinition>;
  mapFlows<T = any>(callback: (flow: FlowDefinition) => T): T[];
  hasFlow(flowKey: string): boolean;
  getFlow(flowKey: string): FlowDefinition | undefined;
  saveFlow(flow: FlowDefinition): Promise<any> | void;
  destroyFlow(flowKey: string): Promise<any> | void;
  moveStep(flowKey: string, sourceStepKey: string, targetStepKey: string): Promise<any> | void;
}
/**
 * 抽象基类，封装通用的 Flow Registry 逻辑
 * 子类只需实现持久化相关的方法
 */
export declare abstract class BaseFlowRegistry implements IFlowRepository {
  protected flows: Map<FlowKey, FlowDefinition>;
  constructor();
  addFlows(
    flows: Record<
      FlowKey,
      Omit<FlowDefinitionOptions, 'key'> & {
        key?: string;
      }
    >,
  ): void;
  addFlow(
    flowKey: FlowKey,
    flowOptions: Omit<FlowDefinitionOptions, 'key'> & {
      key?: string;
    },
  ): FlowDefinition;
  hasFlow(flowKey: FlowKey): boolean;
  getFlow(flowKey: FlowKey): FlowDefinition | undefined;
  getFlows(): Map<FlowKey, FlowDefinition>;
  removeFlow(flowKey: FlowKey): void;
  mapFlows<T = any>(callback: (flow: FlowDefinition) => T): T[];
  moveStep(flowKey: FlowKey, sourceStepKey: string, targetStepKey: string): void;
  abstract saveFlow(flow: FlowDefinition): Promise<any> | void;
  abstract destroyFlow(flowKey: string): Promise<any> | void;
}
export {};
