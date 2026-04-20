/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
declare const _default: {
  name: string;
  fields: (
    | {
        name: string;
        type: string;
        primaryKey: boolean;
        interface?: undefined;
        allowNull?: undefined;
        defaultValue?: undefined;
      }
    | {
        name: string;
        type: string;
        interface: string;
        primaryKey?: undefined;
        allowNull?: undefined;
        defaultValue?: undefined;
      }
    | {
        name: string;
        type: string;
        primaryKey?: undefined;
        interface?: undefined;
        allowNull?: undefined;
        defaultValue?: undefined;
      }
    | {
        name: string;
        type: string;
        allowNull: boolean;
        defaultValue: boolean;
        primaryKey?: undefined;
        interface?: undefined;
      }
    | {
        name: string;
        type: string;
        interface: string;
        allowNull: boolean;
        defaultValue: boolean;
        primaryKey?: undefined;
      }
  )[];
};
export default _default;
export type AIEmployee = {
  username: string;
  nickname?: string;
  position?: string;
  avatar?: string;
  bio?: string;
  about?: string;
  defaultPrompt?: string;
  greeting?: string;
  chatSettings?: unknown;
  skillSettings?: unknown;
  modelSettings?: unknown;
  dataSourceSettings?: unknown;
  knowledgeBasePrompt?: string;
  knowledgeBase?: {
    topK: number;
    score: string;
    knowledgeBaseIds: string[];
  };
  enableKnowledgeBase: boolean;
  enabled: boolean;
  builtIn: boolean;
};
