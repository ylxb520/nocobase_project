/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { observer, useFlowContext } from '@nocobase/flow-engine';
import { Button, Divider, Empty, Flex, List, Modal, Space, Switch, Tooltip, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Card } from 'antd';
import { dayjs } from '@nocobase/utils/client';
import { DatasourceSettingForm } from './DatasourceSettingForm';
import { DatasourceSettingDetail } from './DatasourceSettingDetail';
const { Text } = Typography;
const AddButton = ({ children, ...props }) => {
  const ctx = useFlowContext();
  return React.createElement(
    Button,
    {
      ...props,
      onClick: () => {
        ctx.viewer.drawer({
          width: '50%',
          content: React.createElement(DatasourceSettingForm, null),
        });
      },
    },
    children,
  );
};
export const DatasourceSettingGrid = observer(() => {
  const ctx = useFlowContext();
  const data = ctx.resource.getData();
  return React.createElement(
    React.Fragment,
    null,
    data.length === 0
      ? React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', height: '80vh' } },
          React.createElement(
            Card,
            { style: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' } },
            React.createElement(
              Empty,
              { image: Empty.PRESENTED_IMAGE_SIMPLE },
              React.createElement(
                AddButton,
                { icon: React.createElement(PlusOutlined, null), type: 'primary' },
                React.createElement('span', null, ctx.t('Create a new datasource')),
              ),
            ),
          ),
        )
      : React.createElement(
          'div',
          { style: { width: '100%', overflowX: 'auto', padding: 8 } },
          React.createElement(
            Space,
            { direction: 'vertical', size: 'large', style: { width: '100%', minWidth: 1200 } },
            React.createElement(
              Flex,
              { justify: 'flex-end', align: 'center' },
              React.createElement(
                Space,
                null,
                React.createElement(
                  AddButton,
                  { icon: React.createElement(PlusOutlined, null), type: 'primary' },
                  React.createElement('span', null, ctx.t('Add datasource')),
                ),
              ),
            ),
            React.createElement(List, {
              grid: { gutter: 16, column: 4 },
              dataSource: data,
              loading: ctx.resource.loading,
              pagination: {
                showSizeChanger: false,
                total: ctx.resource.getMeta('count'),
                pageSize: ctx.resource.getPageSize(),
                onChange: (page, pageSize) => {
                  ctx.resource.setPage(page);
                  ctx.resource.setPageSize(pageSize);
                  ctx.resource.refresh();
                },
              },
              renderItem: (item) =>
                React.createElement(
                  List.Item,
                  null,
                  React.createElement(
                    Card,
                    {
                      hoverable: true,
                      variant: 'borderless',
                      style: { minWidth: 300, display: 'flex', flexDirection: 'column' },
                      onClick: () => {
                        ctx.viewer.drawer({
                          width: '50%',
                          content: React.createElement(DatasourceSettingDetail, { record: item }),
                        });
                      },
                    },
                    React.createElement(Card.Meta, {
                      title: React.createElement(
                        Flex,
                        { justify: 'space-between', align: 'center' },
                        React.createElement('span', null, item.title),
                        React.createElement(Switch, {
                          size: 'small',
                          defaultValue: item.enabled,
                          onClick: async (checked, event) => {
                            event.stopPropagation();
                            await ctx.resource.update(item.id, {
                              enabled: checked,
                            });
                          },
                        }),
                      ),
                      description: React.createElement(
                        Space,
                        { style: { fontSize: 13 } },
                        React.createElement(Text, { type: 'secondary' }, ctx.t('Collection')),
                        React.createElement(Text, null, `${item.datasource}/${item.collectionName}`),
                        React.createElement(Divider, { type: 'vertical' }),
                        React.createElement(Text, { type: 'secondary' }, ctx.t('Limit')),
                        React.createElement(Text, null, item.limit),
                      ),
                    }),
                    React.createElement(
                      'div',
                      { style: { height: 100, display: 'flex', flexDirection: 'column', flex: 1, paddingTop: 10 } },
                      React.createElement(
                        'div',
                        { style: { width: '100%', height: 90 } },
                        React.createElement(
                          Typography.Paragraph,
                          {
                            type: 'secondary',
                            ellipsis: {
                              rows: 2,
                            },
                          },
                          item.description,
                        ),
                      ),
                      React.createElement(
                        'div',
                        { style: { marginTop: 'auto' } },
                        React.createElement(
                          Flex,
                          { justify: 'space-between', align: 'center' },
                          React.createElement(
                            Space,
                            { style: { fontSize: 10 } },
                            React.createElement(
                              Text,
                              { type: 'secondary' },
                              `${ctx.t('Created at')} ${dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}`,
                            ),
                          ),
                          React.createElement(
                            Tooltip,
                            { title: ctx.t('Delete') },
                            React.createElement(Button, {
                              type: 'link',
                              icon: React.createElement(DeleteOutlined, null),
                              onClick: (e) => {
                                e.stopPropagation();
                                Modal.confirm({
                                  title: ctx.t('Confirm whether to delete'),
                                  icon: React.createElement(ExclamationCircleFilled, null),
                                  content: ctx.t('Are you sure delete this datasource?'),
                                  okText: ctx.t('Yes'),
                                  okType: 'danger',
                                  cancelText: ctx.t('No'),
                                  async onOk() {
                                    await ctx.resource.destroy(item.id);
                                    ctx.message.success(ctx.t('Datasource deleted successfully'));
                                  },
                                  onCancel() {},
                                });
                              },
                            }),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
            }),
          ),
        ),
  );
});
//# sourceMappingURL=DatasourceSettingGrid.js.map
