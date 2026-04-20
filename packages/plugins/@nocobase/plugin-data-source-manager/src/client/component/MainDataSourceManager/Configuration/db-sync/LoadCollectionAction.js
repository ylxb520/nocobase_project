/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useState, useMemo, useCallback } from 'react';
import { Button, Drawer, Transfer, message, App, Spin } from 'antd';
import { useAPIClient, useDataSource } from '@nocobase/client';
import { useResourceActionContext, useResourceContext } from '@nocobase/client';
import { useDSMTranslation } from '../../../../locale';
export const LoadCollection = (props) => {
  const { ...restProps } = props;
  const { t } = useDSMTranslation();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableCollections, setAvailableCollections] = useState([]);
  const api = useAPIClient();
  const { resource } = useResourceContext();
  const { refresh } = useResourceActionContext();
  const { modal } = App.useApp();
  const ds = useDataSource();
  const getSelectableCollections = useCallback(async () => {
    try {
      const response = await api.resource('dataSources').readTables({
        values: { dataSourceKey: 'main' },
      });
      const collections = response.data?.data || [];
      return collections.map((item) => ({
        key: item.name,
        name: item.name,
        title: item.title || item.name,
      }));
    } catch (error) {
      console.error('Failed to fetch selectable tables:', error);
      return [];
    }
  }, [api]);
  const initializeData = useCallback(async () => {
    setLoading(true);
    try {
      const selectableCollections = await getSelectableCollections();
      setAvailableCollections(selectableCollections);
      setTargetKeys([]);
    } catch (error) {
      message.error(t('Failed to initialize data'));
    } finally {
      setLoading(false);
    }
  }, [getSelectableCollections, t]);
  const handleSearch = useCallback((direction, value) => {
    setSearchValue(value);
  }, []);
  const handleChange = useCallback((newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  }, []);
  const handleSelectChange = useCallback((sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  }, []);
  const handleSubmit = useCallback(async () => {
    if (targetKeys.length === 0) {
      message.warning(t('Please select at least one table'));
      return;
    }
    try {
      setLoading(true);
      modal.confirm({
        title: t('Confirm load tables'),
        content: t('Are you sure you want to load {{count}} table(s)?', { count: targetKeys.length }),
        onOk: async () => {
          try {
            await api.resource('dataSources').loadTables({
              values: {
                dataSourceKey: 'main',
                tables: targetKeys,
              },
            });
            message.success(t('Tables loaded successfully'));
            setOpen(false);
            setTargetKeys([]);
            setSelectedKeys([]);
            setSearchValue('');
            refresh();
            ds.reload();
          } catch (error) {
            console.error('Failed to load tables:', error);
            message.error(t('Failed to load tables'));
          }
        },
      });
    } catch (error) {
      message.error(t('Failed to load tables'));
    } finally {
      setLoading(false);
    }
  }, [targetKeys, api, t, modal, refresh]);
  const handleCancel = useCallback(() => {
    setOpen(false);
    setTargetKeys([]);
    setSelectedKeys([]);
    setSearchValue('');
  }, []);
  const showDrawer = useCallback(() => {
    setOpen(true);
    initializeData();
  }, [initializeData]);
  const filteredDataSource = useMemo(() => {
    if (!searchValue) return availableCollections;
    return availableCollections.filter(
      (item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchValue.toLowerCase())),
    );
  }, [availableCollections, searchValue]);
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('div', { onClick: showDrawer, ...restProps }, t('Load tables from database')),
    React.createElement(
      Drawer,
      {
        title: t('Load tables from database'),
        placement: 'right',
        onClose: handleCancel,
        open: open,
        width: 800,
        footer: React.createElement(
          'div',
          { style: { textAlign: 'right' } },
          React.createElement(Button, { onClick: handleCancel, style: { marginRight: 8 } }, t('Cancel')),
          React.createElement(
            Button,
            { type: 'primary', onClick: handleSubmit, loading: loading, disabled: targetKeys.length === 0 },
            t('Submit'),
          ),
        ),
      },
      React.createElement(
        'div',
        { style: { height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' } },
        React.createElement(
          Spin,
          { spinning: loading, style: { height: '100%' } },
          React.createElement(Transfer, {
            dataSource: filteredDataSource,
            titles: [t('Available tables'), t('Selected tables')],
            targetKeys: targetKeys,
            selectedKeys: selectedKeys,
            onChange: handleChange,
            onSelectChange: handleSelectChange,
            onSearch: handleSearch,
            render: (item) => item.title,
            showSearch: true,
            style: { height: '100%' },
            listStyle: {
              width: 350,
              height: 'calc(100vh - 100px)',
            },
            locale: {
              itemUnit: t('item'),
              itemsUnit: t('items'),
              searchPlaceholder: t('Search collections...'),
            },
          }),
        ),
      ),
    ),
  );
};
export default LoadCollection;
//# sourceMappingURL=LoadCollectionAction.js.map
