/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare function extractDependencyKeys(config: Record<string, any>): Set<string>;
export declare function stripVariableReferences(value: any, keysToRemove: Set<string>): {
    value: any;
    changed: boolean;
};
export declare function collectUpstreams(node: any): Set<number>;
