/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button, Divider, Empty, Flex, Layout, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import React, { useCallback, useMemo, useState } from 'react';
import { DatasourceList } from './DatasourceList';
import { FlowModel, FlowModelRenderer, observer, useFlowContext, useFlowViewContext } from '@nocobase/flow-engine';
import { CollectionContext, CurrentCollection } from '../admin/datasource/context';
import { Preview } from '../admin/datasource/components/form-steps';
import { DEFAULT_DATA_SOURCE_KEY } from '@nocobase/client';
import { namespace } from '../../locale';
import { dialogController } from '../stores/dialog-controller';
const { Sider, Content } = Layout;
export const InnerDatasourceSelector = observer(({ contextItems, onAdd, onRemove }) => {
  const ctx = useFlowViewContext();
  const resourceCtx = useFlowContext();
  const dataSource = resourceCtx.resource.getData();
  const { Header } = ctx.view;
  const [collection, setCollection] = useState(null);
  const [formData, setFormData] = useState(null);
  const onSelect = useCallback(
    (item) => {
      const { datasource, collectionName } = item;
      setCollection(ctx.dataSourceManager.getCollection(datasource, collectionName));
      setFormData(item);
    },
    [ctx],
  );
  const closeBtn = React.createElement(Button, {
    type: 'text',
    icon: React.createElement(CloseOutlined, null),
    onClick: () => {
      dialogController.resume();
      ctx.view.close();
    },
  });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      { style: { backgroundColor: '#f5f5f5', borderRadius: 8 } },
      React.createElement(Header, {
        title: React.createElement(
          React.Fragment,
          null,
          React.createElement(
            Space,
            null,
            closeBtn,
            React.createElement('span', null, resourceCtx.t('Select datasource')),
          ),
        ),
      }),
      dataSource.length
        ? React.createElement(
            Layout,
            { style: { height: '80vh', backgroundColor: '#f5f5f5' } },
            React.createElement(
              Sider,
              { width: 300, style: { paddingLeft: 20, backgroundColor: 'transparent' } },
              React.createElement(
                Flex,
                { align: 'center', vertical: true },
                React.createElement(DatasourceList, {
                  onSelect: onSelect,
                  contextItems: contextItems,
                  onAdd: onAdd,
                  onRemove: onRemove,
                }),
              ),
            ),
            React.createElement(Divider, {
              type: 'vertical',
              variant: 'dashed',
              style: { height: '95%', margin: 'auto 0px auto 10px' },
            }),
            React.createElement(
              Content,
              { style: { backgroundColor: 'transparent' } },
              React.createElement(
                CollectionContext.Provider,
                { value: new CurrentCollection(collection) },
                formData && React.createElement(Preview, { formData: formData, show: true }),
              ),
            ),
          )
        : React.createElement(
            Flex,
            { style: { height: '80vh' }, justify: 'center', align: 'center', vertical: true },
            React.createElement(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE }),
          ),
    ),
  );
});
class DatasourceSelectorModel extends FlowModel {
  onInit(options) {
    super.onInit(options);
    this.context.defineMethod('t', (key, options) => {
      return this.context.i18n.t(key, {
        ...options,
        ns: namespace,
      });
    });
  }
  render() {
    return React.createElement(InnerDatasourceSelector, { ...this.props });
  }
}
DatasourceSelectorModel.registerFlow({
  key: 'resourceSettings',
  steps: {
    initResource: {
      handler: async (ctx) => {
        ctx.useResource('MultiRecordResource');
        const resource = ctx.resource;
        resource.setDataSourceKey(DEFAULT_DATA_SOURCE_KEY);
        resource.setResourceName('aiContextDatasources');
        resource.setRequestParameters({
          filter: {
            enabled: true,
          },
          sort: ['-createdAt'],
        });
        resource.setPageSize(10);
        await resource.refresh();
      },
    },
  },
});
export const DatasourceSelector = observer((props) => {
  const ctx = useFlowContext();
  const model = useMemo(() => {
    return ctx.engine.createModel({
      use: DatasourceSelectorModel,
      props,
    });
  }, [ctx, props]);
  return React.createElement(FlowModelRenderer, { model: model });
});
//# sourceMappingURL=DatasourceSelector.js.map
