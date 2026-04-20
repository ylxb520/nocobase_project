/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowModel } from '@nocobase/flow-engine';
import { TriggerTaskOptions } from '../../types';
import { ContextItem as WorkContextItem } from '../../types';
type ShortcutProps = TriggerTaskOptions & {
  builtIn?: boolean;
  showNotice?: boolean;
  style: {
    size?: number;
    mask?: boolean;
  };
  context: ShortcutContext;
  auto?: boolean;
};
type ShortcutContext = {
  workContext?: WorkContextItem[];
};
export declare class AIEmployeeShortcutModel extends FlowModel {
  props: ShortcutProps;
  render(): React.JSX.Element;
}
export {};
