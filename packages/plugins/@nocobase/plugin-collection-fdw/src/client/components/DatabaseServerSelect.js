/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import React, { useState, createContext, useRef, useContext, useEffect } from 'react';
import { Select, Space, Divider, Menu, Modal, message, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { FormItem, useAPIClient } from '@nocobase/client';
import { RecursionField, useForm, observer } from '@formily/react';
import { CreateDatabaseServerAction } from './CreateDatabaseServerAction';
import { EditDatabaseServerAction } from './EditDatabaseServerAction';
export const DatabaseServerContext = createContext({ options: [], initialOptions: [] });
export const ServerContext = createContext({ item: {} });
const ServerContextProvider = ({ item, children }) => {
  return React.createElement(ServerContext.Provider, { value: { item } }, children);
};
export const DatabaseServerSelect = observer(
  (props) => {
    const { options, setOptions, initialOptions, refresh } = useContext(DatabaseServerContext);
    const [value, setValue] = useState(null);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const form = useForm();
    const api = useAPIClient();
    useEffect(() => {
      setValue(props.value);
    }, [props.value]);
    const handleDataServerChange = (item) => {
      setValue(item.name);
      form.setValuesIn('remoteServerName', item.name);
      form.setValuesIn('remoteTableName', null);
      setOpen(false);
    };
    const handleDelete = (data) => {
      Modal.confirm({
        title: t('Are you sure you want to delete it?'),
        onOk: async () => {
          await api.resource('databaseServers').destroy({ filterByTk: data.name });
          message.success(t('Saved successfully'));
          refresh();
        },
      });
    };
    return React.createElement(Select, {
      disabled: props.disabled,
      allowClear: true,
      showSearch: true,
      onClear: () => {
        setValue(null);
        form.setValuesIn('remoteServerName', null);
        form.setValuesIn('remoteTableName', null);
        setOpen(false);
      },
      value: value,
      open: open,
      style: { width: '100%' },
      onSearch: (value) => {
        setOptions(() =>
          initialOptions.filter((option) => option.description.toLowerCase().indexOf(value.toLowerCase()) >= 0),
        );
      },
      onDropdownVisibleChange: (visible) => setOpen(visible),
      dropdownRender: () => {
        return React.createElement(
          'div',
          null,
          options.length > 0
            ? React.createElement(
                Menu,
                null,
                options?.map((item) =>
                  React.createElement(
                    Menu.Item,
                    {
                      key: item.name,
                      onClick: () => handleDataServerChange(item),
                      style: { margin: '0px', height: '30px', lineHeight: '30px' },
                    },
                    item.description,
                    React.createElement(
                      Space,
                      { style: { float: 'right', display: 'inline-flex', color: '#1677FF' } },
                      React.createElement(
                        ServerContextProvider,
                        { item: item },
                        React.createElement(RecursionField, {
                          name: 'edit-server',
                          schema: {
                            name: 'edit-server',
                            'x-component': EditDatabaseServerAction,
                            type: 'void',
                            title: '{{ t("Edit database server") }}',
                            'x-component-props': {
                              setOpen,
                            },
                          },
                        }),
                      ),
                      React.createElement(Divider, { type: 'vertical' }),
                      React.createElement(
                        'span',
                        {
                          style: { cursor: 'pointer' },
                          onClick: (e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          },
                        },
                        t('Delete'),
                      ),
                    ),
                  ),
                ),
              )
            : React.createElement(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE }),
          React.createElement(Divider, { style: { margin: '8px 0' } }),
          React.createElement(
            Space,
            { style: { padding: '0 8px 4px' } },
            React.createElement(RecursionField, {
              name: 'create-server',
              schema: {
                name: 'create-server',
                'x-component': CreateDatabaseServerAction,
                type: 'void',
                title: '{{ t("Create database server") }}',
                'x-component-props': {
                  setOpen,
                  handleDataServerChange,
                },
              },
            }),
          ),
        );
      },
      fieldNames: { value: 'name', label: 'description' },
      options: options,
    });
  },
  { displayName: 'DatabaseServerSelect' },
);
export const DatabaseServerSelectProvider = (props) => {
  const [options, setOptions] = useState([]);
  const api = useAPIClient();
  const initialOptions = useRef();
  const refresh = () => {
    api
      .resource('databaseServers')
      .list()
      .then(({ data }) => {
        initialOptions.current = data?.data;
        setOptions(data?.data);
      })
      .catch(console.error);
  };
  useEffect(() => {
    try {
      refresh();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return React.createElement(
    DatabaseServerContext.Provider,
    { value: { options, setOptions, refresh, initialOptions: initialOptions.current } },
    React.createElement(FormItem, null, props.children),
  );
};
//# sourceMappingURL=DatabaseServerSelect.js.map
