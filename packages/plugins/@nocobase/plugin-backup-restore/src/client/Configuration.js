/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { InboxOutlined, PlusOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import { FormItem } from '@formily/antd-v5';
import { Checkbox, DatePicker, useAPIClient, useCompile } from '@nocobase/client';
import { Alert, App, Button, Card, Divider, Modal, Space, Spin, Table, Tabs, Upload, message } from 'antd';
import { saveAs } from 'file-saver';
import React, { useEffect, useMemo, useState } from 'react';
import { useDuplicatorTranslation } from './locale';
const { Dragger } = Upload;
function useUploadProps(props) {
  const onChange = (param) => {
    props.onChange?.(param);
  };
  const api = useAPIClient();
  return {
    ...props,
    customRequest({ action, data, file, filename, headers, onError, onProgress, onSuccess, withCredentials }) {
      const formData = new FormData();
      if (data) {
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });
      }
      formData.append(filename, file);
      // eslint-disable-next-line promise/catch-or-return
      api.axios
        .post(action, formData, {
          withCredentials,
          headers,
          onUploadProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
          },
        })
        .then(({ data }) => {
          onSuccess(data, file);
        })
        .catch(onError)
        .finally(() => {});
      return {
        abort() {
          console.log('upload progress is aborted.');
        },
      };
    },
    onChange,
  };
}
const LearnMore = (props) => {
  const { collectionsData } = props;
  const { t } = useDuplicatorTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState(collectionsData);
  useEffect(() => {
    setDataSource(collectionsData);
  }, [collectionsData]);
  const apiClient = useAPIClient();
  const compile = useCompile();
  const resource = useMemo(() => {
    return apiClient.resource('backupFiles');
  }, [apiClient]);
  const showModal = async () => {
    if (props.isBackup) {
      const data = await resource.dumpableCollections();
      setDataSource(data?.data);
      setIsModalOpen(true);
    }
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: t('Collection'),
      dataIndex: 'collection',
      key: 'collection',
      render: (_, data) => {
        const title = compile(data.title);
        const name = data.name;
        return name === title
          ? title
          : React.createElement(
              'div',
              null,
              data.name,
              ' ',
              React.createElement(
                'span',
                { style: { color: 'rgba(0, 0, 0, 0.3)', fontSize: '0.9em' } },
                '(',
                compile(data.title),
                ')',
              ),
            );
      },
    },
    {
      title: t('Origin'),
      dataIndex: 'origin',
      key: 'origin',
      width: '50%',
    },
  ];
  const items = Object.keys(dataSource || {}).map((item) => {
    return {
      key: item,
      label: t(`${item}.title`),
      children: React.createElement(
        React.Fragment,
        null,
        React.createElement(Alert, { style: { marginBottom: 16 }, message: t(`${item}.description`) }),
        React.createElement(Table, {
          pagination: { pageSize: 100 },
          bordered: true,
          size: 'small',
          dataSource: dataSource[item],
          columns: columns,
          scroll: { y: 400 },
        }),
      ),
    };
  });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('a', { onClick: showModal }, t('Learn more')),
    React.createElement(
      Modal,
      {
        title: t('Backup instructions'),
        width: '80vw',
        open: isModalOpen,
        footer: null,
        onOk: handleOk,
        onCancel: handleCancel,
      },
      React.createElement(Tabs, { defaultActiveKey: 'required', items: items }),
    ),
  );
};
const Restore = ({ ButtonComponent = Button, title, upload = false, fileData }) => {
  const { t } = useDuplicatorTranslation();
  const [dataTypes, setDataTypes] = useState(['required']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [restoreData, setRestoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiClient = useAPIClient();
  const resource = useMemo(() => {
    return apiClient.resource('backupFiles');
  }, [apiClient]);
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    setDataSource(
      Object.keys(restoreData?.dumpableCollectionsGroupByGroup || []).map((key) => ({
        value: key,
        label: t(`${key}.title`),
        disabled: ['required', 'skipped'].includes(key),
      })),
    );
  }, [restoreData]);
  const showModal = async () => {
    setIsModalOpen(true);
    if (!upload) {
      setLoading(true);
      const { data } = await resource.get({ filterByTk: fileData.name });
      setDataSource(
        Object.keys(data?.data?.meta?.dumpableCollectionsGroupByGroup || []).map((key) => ({
          value: key,
          label: t(`${key}.title`),
          disabled: ['required', 'skipped'].includes(key),
        })),
      );
      setRestoreData(data?.data?.meta);
      setLoading(false);
    }
  };
  const handleOk = () => {
    resource.restore({
      values: {
        dataTypes,
        filterByTk: fileData?.name,
        key: restoreData?.key,
      },
    });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setRestoreData(null);
    setDataTypes(['required']);
  };
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(ButtonComponent, { onClick: showModal }, title),
    React.createElement(
      Modal,
      {
        title: t('Restore'),
        width: 800,
        footer: upload && !restoreData ? null : undefined,
        open: isModalOpen,
        onOk: handleOk,
        onCancel: handleCancel,
      },
      React.createElement(
        Spin,
        { spinning: loading },
        upload && !restoreData && React.createElement(RestoreUpload, { setRestoreData: setRestoreData }),
        (!upload || restoreData) && [
          React.createElement(
            'strong',
            { style: { fontWeight: 600, display: 'block', margin: '16px 0 8px' }, key: 'info' },
            t('Select the data to be restored'),
            ' (',
            React.createElement(LearnMore, { collectionsData: restoreData?.dumpableCollectionsGroupByGroup }),
            '):',
          ),
          React.createElement(
            'div',
            { style: { lineHeight: 2, marginBottom: 8 }, key: 'dataType' },
            React.createElement(
              FormItem,
              null,
              React.createElement(Checkbox.Group, {
                options: dataSource,
                style: { flexDirection: 'column' },
                value: dataTypes,
                onChange: (checkValue) => setDataTypes(checkValue),
              }),
            ),
          ),
        ],
      ),
    ),
  );
};
const NewBackup = ({ ButtonComponent = Button, refresh }) => {
  const { t } = useDuplicatorTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataTypes, setBackupData] = useState(['required']);
  const apiClient = useAPIClient();
  const [dataSource, setDataSource] = useState([]);
  const showModal = async () => {
    const { data } = await apiClient.resource('backupFiles').dumpableCollections();
    setDataSource(
      Object.keys(data || []).map((key) => ({
        value: key,
        label: t(`${key}.title`),
        disabled: ['required', 'skipped'].includes(key),
      })),
    );
    setIsModalOpen(true);
  };
  const handleOk = () => {
    apiClient.request({
      url: 'backupFiles:create',
      method: 'post',
      data: {
        dataTypes,
      },
    });
    setIsModalOpen(false);
    setBackupData(['required']);
    setTimeout(() => {
      refresh();
    }, 500);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setBackupData(['required']);
  };
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      ButtonComponent,
      { icon: React.createElement(PlusOutlined, null), type: 'primary', onClick: showModal },
      t('New backup'),
    ),
    React.createElement(
      Modal,
      { title: t('New backup'), width: 800, open: isModalOpen, onOk: handleOk, onCancel: handleCancel },
      React.createElement(
        'strong',
        { style: { fontWeight: 600, display: 'block', margin: '16px 0 8px' } },
        t('Select the data to be backed up'),
        ' (',
        React.createElement(LearnMore, { isBackup: true }),
        '):',
      ),
      React.createElement(
        'div',
        { style: { lineHeight: 2, marginBottom: 8 } },
        React.createElement(Checkbox.Group, {
          options: dataSource,
          style: { flexDirection: 'column' },
          onChange: (checkValue) => setBackupData(checkValue),
          value: dataTypes,
        }),
      ),
    ),
  );
};
const RestoreUpload = (props) => {
  const { t } = useDuplicatorTranslation();
  const uploadProps = {
    multiple: false,
    action: '/backupFiles:upload',
    onChange(info) {
      if (info.fileList.length > 1) {
        info.fileList.splice(0, info.fileList.length - 1); // 只保留一个文件
      }
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} ` + t('file uploaded successfully'));
        props.setRestoreData({ ...info.file.response?.data?.meta, key: info.file.response?.data.key });
      } else if (status === 'error') {
        message.error(`${info.file.name} ` + t('file upload failed'));
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  return React.createElement(
    Dragger,
    { ...useUploadProps(uploadProps) },
    React.createElement('p', { className: 'ant-upload-drag-icon' }, React.createElement(InboxOutlined, null)),
    React.createElement('p', { className: 'ant-upload-text' }, ' ', t('Click or drag file to this area to upload')),
  );
};
export const BackupAndRestoreList = () => {
  const { t } = useDuplicatorTranslation();
  const apiClient = useAPIClient();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadTarget, setDownloadTarget] = useState(false);
  const { modal } = App.useApp();
  const resource = useMemo(() => {
    return apiClient.resource('backupFiles');
  }, [apiClient]);
  useEffect(() => {
    queryFieldList();
  }, []);
  const queryFieldList = async () => {
    setLoading(true);
    const { data } = await resource.list();
    setDataSource(data.data);
    setLoading(false);
  };
  const handleDownload = async (fileData) => {
    setDownloadTarget(fileData.name);
    const data = await apiClient.request({
      url: 'backupFiles:download',
      method: 'get',
      params: {
        filterByTk: fileData.name,
      },
      responseType: 'blob',
    });
    setDownloadTarget(false);
    const blob = new Blob([data.data]);
    saveAs(blob, fileData.name);
  };
  const handleRefresh = async () => {
    await queryFieldList();
  };
  const handleDestory = (fileData) => {
    modal.confirm({
      title: t('Delete record', { ns: 'client' }),
      content: t('Are you sure you want to delete it?', { ns: 'client' }),
      onOk: async () => {
        await resource.destroy({ filterByTk: fileData.name });
        await queryFieldList();
        message.success(t('Deleted successfully'));
      },
    });
  };
  return React.createElement(
    'div',
    null,
    React.createElement(
      Card,
      { bordered: false },
      React.createElement(
        Space,
        { style: { float: 'right', marginBottom: 16 } },
        React.createElement(
          Button,
          { onClick: handleRefresh, icon: React.createElement(ReloadOutlined, null) },
          t('Refresh'),
        ),
        React.createElement(Restore, {
          upload: true,
          title: React.createElement(
            React.Fragment,
            null,
            React.createElement(UploadOutlined, null),
            ' ',
            t('Restore backup from local'),
          ),
        }),
        React.createElement(NewBackup, { refresh: handleRefresh }),
      ),
      React.createElement(Table, {
        dataSource: dataSource,
        loading: loading,
        columns: [
          {
            title: t('Backup file'),
            dataIndex: 'name',
            width: 400,
            onCell: (data) => {
              return data.inProgress
                ? {
                    colSpan: 4,
                  }
                : {};
            },
            render: (name, data) =>
              data.inProgress
                ? React.createElement(
                    'div',
                    { style: { color: 'rgba(0, 0, 0, 0.88)' } },
                    name,
                    '(',
                    t('Backing up'),
                    '...)',
                  )
                : React.createElement('div', null, name),
          },
          {
            title: t('File size'),
            dataIndex: 'fileSize',
            onCell: (data) => {
              return data.inProgress
                ? {
                    colSpan: 0,
                  }
                : {};
            },
          },
          {
            title: t('Created at', { ns: 'client' }),
            dataIndex: 'createdAt',
            onCell: (data) => {
              return data.inProgress
                ? {
                    colSpan: 0,
                  }
                : {};
            },
            render: (value) => {
              return React.createElement(DatePicker.ReadPretty, { value: value, showTime: true });
            },
          },
          {
            title: t('Actions', { ns: 'client' }),
            dataIndex: 'actions',
            onCell: (data) => {
              return data.inProgress
                ? {
                    colSpan: 0,
                  }
                : {};
            },
            render: (_, record) =>
              React.createElement(
                Space,
                { split: React.createElement(Divider, { type: 'vertical' }) },
                React.createElement(Restore, { ButtonComponent: 'a', title: t('Restore'), fileData: record }),
                React.createElement('a', { type: 'link', onClick: () => handleDownload(record) }, t('Download')),
                React.createElement('a', { onClick: () => handleDestory(record) }, t('Delete')),
              ),
          },
        ],
      }),
    ),
  );
};
//# sourceMappingURL=Configuration.js.map
