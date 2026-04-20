/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { useEffect, useCallback, useRef } from 'react';
import { useField } from '@formily/react';
import { useAPIClient, useCollectionField, useCollectionManager, useCollection, useRequest, useRecord } from '@nocobase/client';
import { useStorageUploadProps } from './useStorageUploadProps';

export function useStorageRules(storage) {
  const name = storage ?? '';
  const apiClient = useAPIClient();
  const field = useField<any>();
  const { loading, data, run } = useRequest<any>(
    {
      url: `storages:getBasicInfo/${name}`,
    },
    {
      manual: true,
      refreshDeps: [name],
      cacheKey: name,
    },
  );
  useEffect(() => {
    if (field.pattern !== 'editable') {
      return;
    }
    run();
  }, [field.pattern, run]);
  return (!loading && data?.data?.rules) || null;
}

/**
 * 支持上传后自动保存触发的附件字段 Hook
 * 在附件上传完成后自动调用 API 保存记录，从而触发工作流
 */
export function useAttachmentFieldProps() {
  const collectionField = useCollectionField();
  const collection = useCollection();
  const api = useAPIClient();
  const record = useRecord();
  const field = useField<any>();
  const lastSavedValueRef = useRef<any>(null);
  const isAutoSavingRef = useRef(false);

  console.log('[useAttachmentFieldProps] Hook called, collectionField:', collectionField?.name, 'collection:', collection?.name, 'recordId:', record?.id);

  const action = `${collectionField?.target}:create${
    collectionField?.storage ? `?attachmentField=${collectionField.collectionName}.${collectionField.name}` : ''
  }`;
  const storageUploadProps = useStorageUploadProps({ action });

  // 自定义 onChange，在上传完成后自动保存
  const handleChange = useCallback(
    async (value: any) => {
      console.log('[Attachment AutoSave] onChange triggered, value:', value);
      
      // 先设置字段值（模拟原 onChange 行为）
      field.setValue(value);

      // 如果有记录 ID，则自动保存触发工作流
      const recordId = record?.id;
      if (recordId && collection?.name && collectionField?.name && !isAutoSavingRef.current) {
        // 避免重复保存相同值
        const valueKey = JSON.stringify(value);
        if (lastSavedValueRef.current === valueKey) {
          console.log('[Attachment AutoSave] Same value, skip');
          return;
        }
        lastSavedValueRef.current = valueKey;
        isAutoSavingRef.current = true;

        try {
          // 提取附件 ID 列表
          const attachmentIds = Array.isArray(value)
            ? value.map((v: any) => v?.id || v).filter((id: any) => typeof id === 'number' || typeof id === 'string')
            : value?.id
              ? [value.id]
              : [];

          console.log('[Attachment AutoSave] Attachment IDs:', attachmentIds, 'recordId:', recordId);

          if (attachmentIds.length > 0) {
            // 调用更新 API，只更新附件字段
            const result = await api.resource(collection.name).update({
              filterByTk: recordId,
              values: {
                [collectionField.name]: attachmentIds,
              },
            });
            console.log('[Attachment AutoSave] API response:', result);
          }
        } catch (error) {
          console.error('[Attachment AutoSave] Failed:', error);
        } finally {
          isAutoSavingRef.current = false;
        }
      } else if (!recordId) {
        console.log('[Attachment AutoSave] No recordId, skip auto save');
      }
    },
    [api, collection?.name, collectionField?.name, record?.id, field]
  );

  const result = {
    action,
    ...storageUploadProps,
    onChange: handleChange,
  };
  
  console.log('[useAttachmentFieldProps] Returning props with onChange:', !!result.onChange);
  
  return result;
}

export function useFileCollectionStorageRules() {
  const field = useCollectionField();
  const collectionManager = useCollectionManager();
  const collection = collectionManager.getCollection(field?.target);
  return useStorageRules(collection?.getOption('storage'));
}
