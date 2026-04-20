/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ToolsOptions } from '@nocobase/ai';
export type DocEntryResult = {
    type: 'file';
    path: string;
    content: string;
} | {
    type: 'directory';
    path: string;
    entries: Array<{
        name: string;
        type: 'file' | 'directory';
        path: string;
    }>;
};
export declare function loadDocsIndexes(baseDir?: string): Promise<void>;
export declare function getDocModuleKeys(): string[];
export declare function describeDocModules(emptyMessage?: string): string;
export declare function searchDocsModule(moduleKey: string, keywords: string[], limit?: number): Promise<{
    key: string;
    keywords: string[];
    matches: string[];
}>;
export declare function readDocEntry(docPath: string): Promise<DocEntryResult>;
export declare function createDocsSearchTool(): ToolsOptions;
export declare function createReadDocEntryTool(): ToolsOptions;
