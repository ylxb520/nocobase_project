/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export const SCHEDULE_MODE = {
    STATIC: 0,
    DATE_FIELD: 1,
};
export function parseDateWithoutMs(date) {
    return Math.floor(Date.parse(date) / 1000) * 1000;
}
//# sourceMappingURL=utils.js.map