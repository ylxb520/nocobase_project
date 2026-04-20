/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { ActionModel, ActionSceneEnum } from '@nocobase/client';
import { tExpr, FlowSettingsContext } from '@nocobase/flow-engine';
import React from 'react';
import { Select } from 'antd';

const NAMESPACE = '@tlws/plugin-batch-download-attachments';

function getCollectionName(ctx: any): string | undefined {
  return ctx.blockModel?.collection?.name
    || ctx.model?.context?.blockModel?.collection?.name
    || ctx.collection?.name;
}

/**
 * 从 FlowSettingsContext 中获取 collection
 */
function getCollectionFromContext(ctx: FlowSettingsContext<any>): any {
  // 在设置界面中，通过 model.context.blockModel 获取
  return (ctx.model as any)?.context?.blockModel?.collection;
}

/**
 * 获取集合中的所有附件字段
 */
function getAttachmentFields(collection: any): Array<{ name: string; title: string }> {
  if (!collection) return [];

  const fields = collection.getFields?.() || [];
  const attachmentFields: Array<{ name: string; title: string }> = [];

  fields.forEach((field: any) => {
    const isAttachment =
      field?.interface === 'attachment' ||
      (field?.type === 'belongsToMany' && field?.target === 'attachments');

    if (isAttachment) {
      attachmentFields.push({
        name: field.name,
        title: field.title || field.name,
      });
    }
  });

  return attachmentFields;
}

/**
 * 获取集合中所有可作为文件夹名称的字段
 * 支持多选，可以组合多个字段命名
 */
function getNamingFields(collection: any): Array<{ name: string; title: string }> {
  if (!collection) return [];

  const fields = collection.getFields?.() || [];
  const namingFields: Array<{ name: string; title: string }> = [];
  const addedNames = new Set<string>();

  fields.forEach((field: any) => {
    // 跳过已添加的字段
    if (addedNames.has(field.name)) return;

    // 可用于命名的字段：基本类型字段
    const isNamingField =
      // 通过 interface 判断（更准确）
      field?.interface === 'input' ||
      field?.interface === 'email' ||
      field?.interface === 'phone' ||
      field?.interface === 'url' ||
      field?.interface === 'integer' ||
      field?.interface === 'number' ||
      field?.interface === 'percent' ||
      field?.interface === 'id' ||
      field?.interface === 'createdAt' ||
      field?.interface === 'updatedAt' ||
      field?.interface === 'createdBy' ||
      field?.interface === 'updatedBy' ||
      field?.interface === 'select' ||
      field?.interface === 'radioGroup' ||
      // 通过 type 判断（兼容）
      field?.type === 'string' ||
      field?.type === 'integer' ||
      field?.type === 'bigInt' ||
      field?.type === 'float' ||
      field?.type === 'double' ||
      field?.type === 'decimal' ||
      field?.type === 'date' ||
      field?.type === 'dateonly' ||
      field?.type === 'time' ||
      // 关系字段也可以用于命名（显示标题）
      field?.type === 'belongsTo' ||
      field?.type === 'hasOne';

    if (isNamingField) {
      addedNames.add(field.name);
      namingFields.push({
        name: field.name,
        title: field.title || field.name,
      });
    }
  });

  return namingFields;
}

/**
 * 获取集合中所有可用于分组的字段
 * 单选，选择后启用分组
 */
