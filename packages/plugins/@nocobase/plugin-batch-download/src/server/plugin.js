import { Plugin } from '@nocobase/server';
import { batchDownloadAttachments } from './actions/batchDownloadAttachments';
export class PluginBatchDownloadServer extends Plugin {
  async load() {
    // 参考 plugin-action-export 的方式注册 action
    this.app.dataSourceManager.afterAddDataSource((dataSource) => {
      dataSource.resourceManager.registerActionHandler('batchDownloadAttachments', batchDownloadAttachments.bind(this));
      dataSource.acl.setAvailableAction('batchDownloadAttachments', {
        displayName: '{{t("Batch download attachments")}}',
        allowConfigureFields: true,
        aliases: ['batchDownloadAttachments'],
      });
    });
  }
}
export default PluginBatchDownloadServer;
//# sourceMappingURL=plugin.js.map
