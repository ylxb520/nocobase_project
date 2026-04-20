/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
const getJsBridge = () => window.JsBridge;
export const invoke = (params, cb) => {
    return getJsBridge().invoke(params, cb);
};
export const isJSBridge = () => !!getJsBridge();
//# sourceMappingURL=injects.js.map