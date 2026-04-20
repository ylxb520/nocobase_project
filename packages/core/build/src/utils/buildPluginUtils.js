/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import fs from 'fs';
import chalk from 'chalk';
import { builtinModules } from 'module';
import path from 'path';
const requireRegex = /require\s*\(['"`](.*?)['"`]\)/g;
const importRegex = /^import(?:['"\s]*([\w*${}\s,]+)from\s*)?['"\s]['"\s](.*[@\w_-]+)['"\s].*/gm;
export function isNotBuiltinModule(packageName) {
  return !builtinModules.includes(packageName);
}
export const isValidPackageName = (str) => {
  const pattern = /^(?:@[a-zA-Z0-9_-]+\/)?[a-zA-Z0-9_-]+$/;
  return pattern.test(str);
};
/**
 * get package name from string
 * @example
 * getPackageNameFromString('lodash') => lodash
 * getPackageNameFromString('lodash/xx') => lodash
 * getPackageNameFromString('@aa/bb') => @aa/bb
 * getPackageNameFromString('aa/${lang}') => aa
 *
 * getPackageNameFromString('./xx') => null
 * getPackageNameFromString('../xx') => null
 * getPackageNameFromString($file) => null
 * getPackageNameFromString(`${file}`) => null
 * getPackageNameFromString($file + './xx') => null
 */
export function getPackageNameFromString(str) {
  // ./xx or ../xx
  if (str.startsWith('.')) return null;
  const arr = str.split('/');
  let packageName;
  if (arr[0].startsWith('@')) {
    // @aa/bb/ccFile => @aa/bb
    packageName = arr.slice(0, 2).join('/');
  } else {
    // aa/bbFile => aa
    packageName = arr[0];
  }
  packageName = packageName.trim();
  return isValidPackageName(packageName) ? packageName : null;
}
export function getPackagesFromFiles(files) {
  const packageNames = files
    .map((item) => [
      ...[...item.matchAll(importRegex)].map((item) => item[2]),
      ...[...item.matchAll(requireRegex)].map((item) => item[1]),
    ])
    .flat()
    .map(getPackageNameFromString)
    .filter(Boolean)
    .filter(isNotBuiltinModule);
  return [...new Set(packageNames)];
}
export function getSourcePackages(fileSources) {
  return getPackagesFromFiles(fileSources);
}
export function getIncludePackages(sourcePackages, external, pluginPrefix) {
  return sourcePackages
    .filter((packageName) => !external.includes(packageName)) // exclude external
    .filter((packageName) => !pluginPrefix.some((prefix) => packageName.startsWith(prefix))); // exclude other plugin
}
export function getExcludePackages(sourcePackages, external, pluginPrefix) {
  const includePackages = getIncludePackages(sourcePackages, external, pluginPrefix);
  return sourcePackages.filter((packageName) => !includePackages.includes(packageName));
}
export function getPackageJsonPackages(packageJson) {
  return [
    ...new Set([...Object.keys(packageJson.devDependencies || {}), ...Object.keys(packageJson.dependencies || {})]),
  ];
}
export function checkEntryExists(cwd, entry, log) {
  const srcDir = path.join(cwd, 'src', entry);
  if (!fs.existsSync(srcDir)) {
    log('Missing %s. Please create it.', chalk.red(`src/${entry}`));
    process.exit(-1);
  }
  return srcDir;
}
export function checkDependencies(packageJson, log) {
  const packages = Object.keys(packageJson.dependencies || {});
  if (!packages.length) return;
  log(
    "The build tool will package all dependencies into the dist directory, so you don't need to put them in %s. Instead, they should be placed in %s. For more information, please refer to: %s.",
    chalk.yellow(packages.join(', ')),
    chalk.yellow('dependencies'),
    chalk.yellow('devDependencies'),
    chalk.blue(chalk.blue('https://docs.nocobase.com/development/others/deps')),
  );
}
export function getFileSize(filePath) {
  const stat = fs.statSync(filePath);
  return stat.size;
}
export function formatFileSize(fileSize) {
  const kb = fileSize / 1024;
  return kb.toFixed(2) + ' KB';
}
export function buildCheck(options) {
  const { cwd, log, entry, files, packageJson } = options;
  checkEntryExists(cwd, entry, log);
  // checkRequirePackageJson(files, log);
  checkDependencies(packageJson, log);
}
export function checkRequire(sourceFiles, log) {
  const requireArr = sourceFiles
    .map((filePath) => {
      const code = fs.readFileSync(filePath, 'utf-8');
      return [...code.matchAll(requireRegex)].map((item) => ({
        filePath: filePath,
        code: item[0],
      }));
    })
    .flat();
  if (requireArr.length) {
    log('%s not allowed. Please use %s instead.', chalk.red('require()'), chalk.red('import'));
    requireArr.forEach((item, index) => {
      console.log('%s. %s in %s;', index + 1, chalk.red(item.code), chalk.red(item.filePath));
    });
    console.log('\n');
    process.exit(-1);
  }
}
export function checkFileSize(outDir, log) {
  const files = fs.readdirSync(outDir);
  files.forEach((file) => {
    const fileSize = getFileSize(path.join(outDir, file));
    if (fileSize > 1024 * 1024) {
      log(
        `The %s size %s exceeds 1MB. You can use dynamic import \`import()\` for lazy loading content.`,
        chalk.red(file),
        chalk.red(formatFileSize(fileSize)),
      );
    }
  });
}
//# sourceMappingURL=buildPluginUtils.js.map
