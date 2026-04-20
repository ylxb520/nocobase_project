/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { S3Client } from '@aws-sdk/client-s3';
import { AttachmentModel, StorageModel, StorageType } from '.';
export default class extends StorageType {
    static defaults(): {
        title: string;
        name: string;
        type: string;
        baseUrl: string;
        options: {
            region: string;
            accessKeyId: string;
            secretAccessKey: string;
            bucket: string;
        };
    };
    static filenameKey: string;
    client: S3Client;
    constructor(storage: StorageModel);
    make(): {
        s3: S3Client;
        _handleFile(req: any, file: any, cb: any): Promise<void>;
        _removeFile(req: any, file: any, cb: any): void;
    };
    deleteS3Objects(bucketName: string, objects: string[]): Promise<{
        Deleted: any[];
    }>;
    delete(records: AttachmentModel[]): Promise<[number, AttachmentModel[]]>;
}
