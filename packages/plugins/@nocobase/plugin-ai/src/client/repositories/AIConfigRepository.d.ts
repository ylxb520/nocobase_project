/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ToolsEntry, type ToolsManager } from '@nocobase/client';
import { AIEmployee } from '../ai-employees/types';
export interface LLMServiceItem {
  llmService: string;
  llmServiceTitle: string;
  provider?: string;
  providerTitle?: string;
  enabledModels: {
    label: string;
    value: string;
  }[];
  supportWebSearch?: boolean;
  isToolConflict?: boolean;
}
export declare class AIConfigRepository {
  private readonly apiClient;
  private readonly options?;
  llmServices: LLMServiceItem[];
  llmServicesLoading: boolean;
  aiEmployees: AIEmployee[];
  aiEmployeesLoading: boolean;
  aiTools: ToolsEntry[];
  aiToolsLoading: boolean;
  private llmServicesLoaded;
  private aiEmployeesLoaded;
  private aiToolsLoaded;
  private llmServicesInFlight;
  private aiEmployeesInFlight;
  private aiToolsInFlight;
  constructor(
    apiClient: any,
    options?: {
      toolsManager?: Pick<ToolsManager, 'listTools'>;
    },
  );
  getLLMServices(): Promise<LLMServiceItem[]>;
  refreshLLMServices(): Promise<LLMServiceItem[]>;
  getAIEmployees(): Promise<AIEmployee[]>;
  refreshAIEmployees(): Promise<AIEmployee[]>;
  getAIEmployeesMap(): Record<string, AIEmployee>;
  getAITools(): Promise<ToolsEntry[]>;
  refreshAITools(): Promise<ToolsEntry[]>;
  private startRefresh;
  private doRefreshLLMServices;
  private doRefreshAIEmployees;
  private doRefreshAITools;
}
