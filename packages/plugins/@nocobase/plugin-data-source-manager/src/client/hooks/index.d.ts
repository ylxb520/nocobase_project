/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export * from './useDataSourceRefresh';
export * from './useResourceData';
export * from './useDataSourceActions';
export declare const useCreateDatabaseServer: (handleDataServerChange: any) => {
  run(): Promise<void>;
};
export declare const useTestConnectionAction: () => {
  run(): Promise<void>;
};
export declare const useLoadCollections: () => (key: any) => Promise<any>;
