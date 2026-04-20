/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export type RunJSSnippetLoader = () => Promise<any>;
declare const snippets: Record<string, RunJSSnippetLoader | undefined>;
export default snippets;
/**
 * Register a RunJS snippet loader for editors/AI coding.
 *
 * - By default, an existing ref will NOT be overwritten (returns false).
 * - Use { override: true } to overwrite an existing ref (returns true).
 */
export declare function registerRunJSSnippet(
  ref: string,
  loader: RunJSSnippetLoader,
  options?: {
    override?: boolean;
  },
): boolean;
type EngineSnippetEntry = {
  name: string;
  prefix?: string;
  description?: string;
  body: string;
  ref: string;
  group?: string;
  groups?: string[];
  scenes?: string[];
};
export declare function getSnippetBody(ref: string): Promise<string>;
export declare function listSnippetsForContext(
  ctxClassName: string,
  version?: string,
  locale?: string,
): Promise<EngineSnippetEntry[]>;
