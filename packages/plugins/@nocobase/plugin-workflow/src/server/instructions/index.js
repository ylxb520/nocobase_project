/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
// what should a instruction do?
// - base on input and context, do any calculations or system call (io), and produce a result or pending.
export class Instruction {
    workflow;
    constructor(workflow) {
        this.workflow = workflow;
    }
}
export default Instruction;
//# sourceMappingURL=index.js.map