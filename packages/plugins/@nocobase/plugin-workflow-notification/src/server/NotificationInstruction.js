/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import NotificationsServerPlugin from '@nocobase/plugin-notification-manager';
import { Instruction, JOB_STATUS } from '@nocobase/plugin-workflow';
export default class extends Instruction {
    async run(node, prevJob, processor) {
        const { ignoreFail, ...config } = node.config;
        const options = processor.getParsedValue(config, node.id);
        const scope = processor.getScope(node.id);
        const sendParams = {
            channelName: options.channelName,
            message: { ...options, content: config.content },
            triggerFrom: 'workflow',
            data: scope,
        };
        const notificationServer = this.workflow.pm.get(NotificationsServerPlugin);
        const { workflow } = processor.execution;
        const sync = this.workflow.isWorkflowSync(workflow);
        if (sync) {
            try {
                const result = await notificationServer.send(sendParams);
                if (result.status === 'success') {
                    return {
                        status: JOB_STATUS.RESOLVED,
                        result,
                    };
                }
                else {
                    return {
                        status: ignoreFail ? JOB_STATUS.RESOLVED : JOB_STATUS.FAILED,
                        result,
                    };
                }
            }
            catch (error) {
                return {
                    status: ignoreFail ? JOB_STATUS.RESOLVED : JOB_STATUS.ERROR,
                    result: error,
                };
            }
        }
        const { id } = processor.saveJob({
            status: JOB_STATUS.PENDING,
            nodeId: node.id,
            nodeKey: node.key,
            upstreamId: prevJob?.id ?? null,
        });
        await processor.exit();
        const jobDone = { status: JOB_STATUS.PENDING };
        try {
            processor.logger.info(`notification (#${node.id}) sent, waiting for response...`);
            const result = await notificationServer.send(sendParams);
            if (result.status === 'success') {
                processor.logger.info(`notification (#${node.id}) sent successfully.`);
                jobDone.status = JOB_STATUS.RESOLVED;
                jobDone.result = result;
            }
            else {
                processor.logger.info(`notification (#${node.id}) sent failed.`);
                jobDone.status = ignoreFail ? JOB_STATUS.RESOLVED : JOB_STATUS.FAILED;
                jobDone.result = result;
            }
        }
        catch (error) {
            processor.logger.warn(`notification (#${node.id}) sent failed: ${error.message}`);
            jobDone.status = ignoreFail ? JOB_STATUS.RESOLVED : JOB_STATUS.FAILED;
            jobDone.result = error;
        }
        finally {
            const job = await this.workflow.app.db.getRepository('jobs').findOne({
                filterByTk: id,
            });
            job.set(jobDone);
            processor.logger.debug(`notification (#${node.id}) sending ended, resume workflow...`);
            setImmediate(() => {
                this.workflow.resume(job);
            });
        }
    }
    async resume(node, job, processor) {
        return job;
    }
    async test(config) {
        const sendParams = {
            channelName: config.channelName,
            message: config,
            triggerFrom: 'workflow',
            data: {},
        };
        const notificationServer = this.workflow.pm.get(NotificationsServerPlugin);
        try {
            const result = await notificationServer.send(sendParams);
            if (result.status === 'success') {
                return {
                    status: JOB_STATUS.RESOLVED,
                    result,
                };
            }
            else {
                return {
                    status: JOB_STATUS.FAILED,
                    result,
                };
            }
        }
        catch (error) {
            return {
                status: JOB_STATUS.FAILED,
                result: error,
            };
        }
    }
}
//# sourceMappingURL=NotificationInstruction.js.map