/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowEngine } from '../flowEngine';
export declare const VIEW_ACTIVATED_VERSION: unique symbol;
export declare const VIEW_ACTIVATED_EVENT: 'view:activated';
export declare const DATA_SOURCE_DIRTY_EVENT: 'dataSource:dirty';
export declare const ENGINE_SCOPE_KEY: '__NOCOBASE_ENGINE_SCOPE__';
export declare const VIEW_ENGINE_SCOPE: 'view';
export declare function getEmitterViewActivatedVersion(emitter: any): number;
export declare function bumpViewActivatedVersion(emitter: any): number;
export declare function resolveOpenerEngine(parentEngine: FlowEngine, scopedEngine: FlowEngine): FlowEngine | undefined;
