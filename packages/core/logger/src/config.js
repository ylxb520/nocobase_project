/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import path from 'path';
export const getLoggerLevel = () =>
  process.env.LOGGER_LEVEL || (process.env.APP_ENV === 'development' ? 'debug' : 'info');
export const getLoggerFilePath = (...paths) => {
  return path.resolve(process.env.LOGGER_BASE_PATH || path.resolve(process.cwd(), 'storage', 'logs'), ...paths);
};
export const getLoggerTransport = () => (process.env.LOGGER_TRANSPORT || 'console,dailyRotateFile').split(',');
export const getLoggerFormat = () =>
  process.env.LOGGER_FORMAT || (process.env.APP_ENV === 'development' ? 'console' : 'json');
//# sourceMappingURL=config.js.map
