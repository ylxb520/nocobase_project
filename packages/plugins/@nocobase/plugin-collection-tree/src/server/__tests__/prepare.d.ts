/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { MockServer } from '@nocobase/test';
export declare function prepareApp(): Promise<MockServer>;
export declare function createApp(options?: any): Promise<MockServer>;
export declare function createAppWithNoUsersPlugin(options?: any): Promise<MockServer>;
