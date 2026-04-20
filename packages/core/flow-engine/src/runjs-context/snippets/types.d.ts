/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export type SnippetContextSpecifier =
  | string
  | {
      name: string;
    }
  | (new (...args: any[]) => any);
export type SnippetModule = {
  content: string;
  contexts?: SnippetContextSpecifier[];
  versions?: string[];
  scenes?: string[];
  prefix?: string;
  label?: string;
  description?: string;
  locales?: Record<
    string,
    {
      label?: string;
      description?: string;
    }
  >;
};
