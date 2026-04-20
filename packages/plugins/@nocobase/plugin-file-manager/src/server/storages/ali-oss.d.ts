/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AttachmentModel, StorageType } from '.';
declare function getRandomFilename(req: any, file: any, cb: any): void;
declare class AliYunOssStorage {
    client: any;
    getDestination: Function;
    getFilename: Function;
    constructor({ config, destination, filename }: {
        config: any;
        destination?: string;
        filename?: typeof getRandomFilename;
    });
    _handleFile(req: any, file: any, cb: any): any;
    _removeFile(req: any, file: any, cb: any): any;
}
export default class extends StorageType {
    static defaults(): {
        title: string;
        type: string;
        name: string;
        baseUrl: string;
        options: {
            region: string;
            accessKeyId: string;
            accessKeySecret: string;
            bucket: string;
        };
    };
    make(): AliYunOssStorage;
    delete(records: AttachmentModel[]): Promise<[number, AttachmentModel[]]>;
}
export {};
