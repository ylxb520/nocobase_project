/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FieldModel } from '@nocobase/client';
import React from 'react';
import { ParamObject, StepParams } from '@nocobase/flow-engine';
export declare class BulkEditFieldModel extends FieldModel {
  setProps(props: Record<string, any>): void;
  setProps(key: string, value: any): void;
  setStepParams(flowKey: string, stepKey: string, params: ParamObject): void;
  setStepParams(flowKey: string, stepParams: Record<string, ParamObject>): void;
  setStepParams(allParams: StepParams): void;
  openFlowSettings(options?: any): Promise<any>;
  render(): React.JSX.Element;
}
