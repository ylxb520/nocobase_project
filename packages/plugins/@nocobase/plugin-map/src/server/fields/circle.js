/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DataTypes, Field } from '@nocobase/database';
import { isPg, toValue } from '../helpers';
class Circle extends DataTypes.ABSTRACT {
    key = 'Circle';
}
export class CircleField extends Field {
    constructor(options, context) {
        const { name } = options;
        super({
            get() {
                const value = this.getDataValue(name);
                if (isPg(context)) {
                    if (typeof value === 'string') {
                        return toValue(`(${value})`);
                    }
                    return value ? [value.x, value.y, value.radius] : null;
                }
                else {
                    return value;
                }
            },
            set(value) {
                if (!value?.length)
                    value = null;
                else if (isPg(context)) {
                    value = value.join(',');
                }
                this.setDataValue(name, value);
            },
            ...options,
        }, context);
    }
    get dataType() {
        if (isPg(this.context)) {
            return Circle;
        }
        else {
            return DataTypes.JSON;
        }
    }
}
//# sourceMappingURL=circle.js.map