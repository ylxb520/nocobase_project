/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BaseInterface } from '@nocobase/database';
export class PointInterface extends BaseInterface {
    async toValue(str, ctx) {
        if (!str)
            return null;
        return str.split(',').map((v) => parseFloat(v));
    }
    toString(value, ctx) {
        if (!value)
            return null;
        return value.join(',');
    }
}
export class PolygonInterface extends BaseInterface {
    async toValue(str, ctx) {
        if (!str)
            return null;
        return str
            .substring(1, str.length - 1)
            .split('),(')
            .map((v) => v.split(',').map((v) => parseFloat(v)));
    }
    toString(value, ctx) {
        if (!value)
            return null;
        return `(${value.map((v) => v.join(',')).join('),(')})`;
    }
}
export class LineStringInterface extends PolygonInterface {
}
export class CircleInterface extends BaseInterface {
    async toValue(str, ctx) {
        if (!str)
            return null;
        return str.split(',').map((v) => parseFloat(v));
    }
    toString(value, ctx) {
        if (!value)
            return null;
        return value.join(',');
    }
}
//# sourceMappingURL=index.js.map