function getGroupByFields(collection: any): Array<{ name: string; title: string }> {
  if (!collection) return [];

  const fields = collection.getFields?.() || [];
  const groupByFields: Array<{ name: string; title: string }> = [];
  const addedNames = new Set<string>();

  fields.forEach((field: any) => {
    // 跳过已添加的字段
    if (addedNames.has(field.name)) return;

    // 可用于分组的字段：离散值字段
    const isGroupByField =
      // 通过 interface 判断
      field?.interface === 'select' ||
      field?.interface === 'radioGroup' ||
      field?.interface === 'checkbox' ||
      field?.interface === 'checkboxGroup' ||
      field?.interface === 'boolean' ||
      field?.interface === 'input' ||
      field?.interface === 'email' ||
      field?.interface === 'phone' ||
      field?.interface === 'url' ||
      field?.interface === 'integer' ||
      field?.interface === 'number' ||
      field?.interface === 'percent' ||
      // 通过 type 判断
      field?.type === 'string' ||
      field?.type === 'integer' ||
      field?.type === 'bigInt' ||
      field?.type === 'boolean' ||
      // 关系字段也可以分组
      field?.type === 'belongsTo';

    if (isGroupByField) {
      addedNames.add(field.name);
      groupByFields.push({
        name: field.name,
        title: field.title || field.name,
      });
    }
  });

  return groupByFields;
}

export class BatchDownloadActionModel extends ActionModel {
  static scene = ActionSceneEnum.collection;

  defaultProps: any = {
    title: tExpr('批量下载附件', { ns: NAMESPACE }),
    type: 'default',
    icon: 'DownloadOutlined',
  };

  getAclActionName() {
    return 'view';
  }
}

BatchDownloadActionModel.define({
  label: tExpr('批量下载附件', { ns: NAMESPACE }),
  sort: 84,
});

// 按钮设置 - 继承自 ActionModel 的 buttonSettings，添加额外配置
BatchDownloadActionModel.registerFlow({
  key: 'downloadSettings',
  title: tExpr('下载设置', { ns: NAMESPACE }),
  sort: 100,
  manual: true,
  steps: {
    // 下载字段设置 - 选择要下载哪些附件字段
    attachmentFields: {
      title: tExpr('下载字段设置', { ns: NAMESPACE }),
      uiSchema(ctx) {
        const collection = getCollectionFromContext(ctx);
        const attachmentFields = getAttachmentFields(collection);

        return {
          attachmentFields: {
            type: 'array',
            title: tExpr('附件字段', { ns: NAMESPACE }),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              mode: 'multiple',
              placeholder: tExpr('选择要下载的附件字段', { ns: NAMESPACE }),
              options: attachmentFields.map(f => ({
                label: f.title,
                value: f.name,
              })),
              allowClear: true,
            },
            'x-decorator-props': {
              tooltip: tExpr('选择要批量下载的附件字段，留空则下载所有附件字段', { ns: NAMESPACE }),
            },
          },
        };
      },
      defaultParams(ctx) {
        const collection = getCollectionFromContext(ctx);
        const attachmentFields = getAttachmentFields(collection);
        // 默认选择所有附件字段
        return {
          attachmentFields: attachmentFields.map(f => f.name),
        };
      },
      handler(ctx, params) {
        ctx.model.setProps({
          attachmentFields: params.attachmentFields || [],
        });
      },
    },

    // 命名字段设置 - 选择用于命名文件夹的字段（多选）
    namingField: {
      title: tExpr('命名字段设置', { ns: NAMESPACE }),
      uiSchema(ctx) {
        const collection = getCollectionFromContext(ctx);
        const namingFields = getNamingFields(collection);

        return {
          folderNameFields: {
            type: 'array',
            title: tExpr('文件夹命名依据', { ns: NAMESPACE }),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              mode: 'multiple',
              placeholder: tExpr('选择用于文件夹命名的字段', { ns: NAMESPACE }),
              options: namingFields.map(f => ({
                label: f.title,
                value: f.name,
              })),
              allowClear: true,
            },
            'x-decorator-props': {
              tooltip: tExpr('选择一个或多个字段作为文件夹名称，留空则使用记录ID', { ns: NAMESPACE }),
            },
          },
        };
      },
      defaultParams(ctx) {
        return {
          folderNameFields: [],
        };
      },
      handler(ctx, params) {
        ctx.model.setProps({
          folderNameFields: params.folderNameFields || [],
        });
      },
    },

    // 分组设置 - 选择分组字段（单选，有值就分组，无值就不分组）
    grouping: {
      title: tExpr('分组设置', { ns: NAMESPACE }),
      uiSchema(ctx) {
        const collection = getCollectionFromContext(ctx);
        const groupByFields = getGroupByFields(collection);

        return {
          groupByField: {
            type: 'string',
            title: tExpr('分组字段', { ns: NAMESPACE }),
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: tExpr('不分组', { ns: NAMESPACE }),
              options: groupByFields.map(f => ({
                label: f.title,
                value: f.name,
              })),
              allowClear: true,
            },
            'x-decorator-props': {
              tooltip: tExpr('选择分组字段后，附件将按该字段值分组存储在不同文件夹中', { ns: NAMESPACE }),
            },
          },
        };
      },
      defaultParams() {
        return {
          groupByField: undefined,
        };
      },
      handler(ctx, params) {
        ctx.model.setProps({
          groupByField: params.groupByField,
        });
      },
    },
  },
});

