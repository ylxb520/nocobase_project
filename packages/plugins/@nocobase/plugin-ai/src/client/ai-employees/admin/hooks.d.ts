/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const useCreateFormProps: () => {
  form: import('@formily/core').Form<{
    username: string;
    enabled: boolean;
    enableKnowledgeBase: boolean;
    knowledgeBase: {
      knowledgeBaseIds: undefined[];
      topK: number;
      score: string;
    };
    knowledgeBasePrompt: any;
  }>;
};
export declare const useEditFormProps: () => {
  form: import('@formily/core').Form<any>;
};
export declare const useCancelActionProps: () => {
  type: string;
  onClick(): void;
};
export declare const useCreateActionProps: () => {
  type: string;
  onClick(): Promise<void>;
};
export declare const useEditActionProps: () => {
  type: string;
  onClick(): Promise<void>;
};
export declare const useDeleteActionProps: () => {
  onClick(e?: any, callBack?: any): Promise<void>;
};
