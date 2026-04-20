/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import {
  DndProvider,
  MultiRecordResource,
  FlowModelRenderer,
  Droppable,
  DragHandler,
  AddSubModelButton,
  FlowSettingsButton,
  observer,
} from '@nocobase/flow-engine';
import { SettingOutlined } from '@ant-design/icons';
import {
  CollectionBlockModel,
  BlockSceneEnum,
  getUnknownCountPaginationTotal,
  getSimpleModePaginationClassName,
  createCompactSimpleItemRender,
  applyMobilePaginationProps,
  mergePaginationClassName,
} from '@nocobase/client';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { List, Space, Slider, Grid, InputNumber, Col } from 'antd';
import { css } from '@emotion/css';
import { screenSizeTitleMaps, gridSizes, columnCountMarks, screenSizeMaps } from './utils';
import { tExpr } from '../locale';
export class GridCardBlockModel extends CollectionBlockModel {
  static scene = BlockSceneEnum.many;
  _screens;
  _defaultCustomModelClasses = {
    CollectionActionGroupModel: 'CollectionActionGroupModel',
    RecordActionGroupModel: 'RecordActionGroupModel',
    TableColumnModel: 'TableColumnModel',
    TableAssociationFieldGroupModel: 'TableAssociationFieldGroupModel',
    TableCustomColumnModel: 'TableCustomColumnModel',
  };
  get resource() {
    return super.resource;
  }
  useHooksBeforeRender() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const screens = Grid.useBreakpoint();
    const order = ['xxl', 'lg', 'md', 'xs'];
    this._screens = order.find((bp) => screens[bp]) || 'lg';
  }
  createResource(ctx, params) {
    return this.context.createResource(MultiRecordResource);
  }
  renderConfiguireActions() {
    return React.createElement(
      AddSubModelButton,
      {
        key: 'table-column-add-actions',
        model: this,
        subModelBaseClass: this.getModelClassName('CollectionActionGroupModel'),
        subModelKey: 'actions',
      },
      React.createElement(
        FlowSettingsButton,
        { icon: React.createElement(SettingOutlined, null) },
        this.translate('Actions'),
      ),
    );
  }
  pagination() {
    const totalCount = this.resource.getMeta('count');
    const pageSize = this.resource.getPageSize();
    const hasNext = this.resource.getMeta('hasNext');
    const current = this.resource.getPage();
    const data = this.resource.getData();
    const columns = this.props.columnCount?.[this._screens] || 1;
    const rowCount = this.props.rowCount || 1;
    const isMobileLayout = !!this.context.isMobileLayout;
    const multiples = [1, 2, 3, 5, 10];
    const pageSizeOptions = multiples.map((m) => columns * rowCount * m);
    if (totalCount) {
      const result = {
        current,
        pageSize,
        total: totalCount,
        pageSizeOptions: pageSizeOptions,
        showTotal: (total) => {
          return this.translate('Total {{count}} items', { count: total });
        },
        showSizeChanger: true,
        onChange: (page, pageSize) => {
          this.resource.loading = true;
          this.resource.setPage(page);
          this.resource.setPageSize(pageSize);
          this.resource.refresh();
        },
      };
      return applyMobilePaginationProps(result, isMobileLayout);
    } else {
      const nextPageSize = pageSize || 10;
      const nextCurrent = current || 1;
      const result = {
        // showTotal: false,
        simple: true,
        showTitle: false,
        showSizeChanger: true,
        hideOnSinglePage: false,
        pageSize: nextPageSize,
        total: getUnknownCountPaginationTotal({
          dataLength: data?.length,
          pageSize: nextPageSize,
          current: nextCurrent,
          hasNext,
        }),
        className: mergePaginationClassName(getSimpleModePaginationClassName(true), undefined),
        itemRender: createCompactSimpleItemRender({
          current: nextCurrent,
          controlHeight: this.context.themeToken.controlHeight,
        }),
      };
      return applyMobilePaginationProps(result, isMobileLayout);
    }
  }
  renderComponent() {
    const { heightMode, height } = this.decoratorProps;
    return React.createElement(GridCardBlockContent, { model: this, heightMode: heightMode, height: height });
  }
}
const getOuterHeight = (element) => {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const marginTop = parseFloat(style.marginTop) || 0;
  const marginBottom = parseFloat(style.marginBottom) || 0;
  return rect.height + marginTop + marginBottom;
};
const useGridCardHeight = ({ heightMode, containerRef, actionsRef, listRef, deps = [] }) => {
  const [listHeight, setListHeight] = useState();
  const calcListHeight = useCallback(() => {
    if (heightMode !== 'specifyValue' && heightMode !== 'fullHeight') {
      setListHeight((prev) => (prev === undefined ? prev : undefined));
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    const containerHeight = container.getBoundingClientRect().height;
    if (!containerHeight) return;
    const actionsHeight = getOuterHeight(actionsRef.current);
    const paginationEl = listRef.current?.querySelector('.ant-list-pagination');
    const paginationHeight = getOuterHeight(paginationEl);
    const nextHeight = Math.max(0, Math.floor(containerHeight - actionsHeight - paginationHeight));
    setListHeight((prev) => (prev === nextHeight ? prev : nextHeight));
  }, [heightMode, containerRef, actionsRef, listRef]);
  useLayoutEffect(() => {
    calcListHeight();
  }, [calcListHeight, ...deps]);
  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === 'undefined') return;
    const container = containerRef.current;
    const actions = actionsRef.current;
    const paginationEl = listRef.current?.querySelector('.ant-list-pagination');
    const observer = new ResizeObserver(() => calcListHeight());
    observer.observe(container);
    if (actions) observer.observe(actions);
    if (paginationEl) observer.observe(paginationEl);
    return () => observer.disconnect();
  }, [calcListHeight, containerRef, actionsRef, listRef, ...deps]);
  return listHeight;
};
const GridCardBlockContent = observer(({ model, heightMode, height }) => {
  const containerRef = useRef(null);
  const actionsRef = useRef(null);
  const listRef = useRef(null);
  const isFixedHeight = heightMode === 'specifyValue' || heightMode === 'fullHeight';
  const ctx = model.context;
  const token = ctx.themeToken;
  const listHeight = useGridCardHeight({
    heightMode,
    containerRef,
    actionsRef,
    listRef,
    deps: [height],
  });
  const listClassName = useMemo(
    () => css`
      .ant-spin-nested-loading {
        height: var(--nb-grid-card-height);
        overflow: auto;
        margin-left: -${token.marginLG}px;
        margin-right: -${token.marginLG}px;
        padding-left: ${token.marginLG}px;
        padding-right: ${token.marginLG}px;
      }
      .ant-spin-nested-loading > .ant-spin-container {
        min-height: 100%;
      }
    `,
    [],
  );
  const listStyle = useMemo(() => {
    if (listHeight == null) return model.props?.style;
    return {
      ...(model.props?.style || {}),
      ['--nb-grid-card-height']: `${listHeight}px`,
    };
  }, [listHeight, model.props?.style]);
  const isConfigMode = !!model.context.flowSettingsEnabled;
  const columnCount = model.props.columnCount;
  const containerStyle = isFixedHeight
    ? {
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        height: '100%',
      }
    : undefined;
  return React.createElement(
    'div',
    { ref: containerRef, style: containerStyle },
    React.createElement(
      'div',
      { ref: actionsRef },
      React.createElement(
        DndProvider,
        null,
        React.createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 } },
          React.createElement(
            Space,
            { wrap: true },
            model.mapSubModels('actions', (action) => {
              // @ts-ignore
              if (action.props.position === 'left') {
                return React.createElement(FlowModelRenderer, {
                  key: action.uid,
                  model: action,
                  showFlowSettings: { showBackground: false, showBorder: false, toolbarPosition: 'above' },
                });
              }
              return null;
            }),
            React.createElement('span', null),
          ),
          React.createElement(
            Space,
            { wrap: true },
            model.mapSubModels('actions', (action) => {
              if (action.hidden && !isConfigMode) {
                return;
              }
              // @ts-ignore
              if (action.props.position !== 'left') {
                return React.createElement(
                  Droppable,
                  { model: action, key: action.uid },
                  React.createElement(FlowModelRenderer, {
                    model: action,
                    showFlowSettings: { showBackground: false, showBorder: false, toolbarPosition: 'above' },
                    extraToolbarItems: [
                      {
                        key: 'drag-handler',
                        component: DragHandler,
                        sort: 1,
                      },
                    ],
                  }),
                );
              }
              return null;
            }),
            model.renderConfiguireActions(),
          ),
        ),
      ),
    ),
    React.createElement(
      'div',
      { ref: listRef, style: { flex: 1, minHeight: 0 } },
      React.createElement(List, {
        ...model.props,
        className: model.props?.className ? `${model.props.className} ${listClassName}` : listClassName,
        style: listStyle,
        pagination: model.pagination(),
        loading: model.resource?.loading,
        dataSource: model.resource.getData(),
        grid: {
          ...columnCount,
          sm: columnCount.xs,
          xl: columnCount.lg,
          gutter: [token.marginBlock / 2, token.marginBlock / 2],
        },
        renderItem: (item, index) => {
          const itemModel = model.subModels.item.createFork({}, `${index}`);
          itemModel.context.defineProperty('record', {
            get: () => item,
            cache: false,
            resolveOnServer: true,
          });
          itemModel.context.defineProperty('index', {
            get: () => index,
            cache: false,
            resolveOnServer: true,
          });
          return React.createElement(
            Col,
            {
              className: css`
                height: 100%;
                > div {
                  height: 100%;
                }
              `,
            },
            React.createElement(FlowModelRenderer, { model: itemModel }),
          );
        },
      }),
    ),
  );
});
GridCardBlockModel.registerFlow({
  key: 'resourceSettings2',
  steps: {},
});
GridCardBlockModel.registerFlow({
  key: 'GridCardSettings',
  sort: 500,
  title: tExpr('Grid card block settings'),
  steps: {
    columnCount: {
      title: tExpr('Set the count of columns displayed in a row'),
      uiSchema(ctx) {
        const t = ctx.t;
        const columnCountSchema = {
          'x-component': Slider,
          'x-decorator': 'FormItem',
          'x-component-props': {
            min: 1,
            max: 24,
            marks: columnCountMarks,
            tooltip: {
              formatter: (value) => `${value}${t('Column')}`,
            },
            step: null,
          },
        };
        const columnCountProperties = gridSizes.reduce((o, k) => {
          o[k] = {
            ...columnCountSchema,
            title: t(screenSizeTitleMaps[k]),
            description: `${t('Screen size')} ${screenSizeMaps[k]} ${t('pixels')}`,
          };
          return o;
        }, {});
        return {
          columnCount: {
            type: 'object',
            properties: columnCountProperties,
          },
        };
      },
      defaultParams: {
        columnCount: {
          xs: 1,
          md: 2,
          lg: 3,
          xxl: 4,
        },
      },
      handler(ctx, params) {
        ctx.model.setProps({
          columnCount: params.columnCount,
        });
      },
    },
    rowCount: {
      title: tExpr('Number of Rows'),
      uiSchema: {
        rowCount: {
          'x-component': InputNumber,
          'x-decorator': 'FormItem',
        },
      },
      defaultParams: {
        rowCount: 3,
      },
      handler(ctx, params) {
        ctx.model.resource.loading = true;
        ctx.model.resource.setPage(1);
        const pageSize = params.rowCount * ctx.model.props.columnCount[ctx.model._screens];
        const currentPageSize = ctx.model.resource.getPageSize();
        if (currentPageSize !== pageSize) {
          ctx.model.resource.setPageSize(pageSize);
        }
      },
    },
    dataScope: {
      use: 'dataScope',
      title: tExpr('Data scope'),
    },
    defaultSorting: {
      use: 'sortingRule',
      title: tExpr('Default sorting'),
    },
    layout: {
      use: 'layout',
      title: tExpr('Layout'),
      handler(ctx, params) {
        ctx.model.setProps({ ...params, labelWidth: params.layout === 'vertical' ? null : params.labelWidth });
        const item = ctx.model.subModels.item;
        item.setProps({
          ...params,
          labelWidth: params.layout === 'vertical' ? '100%' : params.labelWidth,
          labelWrap: params.layout === 'vertical' ? true : params.labelWrap,
        });
      },
    },
  },
});
GridCardBlockModel.define({
  label: tExpr('Grid card'),
  searchable: true,
  searchPlaceholder: tExpr('Search'),
  createModelOptions: {
    use: 'GridCardBlockModel',
    subModels: {
      item: {
        use: 'GridCardItemModel',
      },
    },
  },
  sort: 500,
});
//# sourceMappingURL=GridCardBlockModel.js.map
