/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Formatter } from './formatter';
export class SQLiteFormatter extends Formatter {
  convertFormat(format) {
    return format
      .replace(/YYYY/g, '%Y')
      .replace(/MM/g, '%m')
      .replace(/DD/g, '%d')
      .replace(/hh/g, '%H')
      .replace(/mm/g, '%M')
      .replace(/ss/g, '%S');
  }
  getOffsetMinutesFromTimezone(timezone) {
    const sign = timezone.charAt(0);
    timezone = timezone.slice(1);
    const [hours, minutes] = timezone.split(':');
    const hoursNum = Number(hours);
    const minutesNum = Number(minutes);
    const offset = hoursNum * 60 + minutesNum;
    return `${sign}${offset} minutes`;
  }
  formatDate(field, format, timezone) {
    format = this.convertFormat(format);
    if (timezone) {
      return this.sequelize.fn('strftime', format, field, this.getOffsetMinutesFromTimezone(timezone));
    }
    return this.sequelize.fn('strftime', format, field);
  }
  formatUnixTimeStamp(field, format, accuracy = 'second', timezone) {
    format = this.convertFormat(format);
    const col = this.sequelize.getQueryInterface().quoteIdentifiers(field);
    if (accuracy === 'millisecond') {
      return this.sequelize.fn(
        'strftime',
        format,
        this.sequelize.fn(
          'DATETIME',
          this.sequelize.literal(`ROUND(${col} / 1000)`),
          'unixepoch',
          this.getOffsetMinutesFromTimezone(timezone),
        ),
      );
    }
    return this.sequelize.fn(
      'strftime',
      format,
      this.sequelize.fn(
        'DATETIME',
        this.sequelize.col(field),
        'unixepoch',
        this.getOffsetMinutesFromTimezone(timezone),
      ),
    );
  }
}
//# sourceMappingURL=sqlite-formatter.js.map
