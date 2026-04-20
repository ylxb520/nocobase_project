/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowDefinition } from '../FlowDefinition';
import { FlowModel } from '../models';
import { BaseFlowRegistry } from './BaseFlowRegistry';
type FlowKey = string;
export declare class InstanceFlowRegistry extends BaseFlowRegistry {
  protected model: FlowModel;
  static readonly _type: 'instance';
  constructor(model: FlowModel);
  save(): Promise<void>;
  saveFlow(flow: FlowDefinition): Promise<void>;
  destroyFlow(flowKey: FlowKey): Promise<void>;
  moveStep(flowKey: FlowKey, sourceStepKey: string, targetStepKey: string): Promise<void>;
}
export {};
