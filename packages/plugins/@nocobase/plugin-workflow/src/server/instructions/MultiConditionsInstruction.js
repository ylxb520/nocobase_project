/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { evaluators } from '@nocobase/evaluators';
import { Instruction } from '.';
import { JOB_STATUS } from '../constants';
import { logicCalculate } from '../logicCalculate';
export class MultiConditionsInstruction extends Instruction {
    async run(node, prevJob, processor) {
        const { conditions = [], continueOnNoMatch = false } = (node.config || {});
        const meta = { conditions: [] };
        const job = processor.saveJob({
            status: JOB_STATUS.PENDING,
            result: null,
            meta,
            nodeId: node.id,
            nodeKey: node.key,
            upstreamId: prevJob?.id ?? null,
        });
        for (let cursor = 0; cursor < conditions.length; cursor++) {
            const branchIndex = cursor + 1;
            const condition = conditions[cursor];
            let conditionResult;
            try {
                conditionResult = this.evaluateCondition(condition, node, processor);
            }
            catch (error) {
                conditionResult = error instanceof Error ? error.message : String(error);
                processor.logger.error(`[multi-conditions] evaluate condition[${cursor}] error:`, { error });
            }
            finally {
                meta.conditions.push(conditionResult);
                job.set('result', conditionResult);
            }
            if (typeof conditionResult === 'string') {
                job.set('status', JOB_STATUS.ERROR);
                return job;
            }
            if (conditionResult === true) {
                const branchNode = this.getBranchNode(node, processor, branchIndex);
                job.set('status', JOB_STATUS.RESOLVED);
                if (branchNode) {
                    await processor.run(branchNode, job);
                    return;
                }
                return job;
            }
        }
        job.set('status', continueOnNoMatch ? JOB_STATUS.RESOLVED : JOB_STATUS.FAILED);
        const defaultBranch = this.getBranchNode(node, processor, 0);
        if (defaultBranch) {
            await processor.run(defaultBranch, job);
            return;
        }
        return job;
    }
    async resume(node, branchJob, processor) {
        const job = processor.findBranchParentJob(branchJob, node);
        if (!job) {
            throw new Error('Parent job not found');
        }
        const { continueOnNoMatch = false } = (node.config || {});
        const jobNode = processor.nodesMap.get(branchJob.nodeId);
        const branchStartNode = processor.findBranchStartNode(jobNode, node);
        const branchIndex = branchStartNode.branchIndex;
        if (branchJob.status === JOB_STATUS.RESOLVED) {
            if (branchIndex > 0) {
                job.set({
                    status: JOB_STATUS.RESOLVED,
                });
                return job;
            }
            job.set({ status: continueOnNoMatch ? JOB_STATUS.RESOLVED : JOB_STATUS.FAILED });
            return job;
        }
        return processor.exit(branchJob.status);
    }
    evaluateCondition(condition, node, processor) {
        const { engine = 'basic', calculation, expression } = condition ?? {};
        const evaluator = evaluators.get(engine);
        return evaluator
            ? evaluator(expression, processor.getScope(node.id))
            : logicCalculate(processor.getParsedValue(calculation, node.id));
    }
    getBranchNode(node, processor, branchIndex) {
        return processor.getBranches(node).find((item) => Number(item.branchIndex) === Number(branchIndex));
    }
}
export default MultiConditionsInstruction;
//# sourceMappingURL=MultiConditionsInstruction.js.map