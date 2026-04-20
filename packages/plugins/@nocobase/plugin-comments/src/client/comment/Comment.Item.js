/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { RecursionField, observer, useField } from '@formily/react';
import {
  RecordProvider,
  useBlockRequestContext,
  useCollectionFields,
  useCollectionParentRecordData,
} from '@nocobase/client';
import { Button, Card, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from '../locale';
import useStyles from './style';
export const CommentItem = observer((props) => {
  const { editing, setEditing } = props;
  const field = useField();
  const { t } = useTranslation();
  const { componentCls } = useStyles();
  const parentRecordData = useCollectionParentRecordData();
  const { resource, service } = useBlockRequestContext();
  const saveComment = useCallback(async () => {
    await resource.update({
      filterByTk: field.value?.id,
      values: {
        content: field?.value?.content,
      },
    });
    service.refresh();
  }, [resource, service, field.value]);
  const collectionFields = useCollectionFields();
  const contentFieldComponentProps = useMemo(() => {
    return collectionFields.find((f) => f.name === 'content')?.uiSchema?.['x-component-props'];
  }, [collectionFields]);
  return React.createElement(
    RecordProvider,
    { record: field.value, parent: parentRecordData },
    React.createElement(
      'div',
      { className: `${componentCls}-item-container` },
      React.createElement('div', { className: `${componentCls}-item-container-line` }),
      React.createElement(
        Card,
        {
          size: 'small',
          title: React.createElement(
            'div',
            { className: `${componentCls}-item-title` },
            React.createElement(
              'div',
              { className: `${componentCls}-item-title-left` },
              React.createElement('span', null, field?.value?.createdBy?.nickname),
              React.createElement('span', null, t('commented')),
              React.createElement(
                Tooltip,
                { title: dayjs(field?.value?.createdAt).format('YYYY-MM-DD HH:mm:ss') },
                React.createElement('span', null, dayjs(field?.value?.createdAt).fromNow()),
              ),
            ),
            React.createElement('div', { className: `${componentCls}-item-title-right` }, props.children),
          ),
        },
        React.createElement(
          'div',
          { className: `${componentCls}-item-editor` },
          React.createElement(RecursionField, {
            basePath: field.address,
            name: 'content',
            schema: {
              type: 'string',
              name: 'content',
              'x-component': 'MarkdownVditor',
              'x-component-props': {
                ...contentFieldComponentProps,
                value: field?.value?.content,
              },
              'x-read-pretty': true,
            },
          }),
          editing &&
            React.createElement(
              'div',
              { className: `${componentCls}-item-editor-button-area` },
              React.createElement(
                Button,
                {
                  type: 'primary',
                  onClick: () => {
                    setEditing(false);
                    saveComment();
                    field.form.setFieldState(`${field.address}.content`, (state) => {
                      state.pattern = 'readPretty';
                    });
                  },
                },
                t('Update Comment'),
              ),
              React.createElement(
                Button,
                {
                  onClick: () => {
                    field.form.setFieldState(`${field.address}.content`, (state) => {
                      state.pattern = 'readPretty';
                    });
                    setEditing(false);
                  },
                },
                t('Cancel'),
              ),
            ),
        ),
      ),
    ),
  );
});
//# sourceMappingURL=Comment.Item.js.map
