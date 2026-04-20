/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import chalk from 'chalk';
import path from 'path';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { register } from 'esbuild-register/dist/node';
import { NODE_MODULES } from '../constant';
let previousColor = '';
function randomColor() {
  const colors = [
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'gray',
    'redBright',
    'greenBright',
    'yellowBright',
    'blueBright',
    'magentaBright',
    'cyanBright',
  ];
  let color = previousColor;
  while (color === previousColor) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    color = colors[randomIndex];
  }
  previousColor = color;
  return chalk[color];
}
export const getPkgLog = (pkgName) => {
  const pkgColor = randomColor();
  const pkgStr = chalk.bold(pkgColor(pkgName));
  const pkgLog = (msg, ...optionalParams) => console.log(`${pkgStr}: ${msg}`, ...optionalParams);
  return pkgLog;
};
export function toUnixPath(filepath) {
  return filepath.replace(/\\/g, '/');
}
export function getPackageJson(cwd) {
  return require(path.join(cwd, 'package.json'));
}
export function defineConfig(config) {
  return config;
}
export function getUserConfig(cwd) {
  const config = defineConfig({
    modifyTsupConfig: (config) => config,
    modifyViteConfig: (config) => config,
  });
  const buildConfigs = fg.sync(['build.config.js', 'build.config.ts'], { cwd });
  if (buildConfigs.length > 1) {
    throw new Error(`Multiple build configs found: ${buildConfigs.join(', ')}`);
  }
  if (buildConfigs.length === 1) {
    const { unregister } = register({});
    const userConfig = require(path.join(cwd, buildConfigs[0]));
    unregister();
    Object.assign(config, userConfig.default || userConfig);
  }
  return config;
}
const CACHE_DIR = path.join(NODE_MODULES, '.cache', 'nocobase');
export function writeToCache(key, data) {
  const cachePath = path.join(CACHE_DIR, `${key}.json`);
  fs.ensureDirSync(path.dirname(cachePath));
  fs.writeJsonSync(cachePath, data, { spaces: 2 });
}
export function readFromCache(key) {
  const cachePath = path.join(CACHE_DIR, `${key}.json`);
  if (fs.existsSync(cachePath)) {
    return fs.readJsonSync(cachePath);
  }
  return {};
}
export function getEnvDefine() {
  return {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.__TEST__': false,
    'process.env.__E2E__': process.env.__E2E__ ? true : false,
    'process.env.APP_ENV': process.env.APP_ENV,
  };
}
//# sourceMappingURL=utils.js.map
