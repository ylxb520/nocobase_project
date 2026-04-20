/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Plugin } from '@nocobase/client';
import { BatchDownloadActionModel } from './models/BatchDownloadActionModel';
import zhCN from '../locale/zh-CN.json';
import enUS from '../locale/en-US.json';
const PLUGIN_NAME = '@tlws/plugin-batch-download-attachments';
export class BatchDownloadAttachmentsClient extends Plugin {
    async afterAdd() { }
    async beforeLoad() { }
    async load() {
        console.log('🚀 批量下载附件插件加载中...');
        // 注册国际化资源
        this.app.i18n.addResources('zh-CN', PLUGIN_NAME, zhCN);
        this.app.i18n.addResources('en-US', PLUGIN_NAME, enUS);
        // 注册 Flow Engine Model
        this.app.flowEngine.registerModels({
            BatchDownloadActionModel,
        });
        // 注册到表格工具栏（右上角操作按钮区域）
        this.app.schemaInitializerManager.addItem('table:configureActions', 'batchDownloadAttachments', {
            title: '{{t("批量下载附件", { ns: "' + PLUGIN_NAME + '" })}}',
            Component: 'Action',
            schema: {
                type: 'void',
                title: '{{t("批量下载附件", { ns: "' + PLUGIN_NAME + '" })}}',
                'x-component': 'Action',
                'x-action': 'batch-download-attachments:download',
                'x-designer': 'Action.Designer',
                'x-component-props': {
                    icon: 'DownloadOutlined',
                    type: 'default',
                },
            },
        });
        console.log('✅ 批量下载附件插件加载完成');
    }
}
export default BatchDownloadAttachmentsClient;
//# sourceMappingURL=index.js.map