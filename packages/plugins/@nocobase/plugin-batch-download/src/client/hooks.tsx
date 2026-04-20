/**
 * 批量下载 Hook
 * 2.0.8 版本适配：移除硬编码兜底，强制使用当前表格资源
 */
import { useField, useDataBlockResource, useTableBlockContext } from '@nocobase/client';
import { App } from 'antd';
import { useCallback, useState } from 'react';

/**
 * 批量下载操作的 Props
 */
export const useBatchDownloadActionProps = () => {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const field: any = useField();
  const resource = useDataBlockResource();
  const tableBlockContext = useTableBlockContext();

  const handleDownload = useCallback(async () => {
    // 获取要下载的记录 ID
    let recordIds: (number | string)[] = [];

    // 从 tableBlockContext 获取选中行
    const selectedRowKeys = tableBlockContext?.field?.data?.selectedRowKeys;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      recordIds = selectedRowKeys;
    } else if (field?.data?.selectedRowKeys?.length > 0) {
      recordIds = field.data.selectedRowKeys;
    }

    if (recordIds.length === 0) {
      message.warning('请先选择要下载附件的记录');
      return;
    }

    setLoading(true);

    try {
      // 2.0.8 版本移除硬编码兜底，强制使用当前表格资源（避免错误）
      const resName = tableBlockContext?.resource?.name || resource?.name;
      if (!resName) {
        message.error('无法获取当前表格的资源名称，请检查表格配置');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/${resName}:batchDownloadAttachments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: recordIds }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `请求失败: ${response.status}`);
      }

      // 获取文件名
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = `附件批量下载_${Date.now()}.zip`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          fileName = decodeURIComponent(match[1]);
        }
      }

      // 下载文件
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success(`成功下载 ${recordIds.length} 条记录的附件`);
    } catch (error: unknown) {
      console.error('批量下载失败:', error);
      const errorMessage = error instanceof Error ? error.message : '批量下载失败，请重试';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [resource, field, message, tableBlockContext]);

  return {
    loading,
    onClick: handleDownload,
  };
};

export default useBatchDownloadActionProps;
