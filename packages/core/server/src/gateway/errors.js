/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AppSupervisor } from '../app-supervisor';
import lodash from 'lodash';
function getMaintaining(app) {
  return app?.getMaintaining?.();
}
function getAppName(app) {
  return app?.name || 'unknown';
}
export const errors = {
  APP_NOT_FOUND: {
    status: 404,
    message: ({ appName }) => `application ${appName} not found`,
    maintaining: true,
  },
  APP_ERROR: {
    status: 503,
    message: ({ app }) => {
      if (!app?.name) {
        return '';
      }
      const error = AppSupervisor.getInstance().appErrors[app.name];
      if (!error) {
        return '';
      }
      let message = error.message;
      if (error.cause) {
        message = `${message}: ${error.cause.message}`;
      }
      return message;
    },
    code: ({ app }) => {
      if (!app?.name) {
        return 'APP_ERROR';
      }
      const error = AppSupervisor.getInstance().appErrors[app.name];
      return error?.['code'] || 'APP_ERROR';
    },
    command: ({ app }) => getMaintaining(app)?.command,
    maintaining: true,
  },
  APP_PREPARING: {
    status: 503,
    message: ({ appName }) => `application ${appName} is preparing, please wait patiently`,
    maintaining: true,
  },
  APP_STARTING: {
    status: 503,
    message: ({ app }) => app?.maintainingMessage || '',
    maintaining: true,
  },
  APP_STOPPED: {
    status: 503,
    message: ({ app, appName }) => `application ${appName || getAppName(app)} is stopped`,
    maintaining: true,
  },
  APP_INITIALIZED: {
    status: 503,
    message: ({ app }) => `application ${getAppName(app)} is initialized, waiting for command`,
    maintaining: true,
  },
  APP_INITIALIZING: {
    status: 503,
    message: ({ appName }) => `application ${appName} is initializing`,
    maintaining: true,
  },
  COMMAND_ERROR: {
    status: 503,
    maintaining: true,
    message: ({ app }) => getMaintaining(app)?.error?.message || '',
    command: ({ app }) => getMaintaining(app)?.command,
  },
  COMMAND_END: {
    status: 503,
    maintaining: true,
    message: ({ app }) => `${getMaintaining(app)?.command?.name || 'command'} running end`,
    command: ({ app }) => getMaintaining(app)?.command,
  },
  APP_COMMANDING: {
    status: 503,
    maintaining: true,
    message: ({ app, message }) => message || app?.maintainingMessage || '',
    command: ({ app, command }) => command || getMaintaining(app)?.command,
  },
  APP_RUNNING: {
    status: 200,
    maintaining: false,
    message: ({ message, app }) => message || `application ${getAppName(app)} is running`,
  },
  UNKNOWN_ERROR: {
    status: 500,
    message: 'unknown error',
    maintaining: true,
  },
};
export function getErrorWithCode(errorCode) {
  const rawCode = errorCode;
  errorCode = lodash.snakeCase(errorCode).toUpperCase();
  if (!errors[errorCode] && errors[`APP_${errorCode}`]) {
    errorCode = `APP_${errorCode}`;
  }
  if (!errors[errorCode]) {
    errorCode = 'UNKNOWN_ERROR';
  }
  const error = lodash.cloneDeep(errors[errorCode]);
  if (!error.code) {
    error['code'] = errorCode == 'UNKNOWN_ERROR' ? rawCode : errorCode;
  }
  return error;
}
export function applyErrorWithArgs(error, options) {
  const functionKeys = Object.keys(error).filter((key) => typeof error[key] === 'function');
  const functionResults = functionKeys.map((key) => {
    return error[key](options);
  });
  return {
    ...error,
    ...lodash.zipObject(functionKeys, functionResults),
  };
}
//# sourceMappingURL=errors.js.map
