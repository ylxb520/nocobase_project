/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Plugin } from '@nocobase/client';
import models from './models';
import enUS from '../locale/en-US.json';
import zhCN from '../locale/zh-CN.json';
const PLUGIN_NAME = '@tlws/video-guide';
export class VideoGuideClient extends Plugin {
    async afterAdd() { }
    async beforeLoad() { }
    async load() {
        this.app.i18n.addResources('zh-CN', PLUGIN_NAME, zhCN);
        this.app.i18n.addResources('en-US', PLUGIN_NAME, enUS);
        this.flowEngine.registerModels(models);
    }
}
export default VideoGuideClient;
//# sourceMappingURL=index.js.map