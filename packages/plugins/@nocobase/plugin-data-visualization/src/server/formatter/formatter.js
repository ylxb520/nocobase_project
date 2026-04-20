/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import moment from 'moment-timezone';
export class Formatter {
  sequelize;
  constructor(sequelize) {
    this.sequelize = sequelize;
  }
  getTimezoneByOffset(offset) {
    if (!/^[+-]\d{1,2}:\d{2}$/.test(offset)) {
      return offset;
    }
    const offsetMinutes = moment.duration(offset).asMinutes();
    return moment.tz.names().find((timezone) => {
      return moment.tz(timezone).utcOffset() === offsetMinutes;
    });
  }
  convertFormat(format) {
    return format;
  }
  format(options) {
    const { type, field, format, timezone, options: fieldOptions } = options;
    const col = this.sequelize.col(field);
    switch (type) {
      case 'date':
      case 'datetime':
      case 'datetimeTz':
        return this.formatDate(col, format, timezone);
      case 'datetimeNoTz':
      case 'dateOnly':
      case 'time':
        return this.formatDate(col, format);
      case 'unixTimestamp': {
        const accuracy = fieldOptions?.uiSchema?.['x-component-props']?.accuracy || fieldOptions?.accuracy || 'second';
        return this.formatUnixTimeStamp(field, format, accuracy, timezone);
      }
      default:
        return this.sequelize.col(field);
    }
  }
}
//# sourceMappingURL=formatter.js.map
