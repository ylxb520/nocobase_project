/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import winston from 'winston';
import 'winston-daily-rotate-file';
import { getLoggerLevel } from './config';
import { consoleFormat } from './format';
import { getTransports } from './transports';
export const levels = {
  trace: 4,
  debug: 3,
  info: 2,
  warn: 1,
  error: 0,
};
export const createLogger = (options) => {
  if (process.env.GITHUB_ACTIONS) {
    return createConsoleLogger();
  }
  const { format, ...rest } = options;
  const winstonOptions = {
    levels,
    level: getLoggerLevel(),
    ...rest,
    transports: getTransports(options),
  };
  return winston.createLogger(winstonOptions);
};
/**
 * @internal
 */
export const createConsoleLogger = (options) => {
  const { format, ...rest } = options || {};
  return winston.createLogger({
    levels,
    level: getLoggerLevel(),
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format || consoleFormat,
    ),
    ...(rest || {}),
    transports: [new winston.transports.Console()],
  });
};
//# sourceMappingURL=logger.js.map
