/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useAPIClient } from '@nocobase/client';
import { useEffect, useState } from 'react';
export const useResourceData = (options) => {
  const { resourceName, resourceParams, getParams = {}, deps = [], enabled = true, onSuccess, onError } = options;
  const api = useAPIClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resource = resourceParams ? api.resource(resourceName, resourceParams) : api.resource(resourceName);
  const fetchData = async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const response = await resource.get(getParams);
      const responseData = response?.data;
      setData(responseData);
      onSuccess?.(responseData);
    } catch (err) {
      setError(err);
      onError?.(err);
      console.error(`Failed to fetch ${resourceName} data:`, err);
    } finally {
      setLoading(false);
    }
  };
  const refresh = () => {
    fetchData();
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceName, enabled, ...deps]);
  return {
    data,
    loading,
    error,
    refresh,
  };
};
export const useDataSourceData = (dataSourceName, options = {}) => {
  const { getParams = {}, ...restOptions } = options;
  return useResourceData({
    resourceName: 'dataSources',
    resourceParams: dataSourceName,
    getParams: {
      filterByTk: dataSourceName,
      ...getParams,
    },
    deps: [dataSourceName],
    ...restOptions,
  });
};
//# sourceMappingURL=useResourceData.js.map
