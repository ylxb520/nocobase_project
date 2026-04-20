/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { LockdownOptions } from 'ses';
import 'ses';
export declare const BASE_BLOCKED_IDENTIFIERS: string[];
export declare function lockdownSes(options?: LockdownOptions): void;
