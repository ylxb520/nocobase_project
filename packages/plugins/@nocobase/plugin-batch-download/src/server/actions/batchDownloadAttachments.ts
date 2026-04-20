import { Context } from '@nocobase/actions';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';

/**
 * 批量下载附件的 action
 * 支持接收多个记录的 ID，查询其关联的附件，打包成 ZIP 返回
 * 2.0.8 版本：适配任意资源，不再硬编码 material_submissions
 *
 * 请求方式: POST /api/<resourceName>:batchDownloadAttachments
 * 请求体: { ids: number[] } 或 { filter: object }
 */
export async function batchDownloadAttachments(ctx: Context, next: () => Promise<void>) {
  const { ids, filter } = ctx.action.params.values || {};
  const { resourceName } = ctx.action; // 从 action 上下文获取当前资源名称（2.0.8 支持）

  if (!ids && !filter) {
    ctx.throw(400, '请提供要下载的记录 ID 列表 (ids) 或筛选条件 (filter)');
  }

  // 关键：不再硬编码 material_submissions，使用当前资源名称
  const submissionRepo = ctx.db.getRepository(resourceName);
  if (!submissionRepo) {
    ctx.throw(404, `资源 ${resourceName} 不存在`);
  }

  // 查询要下载的记录
  let submissions;
  if (ids && ids.length > 0) {
    submissions = await submissionRepo.find({
      filterByTk: ids,
      appends: ['attachments'],
    });
  } else {
    submissions = await submissionRepo.find({
      filter,
      appends: ['attachments'],
    });
  }

  if (!submissions || submissions.length === 0) {
    ctx.throw(404, '未找到指定的记录');
  }

  // 设置响应头为 ZIP 文件下载
  const zipFileName = `附件批量下载_${Date.now()}.zip`;
  ctx.set({
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="${encodeURIComponent(zipFileName)}"`,
  });

  // 创建 archiver 实例
  const archive = archiver('zip', {
    zlib: { level: 9 }, // 最大压缩级别
  });

  // 获取存储配置
  const storageRepo = ctx.db.getRepository('storages');
  const storage = await storageRepo.findOne({
    filter: {
      default: true,
    },
  });

  if (!storage) {
    ctx.throw(500, '未找到默认存储配置');
  }

  const documentRoot = storage.options?.documentRoot || 'storage/uploads';
  const baseUrl = storage.baseUrl || '/storage/uploads';

  // 收集所有附件并添加到压缩包
  let hasFiles = false;

  for (const submission of submissions) {
    // 使用单位名称和模型名称创建子目录
    const dirName = `${submission.unit_name || '未知单位'}_${submission.model_name || '未知模型'}`.replace(
      /[\\/:*?"<>|]/g,
      '_',
    );

    if (submission.attachments && submission.attachments.length > 0) {
      for (const attachment of submission.attachments) {
        // 根据 path 或 url 确定文件位置
        let filePath = attachment.path || '';

        // 如果是相对路径，尝试多种方式定位文件
        if (filePath && !path.isAbsolute(filePath)) {
          // 方式1: 直接使用 storage 的 documentRoot
          const fullPath1 = path.join(process.cwd(), documentRoot, filePath);
          // 方式2: 尝试作为 url 路径
          const fullPath2 = path.join(process.cwd(), filePath.replace(baseUrl, ''));

          if (fs.existsSync(fullPath1)) {
            filePath = fullPath1;
          } else if (fs.existsSync(fullPath2)) {
            filePath = fullPath2;
          } else {
            // 文件不存在，跳过
            console.warn(`文件不存在: ${fullPath1} 或 ${fullPath2}`);
            continue;
          }
        }

        if (fs.existsSync(filePath)) {
          hasFiles = true;
          // 使用原始文件名，保持目录结构
          const originalName = attachment.title || attachment.filename || '未知文件';
          const extName = path.extname(originalName);
          const baseName = path.basename(originalName, extName);
          const archivePath = `${dirName}/${baseName}_${submission.id}${extName}`;

          archive.file(filePath, { name: archivePath });
        }
      }
    }
  }

  if (!hasFiles) {
    // 如果没有文件，创建一个说明文件
    const infoContent = `批量下载说明\n\n下载时间: ${new Date().toLocaleString('zh-CN')}\n\n选中的记录:\n${submissions
      .map((s: any) => `- ${s.unit_name || '未知'} / ${s.model_name || '未知'} (ID: ${s.id})`)
      .join('\n')}\n\n备注: 所选记录中没有找到附件文件。`;
    archive.append(infoContent, { name: '下载说明.txt' });
  }

  // 将 archive 的输出流传到 ctx.body
  // @ts-ignore
  ctx.body = archive;

  // 完成压缩
  archive.finalize();

  await next();
}
