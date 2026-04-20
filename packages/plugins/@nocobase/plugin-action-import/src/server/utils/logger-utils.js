/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class LoggerService {
  logger;
  constructor(options) {
    if (options?.logger) {
      this.logger = options.logger;
    }
  }
  async measureExecutedTime(handler, logMessage, logLevel = 'info') {
    if (!this.logger) {
      return await handler();
    }
    const startTime = process.hrtime();
    const result = await handler();
    const endTime = process.hrtime(startTime);
    const executionTimeMs = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
    const formattedMessage = logMessage.replace('{time}', executionTimeMs);
    if (logLevel === 'info') {
      this.logger?.info(formattedMessage);
    } else {
      this.logger?.debug(formattedMessage);
    }
    return result;
  }
}
//# sourceMappingURL=logger-utils.js.map
