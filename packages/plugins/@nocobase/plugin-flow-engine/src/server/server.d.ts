/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Plugin } from '@nocobase/server';
export declare const compile: (title: string) => string;
export declare class PluginUISchemaStorageServer extends Plugin {
    registerRepository(): void;
    beforeLoad(): Promise<void>;
    load(): Promise<void>;
}
export default PluginUISchemaStorageServer;
