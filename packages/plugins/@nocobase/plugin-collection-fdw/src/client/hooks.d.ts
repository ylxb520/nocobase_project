/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
export declare const useCreateDatabaseServer: (handleDataServerChange: any) => {
    run(): Promise<void>;
};
export declare const useTestConnectionAction: () => {
    run(): Promise<void>;
};
export declare const useCancelAction: () => {
    run(): Promise<void>;
};
export declare const useEditDatabaseServer: () => {
    run(): Promise<void>;
};
