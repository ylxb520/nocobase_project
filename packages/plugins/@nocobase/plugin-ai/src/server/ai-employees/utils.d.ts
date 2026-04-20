/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AIMessage, HumanMessage, ToolMessage } from 'langchain';
import { AIMessageInput } from '../types';
import { AIEmployee } from './ai-employee';
export declare const convertAIMessage: ({
  aiEmployee,
  providerName: provider,
  model,
  aiMessage,
}: {
  aiEmployee: AIEmployee;
  providerName: string;
  model: string;
  aiMessage: AIMessage;
}) => AIMessageInput;
export declare const convertHumanMessage: ({
  providerName: provider,
  model,
  humanMessage,
}: {
  providerName: string;
  model: string;
  humanMessage: HumanMessage;
}) => AIMessageInput;
export declare const convertToolMessage: ({
  providerName: provider,
  model,
  toolMessage,
}: {
  providerName: string;
  model: string;
  toolMessage: ToolMessage;
}) => AIMessageInput;
