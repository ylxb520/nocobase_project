/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
// @ts-ignore
import pkg from '../../package.json';
import { useTranslation } from 'react-i18next';
export function useT() {
    const { t } = useTranslation([pkg.name, 'client']);
    return (str, options = {}) => t(str, options);
}
export function tStr(key) {
    return `{{t(${JSON.stringify(key)}, { ns: ['${pkg.name}', 'client'], nsMode: 'fallback' })}}`;
}
//# sourceMappingURL=locale.js.map