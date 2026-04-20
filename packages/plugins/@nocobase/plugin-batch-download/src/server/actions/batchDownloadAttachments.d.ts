import { Context } from '@nocobase/actions';
/**
 * 批量下载附件的 action
 * 支持接收多个记录的 ID，查询其关联的附件，打包成 ZIP 返回
 * 2.0.8 版本：适配任意资源，不再硬编码 material_submissions
 *
 * 请求方式: POST /api/<resourceName>:batchDownloadAttachments
 * 请求体: { ids: number[] } 或 { filter: object }
 */
export declare function batchDownloadAttachments(ctx: Context, next: () => Promise<void>): Promise<void>;