// 点击下载 - 自动下载所有附件（无需配置字段）
BatchDownloadActionModel.registerFlow({
  key: 'downloadClick',
  on: 'click',
  steps: {
    download: {
      async defaultParams(ctx) {
        // 从设置中获取保存的参数
        const settingsFlow = ctx.model.getFlow('downloadSettings');
        if (settingsFlow) {
          const stepParams = ctx.model.getStepParams?.('downloadSettings') || {};
          return {
            attachmentFields: stepParams.attachmentFields?.attachmentFields || [],
            folderNameFields: stepParams.namingField?.folderNameFields || [],
            groupByField: stepParams.grouping?.groupByField,
          };
        }
        return {
          attachmentFields: [],
          folderNameFields: [],
          groupByField: undefined,
        };
      },
      async handler(ctx, params) {
        const api = ctx.api;
        const currentBlock = ctx.model.context.blockModel;
        const collectionName = getCollectionName(ctx);

        if (!collectionName) {
          ctx.message?.error?.(ctx.t('找不到数据表信息', { ns: NAMESPACE }));
          return;
        }

        try {
          const { resource } = currentBlock;
          let selectedRows: any[] = [];
          try {
            selectedRows = resource?.getSelectedRows?.() || [];
          } catch {}

          if (selectedRows.length === 0) {
            ctx.message?.warning?.(ctx.t('请先选择要下载的记录', { ns: NAMESPACE }));
            return;
          }

          const collection = currentBlock?.collection;
          let filterTargetKey = 'id';
          try {
            filterTargetKey = collection?.filterTargetKey || collection?.getPrimaryKey?.() || 'id';
          } catch {}
          const ids = selectedRows.map((r: any) => r[filterTargetKey] ?? r.id).filter((v: any) => v != null);
          const filter = { [filterTargetKey]: ids };

          // 使用配置的字段
          const folderNameFields = params.folderNameFields || [];
          const attachmentFields = params.attachmentFields || [];
          const groupByField = params.groupByField;

          ctx.message?.info?.(ctx.t('正在打包下载，请稍候...', { ns: NAMESPACE }));

          // 使用 attachments:batchDownload action
          const response = await api.request({
            url: 'attachments:batchDownload',
            method: 'POST',
            data: {
              collection: collectionName,
              filter,
              attachmentFields,
              folderNameFields,
              groupByField,
            },
            responseType: 'blob',
          });

          // 下载文件
          const blob = response.data as Blob;

          // 从响应头中获取文件名
          let fileName = `${collectionName}-${new Date().toISOString().split('T')[0]}.zip`;
          const contentDisposition = response.headers?.['content-disposition'];
          if (contentDisposition) {
            const match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
            if (match) {
              fileName = decodeURIComponent(match[1]);
            }
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);

          ctx.message?.success?.(ctx.t('批量下载完成', { ns: NAMESPACE }));
        } catch (error: any) {
          ctx.message?.error?.(ctx.t('批量下载失败', { ns: NAMESPACE }) + ': ' + (error?.message || String(error)));
        }
      },
    },
  },
});
