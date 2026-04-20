/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useFieldSchema } from '@formily/react';
import {
  CollectionManagerProvider,
  DEFAULT_DATA_SOURCE_KEY,
  MaybeCollectionProvider,
  useAPIClient,
  useRequest,
} from '@nocobase/client';
import React, { createContext, useContext, useEffect } from 'react';
import { parseField, removeUnparsableFilter } from '../utils';
import { ChartDataContext } from '../block/ChartDataProvider';
import { useChartFilter } from '../hooks';
import { ChartFilterContext } from '../filter/FilterProvider';
import { GlobalAutoRefreshContext } from '../block/GlobalAutoRefreshProvider';
export const ChartRendererContext = createContext({});
ChartRendererContext.displayName = 'ChartRendererContext';
export const ChartRendererProvider = (props) => {
  const { query, config, collection, transform, dataSource = DEFAULT_DATA_SOURCE_KEY, disableAutoRefresh } = props;
  const { addChart } = useContext(ChartDataContext);
  const { addChart: addGlobalAutoRefreshChart, removeChart: removeGlobalAutoRefreshChart } = useContext(
    GlobalAutoRefreshContext,
  );
  const { ready, form, enabled } = useContext(ChartFilterContext);
  const { getFilter, hasFilter, appendFilter, parseFilter } = useChartFilter();
  const schema = useFieldSchema();
  const api = useAPIClient();
  const [autoRefresh, setAutoRefresh] = React.useState(false);
  const [showActionBar, setShowActionBar] = React.useState(false);
  const service = useRequest(
    async (dataSource, collection, query, manual) => {
      if (!(collection && query?.measures?.length)) return;
      // Check if the chart is configured
      // If the filter block is enabled, the filter form is required to be rendered
      if (enabled && !form) return;
      const filterValues = getFilter();
      const parsedFilter = await parseFilter(query.filter);
      const parsedQuery = { ...query, filter: parsedFilter };
      const config = { dataSource, collection, query: parsedQuery };
      const queryWithFilter =
        !manual && hasFilter(config, filterValues) ? appendFilter(config, filterValues) : parsedQuery;
      try {
        const res = await api.request({
          url: 'charts:query',
          method: 'POST',
          data: {
            uid: schema?.['x-uid'],
            dataSource,
            collection,
            ...queryWithFilter,
            filter: removeUnparsableFilter(queryWithFilter.filter),
            dimensions: (query?.dimensions || []).map((item) => {
              const dimension = { ...item };
              if (item.format && !item.alias) {
                const { alias } = parseField(item.field);
                dimension.alias = alias;
              }
              return dimension;
            }),
            measures: (query?.measures || []).map((item) => {
              const measure = { ...item };
              if (item.aggregation && !item.alias) {
                const { alias } = parseField(item.field);
                measure.alias = alias;
              }
              return measure;
            }),
          },
        });
        return res?.data?.data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        if (!manual && schema?.['x-uid']) {
          addChart(schema?.['x-uid'], { dataSource, collection, service, query });
          if (!autoRefresh) {
            addGlobalAutoRefreshChart?.(schema?.['x-uid'], { service });
          }
        }
      }
    },
    {
      defaultParams: [dataSource, collection, query],
      // Wait until ChartFilterProvider is rendered and check the status of the filter form
      // since the filter parameters should be applied if the filter block is enabled
      ready: ready && (!enabled || !!form),
    },
  );
  useEffect(() => {
    if (disableAutoRefresh) {
      return;
    }
    if (!autoRefresh) {
      addGlobalAutoRefreshChart?.(schema?.['x-uid'], { service });
      return;
    }
    removeGlobalAutoRefreshChart?.(schema?.['x-uid']);
    const refresh = autoRefresh;
    const timer = setInterval(service.refresh, refresh * 1000);
    return () => {
      clearInterval(timer);
    };
  }, [autoRefresh, disableAutoRefresh]);
  return React.createElement(
    CollectionManagerProvider,
    { dataSource: dataSource },
    React.createElement(
      MaybeCollectionProvider,
      { collection: collection },
      React.createElement(
        ChartRendererContext.Provider,
        {
          value: {
            dataSource,
            collection,
            config,
            transform,
            service,
            query,
            autoRefresh,
            setAutoRefresh,
            showActionBar,
          },
        },
        React.createElement(
          'div',
          { onMouseOver: () => setShowActionBar(true), onMouseOut: () => setShowActionBar(false) },
          props.children,
        ),
      ),
    ),
  );
};
//# sourceMappingURL=ChartRendererProvider.js.map
