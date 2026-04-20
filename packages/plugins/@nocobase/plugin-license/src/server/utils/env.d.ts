/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Env } from '@nocobase/license-kit';
import { KeyData } from './interface';
export declare function getClientDomain(ctx: any): string;
export declare function isDomainMatch(currentDomain: string, keyData: KeyData): boolean;
export declare function isEnvMatch(env: Env, keyData: KeyData): boolean;
export declare function isDbMatch(env: any, keyData: any): boolean;
export declare function isSysMatch(env: Env, keyData: KeyData): boolean;
export declare function getEnvOnce(): any;
