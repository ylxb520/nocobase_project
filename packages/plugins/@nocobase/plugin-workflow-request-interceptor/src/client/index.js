/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { Plugin } from '@nocobase/client';
import RequestInterceptionTrigger from './RequestInterceptionTrigger';
export class PluginWorkflowRequestInterceptorClient extends Plugin {
    async load() {
        const workflowPlugin = this.app.pm.get('workflow');
        workflowPlugin.registerTrigger('request-interception', RequestInterceptionTrigger);
    }
}
export default PluginWorkflowRequestInterceptorClient;
//# sourceMappingURL=index.js.map