/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { ResourcerContext } from '@nocobase/resourcer';
import type { JSONValue } from '../template/resolver';
/**
 * 预取：构建“同记录”的字段/关联并集，一次查询写入 ctx.state.__varResolveBatchCache，供后续解析复用
 */
export declare function prefetchRecordsForResolve(koaCtx: ResourcerContext, items: Array<{
    template: JSONValue;
    contextParams?: Record<string, unknown>;
}>): Promise<void>;
