/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export interface UseDataSourceRefreshOptions {
  dataSourceName: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  showMessage?: boolean;
}
export declare const useDataSourceRefresh: (options: UseDataSourceRefreshOptions) => {
  onClick(): Promise<void>;
  readonly loading: any;
};
