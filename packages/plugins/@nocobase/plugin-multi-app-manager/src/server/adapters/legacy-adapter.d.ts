/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Mutex } from 'async-mutex';
import Application, { AppSupervisor } from '@nocobase/server';
import type { AppDiscoveryAdapter, AppProcessAdapter, AppStatus, GetAppOptions } from '@nocobase/server';
export declare class LegacyAdapter implements AppDiscoveryAdapter, AppProcessAdapter {
    private readonly supervisor;
    readonly name = "legacy";
    apps: Record<string, Application>;
    lastSeenAt: Map<string, number>;
    appErrors: Record<string, Error>;
    appStatus: Record<string, AppStatus>;
    lastMaintainingMessage: Record<string, string>;
    statusBeforeCommanding: Record<string, AppStatus>;
    private appMutexes;
    private bootstrapQueue;
    constructor(supervisor: AppSupervisor);
    removeAllApps(): Promise<void>;
    setAppError(appName: string, error: Error): void;
    hasAppError(appName: string): boolean;
    clearAppError(appName: string): void;
    setAppStatus(appName: string, status: AppStatus, options?: {}): Promise<void>;
    getMutexOfApp(appName: string): Mutex;
    private _bootStrapApp;
    bootstrapApp(appName: string, options?: {}): Promise<void>;
    getApp(appName: string, options?: GetAppOptions): Promise<Application<import("@nocobase/server").DefaultState, import("@nocobase/server").DefaultContext>>;
    hasApp(appName: string): boolean;
    setAppLastSeenAt(appName: string): void;
    getAppLastSeenAt(appName: string): number | null;
    addApp(app: Application): Application<import("@nocobase/server").DefaultState, import("@nocobase/server").DefaultContext>;
    getApps(): Application<import("@nocobase/server").DefaultState, import("@nocobase/server").DefaultContext>[];
    startApp(appName: string): Promise<void>;
    stopApp(appName: string): Promise<void>;
    removeApp(appName: string): Promise<void>;
    getAppStatus(appName: string, defaultStatus?: AppStatus): Promise<AppStatus>;
    getAppModel(appName: string): Promise<any>;
}
