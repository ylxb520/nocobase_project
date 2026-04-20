/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table as AntdTable, Checkbox, Tag, Select, Input, Form, theme } from 'antd';
import { useT } from '../../../locale';
import { useApp, useCollectionManager_deprecated, useRequest } from '@nocobase/client';
import { Schema } from '@formily/react';
import { cx, css } from '@emotion/css';
import { useFieldInterfaceOptions } from './useFieldInterfaceOptions';
const editableRowClassName = cx(
  'editable-row',
  css`
    .editable-cell {
      position: relative;
    }

    .editable-cell-value-wrap {
      padding: 5px 12px;
      cursor: pointer;
    }

    &:hover .editable-cell-value-wrap {
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      padding: 4px 11px;
    }

    [data-theme='dark'] &:hover .editable-cell-value-wrap {
      border: 1px solid #434343;
    }
  `,
);
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return React.createElement(
    Form,
    { form: form, component: false },
    React.createElement(EditableContext.Provider, { value: form }, React.createElement('tr', { ...props })),
  );
};
const EditableCell = ({
  title,
  editable,
  EditComponent,
  ReadComponent,
  children,
  dataIndex,
  record,
  collectionIndex,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      ref.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = ReadComponent?.(record) || children;
  if (editable) {
    const render =
      EditComponent?.({ ...record, save, ref }) ||
      React.createElement(Input, { ref: ref, onPressEnter: save, onBlur: save });
    childNode = editing
      ? React.createElement(
          Form.Item,
          { style: { margin: 0 }, name: dataIndex, rules: [{ required: true, message: `${title} is required.` }] },
          render,
        )
      : React.createElement(
          'div',
          { className: 'editable-cell-value-wrap', style: { paddingInlineEnd: 24 }, onClick: toggleEdit },
          childNode,
        );
  }
  return React.createElement('td', { ...restProps }, childNode);
};
const useColumns = (updateCollectionRecord) => {
  const t = useT();
  const columns = [
    {
      title: t('Collection display name'),
      dataIndex: 'title',
      key: 'title',
      width: 200,
      editable: true,
    },
    {
      title: t('Collection name'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      editable: true,
    },
    {
      title: t('Collection template'),
      dataIndex: 'template',
      key: 'template',
      width: 150,
      render: (value) => {
        if (!value) {
          return null;
        }
        const template = value.charAt(0).toUpperCase() + value.slice(1);
        return React.createElement(Tag, null, t(`${template} collection`));
      },
    },
    {
      title: t('Preset fields'),
      key: 'preset',
      width: 300,
      render: (_, record) => {
        const value = [];
        if (record.autoGenId !== false) {
          value.push('id');
        }
        if (record.createdAt !== false) {
          value.push('createdAt');
        }
        if (record.updatedAt !== false) {
          value.push('updatedAt');
        }
        if (record.createdBy) {
          value.push('createdBy');
        }
        if (record.updatedBy) {
          value.push('updatedBy');
        }
        return React.createElement(Checkbox.Group, {
          options: [
            {
              label: 'ID',
              value: 'id',
            },
            {
              label: t('Created at'),
              value: 'createdAt',
            },
            {
              label: t('Last Updated at'),
              value: 'updatedAt',
            },
            {
              label: t('Created by'),
              value: 'createdBy',
            },
            {
              label: t('Last updated by'),
              value: 'updatedBy',
            },
          ],
          defaultValue: value,
          disabled: true,
        });
      },
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      width: 350,
    },
  ];
  return columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record, collectionIndex) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: (record) => updateCollectionRecord(collectionIndex, record),
      }),
    };
  });
};
const useExpandColumns = (record, collectionIndex, updateFieldRecord) => {
  const t = useT();
  const app = useApp();
  const fim = app.dataSourceManager.collectionFieldInterfaceManager;
  const columns = [
    AntdTable.EXPAND_COLUMN,
    {
      title: t('Field display name'),
      dataIndex: 'title',
      width: 200,
      key: 'title',
      editable: true,
    },
    {
      title: t('Field name'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      editable: true,
    },
    {
      title: t('Field interface'),
      width: 200,
      dataIndex: 'interface',
      key: 'interface',
      editable: true,
      EditComponent: ({ interface: value, save, ref }) => {
        const result = useRequest({
          url: 'app:getInfo',
        });
        const interfaceOptions = useFieldInterfaceOptions();
        const fieldInterface = fim.getFieldInterface(value);
        const { getTemplate } = useCollectionManager_deprecated();
        const { availableFieldInterfaces } = getTemplate(record.template) || {};
        const { exclude, include } = availableFieldInterfaces || {};
        const optionArr = [];
        interfaceOptions.forEach((v) => {
          if (v.key === 'systemInfo') {
            optionArr.push({
              ...v,
              options: v.options.filter((v) => {
                if (v.hidden) {
                  return false;
                } else if (v.value === 'tableoid') {
                  if (include?.length) {
                    return include.includes(v.value);
                  }
                  return result.data?.data?.database?.dialect === 'postgres';
                } else {
                  return typeof record[v.value] === 'boolean' ? record[v.value] : true;
                }
              }),
            });
          } else {
            let options = [];
            if (include?.length) {
              include.forEach((k) => {
                const field = v?.options?.find((h) => [k, k.interface].includes(h.name));
                field &&
                  options.push({
                    ...field,
                    targetScope: k?.targetScope,
                  });
              });
            } else if (exclude?.length) {
              options = v?.options?.filter((v) => {
                return !exclude.includes(v.name);
              });
            } else {
              options = v?.options;
            }
            options?.length &&
              optionArr.push({
                ...v,
                options: options.filter((child) => !['o2o', 'subTable', 'linkTo'].includes(child.name)),
              });
          }
        });
        return React.createElement(Select, {
          ref: ref,
          options: optionArr,
          defaultValue: fieldInterface ? Schema.compile(fieldInterface.title, { t }) : value,
          onBlur: save,
        });
      },
      ReadComponent: ({ interface: value }) => {
        if (!value) {
          return null;
        }
        const fieldInterface = fim.getFieldInterface(value);
        return React.createElement(Tag, null, fieldInterface ? Schema.compile(fieldInterface.title, { t }) : value);
      },
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      width: 350,
    },
  ];
  return columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record, fieldIndex) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        EditComponent: col.EditComponent,
        ReadComponent: col.ReadComponent,
        handleSave: (record) => updateFieldRecord(collectionIndex, fieldIndex, record),
      }),
    };
  });
};
const ExpandedFieldRowRender = ({ record }) => {
  const { token } = theme.useToken();
  return React.createElement(
    React.Fragment,
    null,
    record.enum &&
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          {
            style: {
              color: token.colorTextSecondary,
              marginRight: '8px',
              marginLeft: '48px',
            },
          },
          'Enumurations:',
        ),
        record.enum.map((item) => React.createElement(Tag, { key: item.value }, item.label, ' (', item.value, ')')),
      ),
    record.target &&
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          {
            style: {
              color: '#999',
              marginRight: '8px',
              marginLeft: '48px',
            },
          },
          'Target:',
        ),
        React.createElement('span', null, record.target),
      ),
    record.targetKey &&
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          {
            style: {
              color: '#999',
              marginRight: '8px',
              marginLeft: '48px',
            },
          },
          'TargetKey:',
        ),
        React.createElement('span', null, record.targetKey),
      ),
    record.sourceKey &&
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          {
            style: {
              color: '#999',
              marginRight: '8px',
              marginLeft: '48px',
            },
          },
          'SourceKey:',
        ),
        React.createElement('span', null, record.sourceKey),
      ),
    record.foreignKey &&
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          {
            style: {
              color: '#999',
              marginRight: '8px',
              marginLeft: '48px',
            },
          },
          'ForeignKey:',
        ),
        React.createElement('span', null, record.foreignKey),
      ),
    record.otherKey &&
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          {
            style: {
              color: '#999',
              marginRight: '8px',
              marginLeft: '48px',
            },
          },
          'OtherKey:',
        ),
        React.createElement('span', null, record.otherKey),
      ),
  );
};
const ExpandedCollectionRowRender = ({ record, collectionIndex, updateFieldRecord }) => {
  const expandColumns = useExpandColumns(record, collectionIndex, updateFieldRecord);
  return React.createElement(AntdTable, {
    rowKey: 'name',
    rowClassName: editableRowClassName,
    columns: expandColumns,
    components: {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    },
    dataSource: record.fields,
    pagination: false,
    expandable: {
      rowExpandable: (record) => record.enum?.length > 0 || ['m2m', 'm2o', 'o2m', 'o2o'].includes(record.interface),
      expandedRowRender: (record) => React.createElement(ExpandedFieldRowRender, { record: record }),
    },
  });
};
export const Table = ({ collections, updateCollectionRecord, updateFieldRecord }) => {
  const columns = useColumns(updateCollectionRecord);
  return React.createElement(AntdTable, {
    scroll: {
      y: '55vh',
    },
    style: {
      height: '65vh',
    },
    rowKey: 'name',
    rowClassName: editableRowClassName,
    columns: columns,
    dataSource: collections,
    components: {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    },
    expandable: {
      expandedRowRender: (record, collectionIndex) =>
        React.createElement(ExpandedCollectionRowRender, {
          record: record,
          collectionIndex: collectionIndex,
          updateFieldRecord: updateFieldRecord,
        }),
      rowExpandable: (record) => record.fields && record.fields.length > 0,
    },
  });
};
//# sourceMappingURL=Table.js.map
