/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import {
  createRecordMetaFactory,
  DndProvider,
  Droppable,
  FlowModelRenderer,
  DragHandler,
  AddSubModelButton,
  FlowSettingsButton,
  FlowModel,
} from '@nocobase/flow-engine';
import React from 'react';
import { css } from '@emotion/css';
import { SettingOutlined } from '@ant-design/icons';
import { FormComponent } from '@nocobase/client';
import { Space } from 'antd';
export class ListItemModel extends FlowModel {
  onInit(options) {
    super.onInit(options);
  }
  renderConfigureAction() {
    return React.createElement(
      AddSubModelButton,
      {
        key: 'table-row-actions-add',
        model: this,
        subModelBaseClass: this.context.getModelClassName('RecordActionGroupModel'),
        subModelKey: 'actions',
        afterSubModelInit: async (actionModel) => {
          actionModel.setStepParams('buttonSettings', 'general', { type: 'link', icon: null });
        },
      },
      React.createElement(
        FlowSettingsButton,
        { icon: React.createElement(SettingOutlined, null) },
        this.translate('Actions'),
      ),
    );
  }
  render() {
    const index = this.context.index;
    const record = this.context.record;
    const grid = this.subModels.grid.createFork({}, `grid-${index}`);
    grid.gridContainerRef = React.createRef();
    grid.context.defineProperty('fieldIndex', {
      get: () => index,
      cache: false,
    });
    grid.context.defineProperty('record', {
      get: () => record,
      cache: false,
    });
    grid.context.defineProperty('fieldKey', {
      get: () => index,
    });
    const { colon, labelAlign, labelWidth, labelWrap, layout } = this.props;
    const isConfigMode = !!this.context.flowSettingsEnabled;
    return React.createElement(
      'div',
      {
        key: this.context.index,
        style: { width: '100%' },
        className: css`
          .ant-form-item {
            margin-bottom: 5px;
          }
        `,
      },
      React.createElement(
        FormComponent,
        { model: this, layoutProps: { colon, labelAlign, labelWidth, labelWrap, layout } },
        React.createElement(FlowModelRenderer, { model: grid, showFlowSettings: false }),
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          DndProvider,
          null,
          React.createElement(
            'div',
            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement(
              Space,
              { wrap: true },
              this.mapSubModels('actions', (action, i) => {
                const fork = action.createFork({}, `${index}`);
                if (fork.hidden && !isConfigMode) {
                  return;
                }
                const recordMeta = createRecordMetaFactory(
                  () => fork.context.collection,
                  fork.context.t('Current record'),
                  (ctx) => {
                    const coll = ctx.collection;
                    const rec = ctx.record;
                    const name = coll?.name;
                    const dataSourceKey = coll?.dataSourceKey;
                    const filterByTk = coll?.getFilterByTK?.(rec);
                    if (!name || typeof filterByTk === 'undefined' || filterByTk === null) return undefined;
                    return { collection: name, dataSourceKey, filterByTk };
                  },
                );
                fork.context.defineProperty('record', {
                  get: () => this.context.record,
                  resolveOnServer: true,
                  meta: recordMeta,
                  cache: false,
                });
                return React.createElement(
                  Droppable,
                  { model: fork, key: fork.uid },
                  React.createElement(
                    'div',
                    {
                      className: css`
                        button {
                          padding: 5px;
                          padding-left: ${i === 0 ? '0px' : null};
                        }
                      `,
                    },
                    React.createElement(FlowModelRenderer, {
                      model: fork,
                      showFlowSettings: { showBackground: false, showBorder: false, toolbarPosition: 'above' },
                      extraToolbarItems: [
                        {
                          key: 'drag-handler',
                          component: DragHandler,
                          sort: 1,
                        },
                      ],
                    }),
                  ),
                );
              }),
              this.renderConfigureAction(),
            ),
          ),
        ),
      ),
    );
  }
}
ListItemModel.define({
  createModelOptions: {
    use: 'ListItemModel',
    subModels: {
      grid: {
        use: 'DetailsGridModel',
      },
    },
  },
  sort: 350,
});
//# sourceMappingURL=ListItemModel.js.map
