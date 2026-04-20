import { Plugin } from '@nocobase/client';
import { useBatchDownloadActionProps } from './hooks';
import { BatchDownloadActionInitializer } from './BatchDownloadActionInitializer';
import zhCN from '../locale/zh-CN.json';
import enUS from '../locale/en-US.json';

export class PluginBatchDownloadClient extends Plugin {
  async load() {
    // 1. 加载多语言
    this.app.i18n.addResources('zh-CN', 'plugin-batch-download', zhCN);
    this.app.i18n.addResources('en-US', 'plugin-batch-download', enUS);

    // 2. 注册 Hook
    this.app.addScopes({
      useBatchDownloadActionProps,
    });

    // 3. 注册到表格操作配置（简化配置，与批量更新插件一致）
    const initializerData = {
      title: '{{t("Batch download attachments", { ns: "plugin-batch-download" })}}',
      Component: BatchDownloadActionInitializer,
      name: 'batchDownload',
    };

    // 添加到 table:configureActions
    this.app.schemaInitializerManager.addItem('table:configureActions', 'batchDownload', initializerData);

    // 兼容旧版名称
    this.app.schemaInitializerManager.addItem('TableActionInitializers', 'batchDownload', initializerData);

    console.log('✅ 批量下载插件已注册到表格操作配置');

    // 调试：检查注册结果
    setTimeout(() => {
      const initializer = this.app.schemaInitializerManager.get('table:configureActions');
      console.log('📋 table:configureActions items:', initializer?.items);
      console.log('📋 查找 batchDownload:', initializer?.items?.find((i) => i.name === 'batchDownload'));
    }, 1000);
  }
}

export default PluginBatchDownloadClient;
