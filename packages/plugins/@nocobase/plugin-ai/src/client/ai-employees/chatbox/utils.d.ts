/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Application } from '@nocobase/client';
import { ContextItem, TaskMessage } from '../types';
export declare const parseTask: (task: {
  message: TaskMessage;
  webSearch?: boolean;
  model?: any;
  skillSettings?: {
    skills?: string[];
  };
}) => Promise<{
  userMessage: any;
  systemMessage: string;
  attachments: any[];
  workContext: ContextItem[];
  skillSettings: {
    skills?: string[];
  };
  webSearch: boolean;
  model: any;
}>;
export declare const parseWorkContext: (app: Application, workContext: ContextItem[]) => Promise<any[]>;
export declare const UNKNOWN_FILE_ICON: string;
export declare function getFileIconByExt(fileName: string): string;
