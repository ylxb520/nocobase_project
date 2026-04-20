/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { css } from '@nocobase/client';
import { Button, Modal, Space, Spin } from 'antd';
import { saveAs } from 'file-saver';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACE } from './constants';
import { useImportContext } from './context';
export const ImportStatus = {
  IMPORTING: 1,
  IMPORTED: 2,
};
export const ImportModal = (props) => {
  const { t } = useTranslation(NAMESPACE);
  const { importModalVisible, importStatus, importResult, setImportModalVisible } = useImportContext();
  const { data: fileData, meta } = importResult ?? {};
  const doneHandler = () => {
    setImportModalVisible(false);
  };
  const downloadFailureDataHandler = () => {
    const arrayBuffer = new Int8Array(fileData?.data);
    const blob = new Blob([arrayBuffer], { type: 'application/x-xls' });
    saveAs(blob, `fail.xlsx`);
  };
  const renderResult = (importResult) => {
    if (!importResult) {
      return null;
    }
    const { data, meta } = importResult;
    if (meta) {
      return t('{{successCount}} records have been successfully imported', {
        ...(meta ?? {}),
      });
    }
    const stats = data;
    const parts = [
      `${t('Total records')}: ${stats.total || 0}`,
      `${t('Successfully imported')}: ${stats.success || 0}`,
    ];
    if (stats.skipped > 0) {
      parts.push(`${t('Skipped')}: ${stats.skipped}`);
    }
    if (stats.updated > 0) {
      parts.push(`${t('Updated')}: ${stats.updated}`);
    }
    return parts.join(', ');
  };
  return React.createElement(
    Modal,
    {
      title: t('Import Data'),
      width: '50%',
      styles: { body: { height: 'calc(80vh - 200px)' } },
      open: importModalVisible,
      footer: null,
      closable: importStatus === ImportStatus.IMPORTED,
      onCancel: doneHandler,
    },
    React.createElement(
      'div',
      {
        className: css`
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        `,
      },
      importStatus === ImportStatus.IMPORTING &&
        React.createElement(Spin, {
          indicator: React.createElement(LoadingOutlined, { style: { fontSize: 24 }, spin: true }),
          tip: t('Excel data importing'),
        }),
      importStatus === ImportStatus.IMPORTED &&
        React.createElement(
          Space,
          { direction: 'vertical', align: 'center' },
          React.createElement(ExclamationCircleFilled, { style: { fontSize: 72, color: '#1890ff' } }),
          React.createElement('p', null, renderResult(importResult)),
          React.createElement(
            Space,
            null,
            meta?.failureCount > 0 &&
              React.createElement(Button, { onClick: downloadFailureDataHandler }, t('To download the failure data')),
            React.createElement(Button, { type: 'primary', onClick: doneHandler }, t('Done')),
          ),
        ),
    ),
  );
};
//# sourceMappingURL=ImportModal.js.map
