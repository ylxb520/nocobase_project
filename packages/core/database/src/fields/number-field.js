/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DataTypes } from 'sequelize';
import { Field } from './field';
export class NumberField extends Field {}
export class IntegerField extends NumberField {
  get dataType() {
    return DataTypes.INTEGER;
  }
}
export class BigIntField extends NumberField {
  get dataType() {
    return DataTypes.BIGINT;
  }
}
export class FloatField extends NumberField {
  get dataType() {
    return DataTypes.FLOAT;
  }
}
export class DoubleField extends NumberField {
  get dataType() {
    return DataTypes.DOUBLE;
  }
}
export class RealField extends NumberField {
  get dataType() {
    return DataTypes.REAL;
  }
}
export class DecimalField extends NumberField {
  get dataType() {
    return DataTypes.DECIMAL(this.options.precision, this.options.scale);
  }
  static optionsFromRawType(rawType) {
    // infer precision and scale from rawType
    // eg: DECIMAL(10, 2)
    const matches = rawType.match(/DECIMAL\((\d+),\s*(\d+)\)/);
    if (matches) {
      return {
        precision: parseInt(matches[1]),
        scale: parseInt(matches[2]),
      };
    }
  }
}
//# sourceMappingURL=number-field.js.map
