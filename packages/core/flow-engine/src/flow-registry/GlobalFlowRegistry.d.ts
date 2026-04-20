/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ModelConstructor } from '../types';
import { FlowDefinition } from '../FlowDefinition';
import { BaseFlowRegistry } from './BaseFlowRegistry';
type FlowKey = string;
export declare class GlobalFlowRegistry extends BaseFlowRegistry {
  protected target: ModelConstructor;
  static readonly _type: 'global';
  constructor(target: ModelConstructor);
  removeFlow(flowKey: FlowKey): void;
  getFlow(flowKey: FlowKey): FlowDefinition | undefined;
  getFlows(): Map<FlowKey, FlowDefinition>;
  saveFlow(flow: FlowDefinition): void;
  destroyFlow(flowKey: string): void;
}
export {};
