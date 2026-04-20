/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ResourcerContext } from '@nocobase/resourcer';
/**
 * 针对给定集合，修正 selects：
 * - 若 fields 中包含单段且为关联名（如 'roles'），则将其从 fields 移到 appends。
 * - 若 fields 中包含多段且首段为关联名（如 'roles.name'），确保 appends 包含该关联名，并将首段替换为模型真实关联名。
 * - 非关联字段：仅当模型存在该属性（或其 snake/camel 变体）时才保留，否则丢弃以避免数据库错误。
 */
export declare function adjustSelectsForCollection(koaCtx: ResourcerContext, dataSourceKey: string, collection: string, fields?: string[], appends?: string[]): {
    fields?: string[];
    appends?: string[];
};
