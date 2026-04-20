/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Message, Task } from '../types';
export declare const AIMessage: React.FC<{
  msg: Message['content'];
}>;
export declare const Reference: React.FC<{
  references: {
    title: string;
    url: string;
  }[];
}>;
export declare const UserMessage: React.FC<{
  msg: Message['content'];
}>;
export declare const ErrorMessage: React.FC<{
  msg: any;
}>;
export declare const HintMessage: React.FC<{
  msg: any;
}>;
export declare const TaskMessage: React.FC<{
  msg: {
    content: Task[];
  };
}>;
