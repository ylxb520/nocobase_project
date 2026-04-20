/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export default {
    syncTrigger: class {
        workflow;
        constructor(workflow) {
            this.workflow = workflow;
        }
        on() { }
        off() { }
        sync = true;
        validateEvent() {
            return true;
        }
        execute(workflow, values, options) {
            return this.workflow.trigger(workflow, values, options);
        }
    },
    asyncTrigger: class {
        workflow;
        constructor(workflow) {
            this.workflow = workflow;
        }
        on() { }
        off() { }
        validateEvent() {
            return true;
        }
        execute(workflow, values, options) {
            return this.workflow.trigger(workflow, values, options);
        }
    },
};
//# sourceMappingURL=triggers.js.map