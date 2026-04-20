/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Instruction, JOB_STATUS } from '@nocobase/plugin-workflow';
export const PARALLEL_MODE = {
    ALL: 'all',
    ANY: 'any',
    RACE: 'race',
    ALL_SETTLED: 'allSettled',
};
const Modes = {
    [PARALLEL_MODE.ALL]: {
        next(previous) {
            return previous.status >= JOB_STATUS.PENDING;
        },
        getStatus(result) {
            const failedStatus = result.find((status) => status != null && status < JOB_STATUS.PENDING);
            if (typeof failedStatus !== 'undefined') {
                return failedStatus;
            }
            if (result.every((status) => status != null && status === JOB_STATUS.RESOLVED)) {
                return JOB_STATUS.RESOLVED;
            }
            return JOB_STATUS.PENDING;
        },
    },
    [PARALLEL_MODE.ANY]: {
        next(previous) {
            return previous.status <= JOB_STATUS.PENDING;
        },
        getStatus(result) {
            if (result.some((status) => status != null && status === JOB_STATUS.RESOLVED)) {
                return JOB_STATUS.RESOLVED;
            }
            if (result.some((status) => (status != null ? status === JOB_STATUS.PENDING : true))) {
                return JOB_STATUS.PENDING;
            }
            return JOB_STATUS.FAILED;
        },
    },
    [PARALLEL_MODE.RACE]: {
        next(previous) {
            return previous.status === JOB_STATUS.PENDING;
        },
        getStatus(result) {
            if (result.some((status) => status != null && status === JOB_STATUS.RESOLVED)) {
                return JOB_STATUS.RESOLVED;
            }
            const failedStatus = result.find((status) => status != null && status < JOB_STATUS.PENDING);
            if (typeof failedStatus !== 'undefined') {
                return failedStatus;
            }
            return JOB_STATUS.PENDING;
        },
    },
    [PARALLEL_MODE.ALL_SETTLED]: {
        next() {
            return true;
        },
        getStatus(result) {
            if (result.some((status) => !status)) {
                return JOB_STATUS.PENDING;
            }
            return JOB_STATUS.RESOLVED;
        },
    },
};
export default class extends Instruction {
    async run(node, prevJob, processor) {
        const branches = processor.getBranches(node);
        const job = processor.saveJob({
            status: JOB_STATUS.PENDING,
            result: Array(branches.length).fill(null),
            nodeId: node.id,
            nodeKey: node.key,
            upstreamId: prevJob?.id ?? null,
        });
        // NOTE:
        // use `reduce` but not `Promise.all` here to avoid racing manupulating db.
        // for users, this is almost equivalent to `Promise.all`,
        // because of the delay is not significant sensible.
        // another benifit of this is, it could handle sequenced branches in future.
        const { mode = PARALLEL_MODE.ALL } = node.config;
        await branches.reduce((promise, branch, i) => promise.then(async (previous) => {
            if (i && !Modes[mode].next(previous)) {
                return previous;
            }
            await processor.run(branch, job);
            // find last job of the branch
            return processor.findBranchLastJob(branch, job);
        }), Promise.resolve());
    }
    async resume(node, branchJob, processor) {
        const job = processor.findBranchParentJob(branchJob, node);
        const { result, status } = job;
        // if parallel has been done (resolved / rejected), do not care newly executed branch jobs.
        if (status !== JOB_STATUS.PENDING) {
            processor.logger.warn(`parallel (${job.nodeId}) has been done, ignore newly resumed event`);
            return null;
        }
        // find the index of the node which start the branch
        const jobNode = processor.nodesMap.get(branchJob.nodeId);
        const branchStartNode = processor.findBranchStartNode(jobNode, node);
        const branches = processor.getBranches(node);
        const branchIndex = branches.indexOf(branchStartNode);
        const { mode = PARALLEL_MODE.ALL } = node.config || {};
        const newResult = [...result.slice(0, branchIndex), branchJob.status, ...result.slice(branchIndex + 1)];
        job.set({
            result: newResult,
            status: Modes[mode].getStatus(newResult),
        });
        if (job.status === JOB_STATUS.PENDING) {
            processor.saveJob(job);
            return null;
        }
        return job;
    }
}
//# sourceMappingURL=ParallelInstruction.js.map