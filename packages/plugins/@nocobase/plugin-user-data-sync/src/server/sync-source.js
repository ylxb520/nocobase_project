/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import dayjs from 'dayjs';
export class SyncSource {
    instance;
    options;
    ctx;
    constructor(config) {
        const { options, ctx, sourceInstance } = config;
        this.instance = sourceInstance;
        this.options = options;
        this.ctx = ctx;
    }
    async newTask() {
        const batch = generateUniqueNumber();
        return await this.instance.createTask({ batch, status: 'init' });
    }
    async beginTask(taskId) {
        const tasks = await this.instance.getTasks({ where: { id: taskId } });
        if (!tasks && !tasks.length) {
            throw new Error(`Task [${taskId}] is not found.`);
        }
        const task = tasks[0];
        if (task.status !== 'init') {
            throw new Error(`Task [${taskId}] is not init.`);
        }
        task.status = 'processing';
        await task.save();
    }
    async endTask(params) {
        const { taskId, success, cost, message } = params;
        const tasks = await this.instance.getTasks({ where: { id: taskId } });
        if (!tasks && !tasks.length) {
            throw new Error(`Task [${taskId}] is not found.`);
        }
        const task = tasks[0];
        if (task.status !== 'processing') {
            throw new Error(`Task [${taskId}] is not processing.`);
        }
        task.status = success ? 'success' : 'failed';
        task.cost = cost;
        task.message = message;
        await task.save();
    }
    async retryTask(taskId) {
        const tasks = await this.instance.getTasks({ where: { id: taskId } });
        if (!tasks && !tasks.length) {
            throw new Error(`Task [${taskId}] is not found.`);
        }
        const task = tasks[0];
        if (task.status !== 'failed') {
            throw new Error(`Task [${taskId}] is not failed.`);
        }
        task.status = 'processing';
        task.message = '';
        await task.save();
        return task;
    }
}
function generateUniqueNumber() {
    const formattedDate = dayjs().format('YYYYMMDDHHmmss');
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return formattedDate + randomDigits;
}
//# sourceMappingURL=sync-source.js.map