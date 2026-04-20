/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import Instruction from '.';
import { JOB_STATUS } from '../constants';
export default class extends Instruction {
    async run(node, prevJob, processor) {
        const { endStatus = JOB_STATUS.RESOLVED } = node.config;
        processor.saveJob({
            status: endStatus,
            nodeId: node.id,
            nodeKey: node.key,
            upstreamId: prevJob?.id ?? null,
        });
        return processor.exit(endStatus);
    }
}
//# sourceMappingURL=EndInstruction.js.map