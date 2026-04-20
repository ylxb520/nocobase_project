/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Toposort } from '@nocobase/utils';
export class UserDataResource {
    name;
    accepts;
    db;
    logger;
    constructor(db, logger) {
        this.db = db;
        this.logger = logger;
    }
    get syncRecordRepo() {
        return this.db.getRepository('userDataSyncRecords');
    }
    get syncRecordResourceRepo() {
        return this.db.getRepository('userDataSyncRecordsResources');
    }
}
export class UserDataResourceManager {
    resources = new Toposort();
    syncRecordRepo;
    syncRecordResourceRepo;
    logger;
    registerResource(resource, options) {
        if (!resource.name) {
            throw new Error('"name" for user data synchronize resource is required');
        }
        if (!resource.accepts) {
            throw new Error('"accepts" for user data synchronize resource is required');
        }
        this.resources.add(resource, { tag: resource.name, ...options });
    }
    set db(value) {
        this.syncRecordRepo = value.getRepository('userDataSyncRecords');
        this.syncRecordResourceRepo = value.getRepository('userDataSyncRecordsResources');
    }
    async saveOriginRecords(data) {
        for (const record of data.records) {
            if (record.uid === undefined) {
                throw new Error(`record must has uid, error record: ${JSON.stringify(record)}`);
            }
            const syncRecord = await this.syncRecordRepo.findOne({
                where: {
                    sourceName: data.sourceName,
                    sourceUk: record.uid,
                    dataType: data.dataType,
                },
            });
            if (syncRecord) {
                syncRecord.lastMetaData = syncRecord.metaData;
                syncRecord.metaData = record;
                await syncRecord.save();
            }
            else {
                await this.syncRecordRepo.create({
                    values: {
                        sourceName: data.sourceName,
                        sourceUk: record.uid,
                        dataType: data.dataType,
                        metaData: record,
                    },
                });
            }
        }
    }
    async findOriginRecords({ sourceName, dataType, sourceUks }) {
        return await this.syncRecordRepo.find({
            appends: ['resources'],
            filter: { sourceName, dataType, sourceUk: { $in: sourceUks } },
        });
    }
    async addResourceToOriginRecord({ recordId, resource, resourcePk }) {
        const syncRecord = await this.syncRecordRepo.findOne({
            filter: {
                id: recordId,
            },
        });
        if (syncRecord) {
            await syncRecord.createResource({
                resource,
                resourcePk,
            });
        }
    }
    async removeResourceFromOriginRecord({ recordId, resource, resourcePk }) {
        const recordResource = await this.syncRecordResourceRepo.findOne({
            where: {
                recordId,
                resource,
                resourcePk,
            },
        });
        if (recordResource) {
            await recordResource.destroy();
        }
    }
    async updateOrCreate(data) {
        await this.saveOriginRecords(data);
        const { dataType, sourceName, records, matchKey } = data;
        const sourceUks = records.map((record) => record.uid);
        const syncResults = [];
        for (const resource of this.resources.nodes) {
            if (!resource.accepts.includes(dataType)) {
                continue;
            }
            const associateResource = resource.name;
            const originRecords = await this.findOriginRecords({ sourceName, sourceUks, dataType });
            if (!(originRecords && originRecords.length)) {
                continue;
            }
            const successRecords = [];
            const failedRecords = [];
            for (const originRecord of originRecords) {
                const resourceRecords = originRecord.resources?.filter((r) => r.resource === associateResource);
                let recordResourceChangeds;
                if (resourceRecords && resourceRecords.length > 0) {
                    const resourcePks = resourceRecords.map((r) => r.resourcePk);
                    try {
                        recordResourceChangeds = await resource.update(originRecord, resourcePks, matchKey);
                        this.logger?.debug(`update record success. Data changed: ${JSON.stringify(recordResourceChangeds)}`);
                        successRecords.push(originRecord.metaData);
                    }
                    catch (error) {
                        this.logger?.warn(`update record error: ${error.message}`, { originRecord });
                        failedRecords.push({ record: originRecord.metaData, message: error.message });
                        continue;
                    }
                }
                else {
                    try {
                        recordResourceChangeds = await resource.create(originRecord, matchKey);
                        this.logger?.debug(`create record success. Data changed: ${JSON.stringify(recordResourceChangeds)}`);
                        successRecords.push(originRecord.metaData);
                    }
                    catch (error) {
                        this.logger?.warn(`create record error: ${error.message}`, { originRecord });
                        failedRecords.push({ record: originRecord.metaData, message: error.message });
                        continue;
                    }
                }
                if (!recordResourceChangeds || recordResourceChangeds.length === 0) {
                    continue;
                }
                for (const { resourcesPk, isDeleted } of recordResourceChangeds) {
                    if (isDeleted) {
                        await this.removeResourceFromOriginRecord({
                            recordId: originRecord.id,
                            resource: associateResource,
                            resourcePk: resourcesPk,
                        });
                    }
                    else {
                        await this.addResourceToOriginRecord({
                            recordId: originRecord.id,
                            resource: associateResource,
                            resourcePk: resourcesPk,
                        });
                    }
                }
            }
            syncResults.push({
                resource: associateResource,
                detail: {
                    count: {
                        all: originRecords.length,
                        success: successRecords.length,
                        failed: failedRecords.length,
                    },
                    failedRecords,
                },
            });
        }
        return syncResults;
    }
}
//# sourceMappingURL=user-data-resource-manager.js.map