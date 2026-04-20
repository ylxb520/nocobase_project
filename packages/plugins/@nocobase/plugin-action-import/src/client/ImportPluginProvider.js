/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SchemaComponentOptions } from '@nocobase/client';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ImportActionInitializer, ImportDesigner, ImportWarning, DownloadTips } from '.';
import { ImportContext } from './context';
import { ImportModal, ImportStatus } from './ImportModal';
import { useDownloadXlsxTemplateAction, useImportStartAction } from './useImportAction';
import { useShared } from './useShared';
import { ImportAction } from './ImportAction';
export const ImportPluginProvider = (props) => {
  const { uploadValidator, beforeUploadHandler, validateUpload } = useShared();
  return React.createElement(
    SchemaComponentOptions,
    {
      components: { ImportActionInitializer, ImportDesigner, ImportWarning, DownloadTips, ImportAction },
      scope: {
        uploadValidator,
        validateUpload,
        beforeUploadHandler,
        useDownloadXlsxTemplateAction,
        useImportStartAction,
      },
    },
    React.createElement(ImportContextProvider, null, props.children),
  );
};
export const ImportContextProvider = (props) => {
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importStatus, setImportStatus] = useState(ImportStatus.IMPORTING);
  const [importResult, setImportResult] = useState(null);
  return React.createElement(
    ImportContext.Provider,
    {
      value: {
        importModalVisible,
        setImportModalVisible,
        importStatus,
        setImportStatus,
        importResult,
        setImportResult,
      },
    },
    createPortal(React.createElement(ImportModal, null), document.body),
    props.children,
  );
};
//# sourceMappingURL=ImportPluginProvider.js.map
