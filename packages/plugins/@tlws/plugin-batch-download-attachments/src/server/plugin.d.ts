/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Plugin, Application } from '@nocobase/server';
export declare class BatchDownloadAttachmentsServer extends Plugin<Application> {
    afterAdd(): Promise<void>;
    beforeLoad(): Promise<void>;
    load(): Promise<void>;
    private addFileToArchive;
    install(): Promise<void>;
    afterEnable(): Promise<void>;
    afterDisable(): Promise<void>;
    remove(): Promise<void>;
}
export default BatchDownloadAttachmentsServer;
