/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { Plugin } from '@nocobase/client';
export declare class PluginWorkflowCustomVariableClient extends Plugin {
    constructor(options: any, app: any);
    beforeLoad(): Promise<void>;
    load(): Promise<void>;
}
export default PluginWorkflowCustomVariableClient;
