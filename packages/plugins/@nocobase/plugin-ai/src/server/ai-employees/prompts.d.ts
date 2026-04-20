/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare function getSystemPrompt({
  aiEmployee,
  personal,
  task,
  environment,
  dataSources,
  knowledgeBase,
}: {
  aiEmployee: {
    nickname: string;
    about: string;
  };
  personal?: string;
  task: {
    background: string;
    context?: string;
  };
  environment: {
    database: string;
    locale: string;
  };
  dataSources?: string;
  knowledgeBase?: string;
}): string;
