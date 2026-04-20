/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin, Application } from '@nocobase/server';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';

export class BatchDownloadAttachmentsServer extends Plugin<Application> {
  async afterAdd() {
    console.log('BatchDownloadAttachmentsServer: afterAdd');
  }

  async beforeLoad() {
    console.log('BatchDownloadAttachmentsServer: beforeLoad');
  }

  async load() {
    console.log('BatchDownloadAttachmentsServer: load - 开始注册');

    // 在 attachments 资源上注册 batchDownload action
    this.app.resourcer.registerActions({
      'attachments:batchDownload': async (ctx: any, next: any) => {
      console.log('=== batchDownload action handler 被调用 ===');
      console.log('resourceName:', ctx.action?.resourceName);
      console.log('actionName:', ctx.action?.actionName);
      console.log('params:', JSON.stringify(ctx.action?.params, null, 2));

      const params = ctx.action.params || {};
      const body = ctx.request?.body || {};
      const values = params.values || body;
      const {
        filter,
        collection,
        attachmentFields = [],      // 用户选择的附件字段，空数组表示下载所有
        folderNameFields = [],      // 用于命名文件夹的字段数组（多选）
        groupByField,               // 分组字段（有值就分组，无值就不分组）
      } = values;

      console.log('批量下载请求:', { collection, filter, attachmentFields, folderNameFields, groupByField });

      if (!collection) {
        ctx.body = { error: '缺少数据表信息' };
        ctx.status = 400;
        return;
      }

      try {
        const collectionInstance = ctx.db.getCollection(collection);
        if (!collectionInstance) {
          ctx.body = { error: '找不到数据表: ' + collection };
          ctx.status = 400;
          return;
        }

        // 获取字段列表，兼容不同的数据结构
        const fields = collectionInstance.fields;
        let fieldEntries: Array<[string, any]> = [];

        try {
          // 使用 forEach 方法遍历（Map 和类 Map 对象都支持）
          if (fields && typeof fields.forEach === 'function') {
            fields.forEach((field: any, fieldName: string) => {
              fieldEntries.push([fieldName, field]);
            });
          } else if (fields && typeof fields === 'object') {
            // 作为普通对象处理
            fieldEntries = Object.entries(fields);
          }
        } catch (e) {
          console.error('获取字段列表失败:', e);
        }

        console.log('集合字段:', fieldEntries.map(([name]) => name));

        // 自动检测所有附件字段
        const allAttachmentFields: string[] = [];
        for (const [fieldName, field] of fieldEntries) {
          const isAttachment =
            (field?.type === 'belongsToMany' && field?.target === 'attachments') ||
            (field?.options?.type === 'belongsToMany' && field?.options?.target === 'attachments') ||
            (field?.interface === 'attachment');

          if (isAttachment) {
            console.log(`发现附件字段: ${fieldName}`);
            allAttachmentFields.push(fieldName);
          }
        }

        if (allAttachmentFields.length === 0) {
          ctx.body = { error: '没有找到附件字段' };
          ctx.status = 400;
          return;
        }

        // 如果用户指定了附件字段，则只下载指定的字段；否则下载所有附件字段
        const targetAttachmentFields = attachmentFields && attachmentFields.length > 0
          ? attachmentFields.filter((f: string) => allAttachmentFields.includes(f))
          : allAttachmentFields;

        console.log('要下载的附件字段:', targetAttachmentFields);

        if (targetAttachmentFields.length === 0) {
          ctx.body = { error: '没有找到有效的附件字段' };
          ctx.status = 400;
          return;
        }

        // 构建查询，append 附件字段
        const repo = ctx.db.getRepository(collection);
        const records = await repo.find({
          filter,
          appends: targetAttachmentFields,
        });

        console.log('查询到的记录数:', records?.length);

        if (!records || records.length === 0) {
          ctx.body = { error: '没有找到记录' };
          ctx.status = 400;
          return;
        }

        const archive = archiver('zip', { zlib: { level: 9 } });

        // 生成压缩包文件名：表显示名称-日期.zip
        const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const collectionTitle = collectionInstance.options?.title || collection;
        const zipFileName = `${collectionTitle}-${dateStr}.zip`;

        ctx.set('Content-Type', 'application/zip');
        ctx.set(
          'Content-Disposition',
          `attachment; filename*=UTF-8''${encodeURIComponent(zipFileName)}`,
        );
        ctx.respond = false;
        archive.pipe(ctx.res);

        let fileCount = 0;
        const pendingFiles: Promise<void>[] = [];

        for (const record of records) {
          // 使用多个字段组合命名文件夹
          let recordName: string;
          if (folderNameFields && folderNameFields.length > 0) {
            // 组合多个字段的值
            const nameParts = folderNameFields
              .map((fieldName: string) => {
                const value = record[fieldName];
                if (value === null || value === undefined) return null;
                // 如果是对象（关系字段），尝试获取标题
                if (typeof value === 'object' && value !== null) {
                  return value.title || value.name || value.id || null;
                }
                return String(value);
              })
              .filter((v: string | null) => v !== null && v !== '');
            
            recordName = nameParts.length > 0 ? nameParts.join('-') : String(record.id);
          } else {
            // 默认使用记录ID
            recordName = String(record.id);
          }

          // 清理文件夹名称中的非法字符
          recordName = recordName.replace(/[<>:"/\\|?*]/g, '_');

          // 如果有分组字段，使用分组字段值作为顶级文件夹
          let groupPrefix = '';
          if (groupByField && record[groupByField] !== undefined && record[groupByField] !== null) {
            let groupValue = record[groupByField];
            // 如果是对象（关系字段），获取标题
            if (typeof groupValue === 'object' && groupValue !== null) {
              groupValue = groupValue.title || groupValue.name || groupValue.id || 'unknown';
            }
            groupPrefix = String(groupValue).replace(/[<>:"/\\|?*]/g, '_') + '/';
          }

          for (const fieldName of targetAttachmentFields) {
            const fieldValue = record[fieldName];
            if (!fieldValue) continue;
            const attachments = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
            for (const attachment of attachments) {
              if (!attachment || !attachment.url) continue;
              fileCount++;
              pendingFiles.push(this.addFileToArchive(archive, attachment, fieldName, recordName, groupPrefix));
            }
          }
        }

        console.log(`准备下载 ${fileCount} 个文件`);

        // 等待所有文件添加完成
        await Promise.all(pendingFiles);

        archive.finalize();
        console.log('下载完成');
      } catch (error: any) {
        console.error('批量下载失败:', error);
        ctx.body = { error: '批量下载失败: ' + (error?.message || String(error)) };
        ctx.status = 500;
      }
    },
    });

    // 注册 ACL 允许
    this.app.acl.allow('attachments', 'batchDownload', 'loggedIn');

    console.log('BatchDownloadAttachmentsServer: 注册完成');
  }

  private async addFileToArchive(
    archive: archiver.Archiver,
    attachment: any,
    fieldName: string,
    recordName: any,
    groupPrefix: string = '',
  ): Promise<void> {
    try {
      let filePath: string;
      if (attachment.url.startsWith('http://') || attachment.url.startsWith('https://')) {
        const response = await fetch(attachment.url);
        const buffer = await response.arrayBuffer();
        const fileName = attachment.filename || attachment.title || path.basename(attachment.url);
        // 路径结构：[分组前缀]/[记录名称]/[文件名]
        archive.append(Buffer.from(buffer), { name: `${groupPrefix}${recordName}/${fileName}` });
      } else {
        // 处理本地文件路径
        let urlPath = decodeURIComponent(attachment.url.replace(/^\/+/, ''));

        if (urlPath.startsWith('storage/uploads/')) {
          filePath = path.join(process.cwd(), urlPath);
        } else if (urlPath.startsWith('storage/')) {
          filePath = path.join(process.cwd(), urlPath);
        } else {
          filePath = path.join(process.cwd(), 'storage', 'uploads', urlPath);
        }

        console.log(`尝试读取文件: ${filePath}`);

        if (fs.existsSync(filePath)) {
          const fileName = attachment.filename || attachment.title || path.basename(filePath);
          // 路径结构：[分组前缀]/[记录名称]/[文件名]
          archive.file(filePath, { name: `${groupPrefix}${recordName}/${fileName}` });
          console.log(`成功添加文件: ${fileName}`);
        } else {
          console.error(`文件不存在: ${filePath}, 原始URL: ${attachment.url}`);
        }
      }
    } catch (error) {
      console.error(`添加文件到压缩包失败: ${attachment.url}`, error);
    }
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default BatchDownloadAttachmentsServer;
