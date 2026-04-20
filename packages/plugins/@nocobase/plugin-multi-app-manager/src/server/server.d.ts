/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { IDatabaseOptions, Transactionable } from '@nocobase/database';
import Application, { Plugin } from '@nocobase/server';
import { ApplicationModel } from '../server';
import { Meter } from '@nocobase/telemetry';
export type AppDbCreator = (app: Application, options?: Transactionable & {
    context?: any;
    applicationModel?: ApplicationModel;
}) => Promise<void>;
export type AppOptionsFactory = (appName: string, mainApp: Application) => any;
export type SubAppUpgradeHandler = (mainApp: Application) => Promise<void>;
export declare class PluginMultiAppManagerServer extends Plugin {
    subAppUpgradeHandler: SubAppUpgradeHandler;
    meter: Meter;
    setSubAppUpgradeHandler(handler: SubAppUpgradeHandler): void;
    protected static registerLegacyAdapter(): void;
    static getDatabaseConfig(app: Application): IDatabaseOptions;
    setAppOptionsFactory(appOptionsFactory: AppOptionsFactory): void;
    static staticImport(): void;
    beforeLoad(): void;
    beforeEnable(): Promise<void>;
    setMetrics(): void;
    load(): Promise<void>;
}
