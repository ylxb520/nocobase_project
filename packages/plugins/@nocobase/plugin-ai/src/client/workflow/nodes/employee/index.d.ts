/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Instruction, WorkflowVariableRawTextArea } from '@nocobase/plugin-workflow/client';
export declare class AIEmployeeInstruction extends Instruction {
  title: string;
  type: string;
  group: string;
  icon: React.JSX.Element;
  fieldset: {
    employee: {
      type: string;
      title: string;
      required: boolean;
      'x-decorator': string;
      'x-component': string;
    };
    message: {
      type: string;
      title: string;
      required: boolean;
      'x-decorator': string;
      'x-component': string;
      'x-component-props': {
        autoSize: {
          minRows: number;
        };
      };
    };
    colleague: {
      type: string;
      title: string;
      required: boolean;
      'x-decorator': string;
      'x-component': string;
    };
    manual: {
      type: string;
      title: string;
      required: boolean;
      'x-decorator': string;
      'x-component': string;
    };
  };
  components: {
    AIEmployee: () => React.JSX.Element;
    WorkflowVariableRawTextArea: typeof WorkflowVariableRawTextArea;
  };
  isAvailable({ engine, workflow }: { engine: any; workflow: any }): boolean;
}
