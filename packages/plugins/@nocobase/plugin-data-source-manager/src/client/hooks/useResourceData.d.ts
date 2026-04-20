/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export interface UseResourceDataOptions {
  resourceName: string;
  resourceParams?: string | string[];
  getParams?: Record<string, any>;
  deps?: any[];
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}
export declare const useResourceData: (options: UseResourceDataOptions) => {
  data: any;
  loading: boolean;
  error: any;
  refresh: () => void;
};
export declare const useDataSourceData: (
  dataSourceName: string,
  options?: Omit<UseResourceDataOptions, 'resourceName' | 'resourceParams' | 'getParams'> & {
    getParams?: Record<string, any>;
  },
) => {
  data: any;
  loading: boolean;
  error: any;
  refresh: () => void;
};
