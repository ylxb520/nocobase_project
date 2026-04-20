/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/* istanbul ignore next -- @preserve */
import { importModule, isURL, requireResolve } from '@nocobase/utils';
import { createStoragePluginSymLink } from '@nocobase/utils/plugin-symlink';
import axios from 'axios';
import decompress from 'decompress';
import fg from 'fast-glob';
import fs from 'fs-extra';
import ini from 'ini';
import { builtinModules } from 'module';
import os from 'os';
import path from 'path';
import semver from 'semver';
import { getDepPkgPath, getPackageDir, getPackageFilePathWithExistCheck } from './clientStaticUtils';
import {
  APP_NAME,
  DEFAULT_PLUGIN_PATH,
  DEFAULT_PLUGIN_STORAGE_PATH,
  EXTERNAL,
  importRegex,
  pluginPrefix,
  requireRegex,
} from './constants';
import deps from './deps';
/**
 * get temp dir
 *
 * @example
 * getTempDir() => '/tmp/nocobase'
 */
export async function getTempDir() {
  const temporaryDirectory = await fs.realpath(os.tmpdir());
  return path.join(temporaryDirectory, APP_NAME);
}
export function getPluginStoragePath() {
  const pluginStoragePath = process.env.PLUGIN_STORAGE_PATH || DEFAULT_PLUGIN_STORAGE_PATH;
  return path.isAbsolute(pluginStoragePath) ? pluginStoragePath : path.join(process.cwd(), pluginStoragePath);
}
export function getLocalPluginPackagesPathArr() {
  const pluginPackagesPathArr = process.env.PLUGIN_PATH || DEFAULT_PLUGIN_PATH;
  return pluginPackagesPathArr.split(',').map((pluginPackagesPath) => {
    pluginPackagesPath = pluginPackagesPath.trim();
    return path.isAbsolute(pluginPackagesPath) ? pluginPackagesPath : path.join(process.cwd(), pluginPackagesPath);
  });
}
export function getStoragePluginDir(packageName) {
  const pluginStoragePath = getPluginStoragePath();
  return path.join(pluginStoragePath, packageName);
}
export function getLocalPluginDir(packageDirBasename) {
  const localPluginDir = getLocalPluginPackagesPathArr()
    .map((pluginPackagesPath) => path.join(pluginPackagesPath, packageDirBasename))
    .find((pluginDir) => fs.existsSync(pluginDir));
  if (!localPluginDir) {
    throw new Error(`local plugin "${packageDirBasename}" not found`);
  }
  return localPluginDir;
}
export function getNodeModulesPluginDir(packageName) {
  return path.join(process.env.NODE_MODULES_PATH, packageName);
}
export function getAuthorizationHeaders(registry, authToken) {
  const headers = {};
  if (registry && !authToken) {
    const npmrcPath = path.join(os.homedir(), '.npmrc');
    const url = new URL(registry);
    let envConfig = process.env;
    if (fs.existsSync(npmrcPath)) {
      const content = fs.readFileSync(npmrcPath, 'utf-8');
      envConfig = {
        ...envConfig,
        ...ini.parse(content),
      };
    }
    const key = Object.keys(envConfig).find((key) => key.includes(url.host) && key.includes('_authToken'));
    if (key) {
      authToken = envConfig[key];
    }
  }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}
/**
 * get latest version from npm
 *
 * @example
 * getLatestVersion('dayjs', 'https://registry.npmjs.org') => '1.10.6'
 */
export async function getLatestVersion(packageName, registry, token) {
  const npmInfo = await getNpmInfo(packageName, registry, token);
  const latestVersion = npmInfo['dist-tags'].latest;
  return latestVersion;
}
export async function getNpmInfo(packageName, registry, token) {
  registry.endsWith('/') && (registry = registry.slice(0, -1));
  const response = await axios.get(`${registry}/${packageName}`, {
    headers: getAuthorizationHeaders(registry, token),
  });
  try {
    const data = response.data;
    return data;
  } catch (e) {
    console.error(e);
    throw new Error(`${registry} is not a valid registry, '${registry}/${packageName}' response is not a valid json.`);
  }
}
export async function download(url, destination, options = {}) {
  const response = await axios.get(url, {
    ...options,
    responseType: 'stream',
  });
  fs.mkdirpSync(path.dirname(destination));
  const writer = fs.createWriteStream(destination);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
export async function removeTmpDir(tempFile, tempPackageContentDir) {
  await fs.remove(tempFile);
  await fs.remove(tempPackageContentDir);
}
/**
 * download and unzip to node_modules
 */
export async function downloadAndUnzipToTempDir(fileUrl, authToken) {
  const fileName = path.basename(fileUrl);
  const tempDir = await getTempDir();
  const tempFile = path.join(tempDir, fileName);
  const tempPackageDir = tempFile.replace(path.extname(fileName), '');
  // download and unzip to temp dir
  await fs.remove(tempPackageDir);
  await fs.remove(tempFile);
  if (isURL(fileUrl)) {
    await download(fileUrl, tempFile, {
      headers: getAuthorizationHeaders(fileUrl, authToken),
    });
  } else if (await fs.exists(fileUrl)) {
    await fs.copy(fileUrl, tempFile);
  } else {
    throw new Error(`${fileUrl} does not exist`);
  }
  if (!fs.existsSync(tempFile)) {
    throw new Error(`download ${fileUrl} failed`);
  }
  await decompress(tempFile, tempPackageDir);
  if (!fs.existsSync(tempPackageDir)) {
    await fs.remove(tempFile);
    throw new Error(`File is not a valid compressed file. Maybe the file need authorization.`);
  }
  let tempPackageContentDir = tempPackageDir;
  const files = fs
    .readdirSync(tempPackageDir, { recursive: false, withFileTypes: true })
    .filter((item) => item.name !== '__MACOSX');
  if (
    files.length === 1 &&
    files[0].isDirectory() &&
    fs.existsSync(path.join(tempPackageDir, files[0]['name'], 'package.json'))
  ) {
    tempPackageContentDir = path.join(tempPackageDir, files[0]['name']);
  }
  const packageJsonPath = path.join(tempPackageContentDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    await removeTmpDir(tempFile, tempPackageContentDir);
    throw new Error(`decompress ${fileUrl} failed`);
  }
  const packageJson = await readJSONFileContent(packageJsonPath);
  const mainFile = path.join(tempPackageContentDir, packageJson.main);
  if (!fs.existsSync(mainFile)) {
    await removeTmpDir(tempFile, tempPackageContentDir);
    throw new Error(`main file ${packageJson.main} not found, Please check if the plugin has been built.`);
  }
  return {
    packageName: packageJson.name,
    version: packageJson.version,
    tempPackageContentDir,
    tempFile,
  };
}
export async function copyTempPackageToStorageAndLinkToNodeModules(tempFile, tempPackageContentDir, packageName) {
  const packageDir = getStoragePluginDir(packageName);
  // move to plugin storage dir
  await fs.remove(packageDir);
  await fs.move(tempPackageContentDir, packageDir, { overwrite: true });
  // symlink to node_modules
  await createStoragePluginSymLink(packageName);
  // remove temp dir
  await removeTmpDir(tempFile, tempPackageContentDir);
  return {
    packageDir,
  };
}
export async function getPluginInfoByNpm(options) {
  let { registry, version } = options;
  const { packageName, authToken } = options;
  if (registry.endsWith('/')) {
    registry = registry.slice(0, -1);
  }
  if (!version) {
    version = await getLatestVersion(packageName, registry, authToken);
  }
  const compressedFileUrl = `${registry}/${packageName}/-/${packageName.split('/').pop()}-${version}.tgz`;
  return { compressedFileUrl, version };
}
/**
 * scan `src/server` directory to get server packages
 *
 * @example
 * getServerPackages('src/server') => ['dayjs', '@nocobase/plugin-bbb']
 */
export function getServerPackages(packageDir) {
  function isBuiltinModule(packageName) {
    return builtinModules.includes(packageName);
  }
  function getSrcPlugins(sourceDir) {
    const importedPlugins = new Set();
    const exts = ['.js', '.ts', '.jsx', '.tsx'];
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"\s.].+?)['"];?/g;
    const requireRegex = /require\s*\(\s*[`'"]([^`'"\s.].+?)[`'"]\s*\)/g;
    function setPluginsFromContent(reg, content) {
      let match;
      while ((match = reg.exec(content))) {
        let importedPlugin = match[1];
        if (importedPlugin.startsWith('@')) {
          // @aa/bb/ccFile => @aa/bb
          importedPlugin = importedPlugin.split('/').slice(0, 2).join('/');
        } else {
          // aa/bbFile => aa
          importedPlugin = importedPlugin.split('/')[0];
        }
        if (!isBuiltinModule(importedPlugin)) {
          importedPlugins.add(importedPlugin);
        }
      }
    }
    function traverseDirectory(directory) {
      const files = fs.readdirSync(directory);
      for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          // recursive
          traverseDirectory(filePath);
        } else if (stat.isFile() && !filePath.includes('__tests__')) {
          if (exts.includes(path.extname(filePath).toLowerCase())) {
            const content = fs.readFileSync(filePath, 'utf-8');
            setPluginsFromContent(importRegex, content);
            setPluginsFromContent(requireRegex, content);
          }
        }
      }
    }
    traverseDirectory(sourceDir);
    return [...importedPlugins];
  }
  const srcServerPlugins = getSrcPlugins(path.join(packageDir, 'src/server'));
  return srcServerPlugins;
}
export function removePluginPackage(packageName) {
  const packageDir = getStoragePluginDir(packageName);
  const nodeModulesPluginDir = getNodeModulesPluginDir(packageName);
  return Promise.all([fs.remove(packageDir), fs.remove(nodeModulesPluginDir)]);
}
/**
 * get package.json
 *
 * @example
 * getPackageJson('dayjs') => { name: 'dayjs', version: '1.0.0', ... }
 */
export async function getPackageJson(pluginName) {
  const packageDir = getStoragePluginDir(pluginName);
  return await getPackageJsonByLocalPath(packageDir);
}
export async function getPackageJsonByLocalPath(localPath) {
  if (!fs.existsSync(localPath)) {
    return null;
  } else {
    const fullPath = path.join(localPath, 'package.json');
    const data = await fs.promises.readFile(fullPath, { encoding: 'utf-8' });
    return JSON.parse(data);
  }
}
export async function updatePluginByCompressedFileUrl(options) {
  const { packageName, version, tempFile, tempPackageContentDir } = await downloadAndUnzipToTempDir(
    options.compressedFileUrl,
    options.authToken,
  );
  const instance = await options.repository.findOne({
    filter: { packageName },
  });
  if (!instance) {
    await removeTmpDir(tempFile, tempPackageContentDir);
    throw new Error(`plugin ${packageName} does not exist`);
  }
  const { packageDir } = await copyTempPackageToStorageAndLinkToNodeModules(
    tempFile,
    tempPackageContentDir,
    packageName,
  );
  return {
    packageName,
    packageDir,
    version,
  };
}
export async function getNewVersion(plugin) {
  if (!(plugin.packageName && plugin.registry)) return false;
  // 1. Check plugin version by npm registry
  const { version } = await getPluginInfoByNpm({
    packageName: plugin.packageName,
    registry: plugin.registry,
    authToken: plugin.authToken,
  });
  // 2. has new version, return true
  return version !== plugin.version ? version : false;
}
export function removeRequireCache(fileOrPackageName) {
  delete require.cache[require.resolve(fileOrPackageName)];
  delete require.cache[fileOrPackageName];
}
export async function requireNoCache(fileOrPackageName) {
  return await importModule(fileOrPackageName);
}
export async function readJSONFileContent(filePath) {
  const data = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
  return JSON.parse(data);
}
export function requireModule(m) {
  if (typeof m === 'string') {
    m = require(m);
  }
  if (typeof m !== 'object') {
    return m;
  }
  return m.__esModule ? m.default : m;
}
async function getExternalVersionFromDistFile(packageName) {
  const { exists, filePath } = getPackageFilePathWithExistCheck(packageName, 'dist/externalVersion.js');
  if (!exists) {
    return false;
  }
  try {
    return await requireNoCache(filePath);
  } catch (e) {
    console.error(e);
    return false;
  }
}
export function isNotBuiltinModule(packageName) {
  return !builtinModules.includes(packageName);
}
export const isValidPackageName = (str) => {
  const pattern = /^(?:@[a-zA-Z0-9_-]+\/)?[a-zA-Z0-9_-]+$/;
  return pattern.test(str);
};
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
export function getIncludePackages(sourcePackages, external, pluginPrefix) {
  return sourcePackages
    .filter((packageName) => !external.includes(packageName)) // exclude external
    .filter((packageName) => !pluginPrefix.some((prefix) => packageName.startsWith(prefix))); // exclude other plugin
}
export function getExcludePackages(sourcePackages, external, pluginPrefix) {
  const includePackages = getIncludePackages(sourcePackages, external, pluginPrefix);
  return sourcePackages.filter((packageName) => !includePackages.includes(packageName));
}
export async function getExternalVersionFromSource(packageName) {
  const packageDir = getPackageDir(packageName);
  const sourceGlobalFiles = ['src/**/*.{ts,js,tsx,jsx}', '!src/**/__tests__'];
  const sourceFilePaths = await fg.glob(sourceGlobalFiles, { cwd: packageDir, absolute: true });
  const sourceFiles = await Promise.all(sourceFilePaths.map((item) => fs.readFile(item, 'utf-8')));
  const sourcePackages = getPackagesFromFiles(sourceFiles);
  const excludePackages = getExcludePackages(sourcePackages, EXTERNAL, pluginPrefix);
  const data = excludePackages.reduce((prev, packageName) => {
    const depPkgPath = getDepPkgPath(packageName, packageDir);
    const depPkg = require(depPkgPath);
    prev[packageName] = depPkg.version;
    return prev;
  }, {});
  return data;
}
export async function getCompatible(packageName) {
  let externalVersion;
  const hasSrc = fs.existsSync(path.join(getPackageDir(packageName), 'src'));
  let hasError = false;
  if (hasSrc) {
    try {
      externalVersion = await getExternalVersionFromSource(packageName);
    } catch {
      hasError = true;
    }
  }
  if (hasError || !hasSrc) {
    const res = await getExternalVersionFromDistFile(packageName);
    if (!res) {
      return false;
    } else {
      externalVersion = res;
    }
  }
  return Object.keys(externalVersion).reduce((result, packageName) => {
    const packageVersion = externalVersion[packageName];
    const globalPackageName = deps[packageName]
      ? packageName
      : deps[packageName.split('/')[0]] // @nocobase and @formily
      ? packageName.split('/')[0]
      : undefined;
    if (globalPackageName) {
      const versionRange = deps[globalPackageName];
      result.push({
        name: packageName,
        result: semver.satisfies(packageVersion, versionRange, { includePrerelease: true }),
        versionRange,
        packageVersion,
      });
    }
    return result;
  }, []);
}
export async function checkCompatible(packageName) {
  const compatible = await getCompatible(packageName);
  if (!compatible) return false;
  return compatible.every((item) => item.result);
}
export async function checkAndGetCompatible(packageName) {
  const compatible = await getCompatible(packageName);
  if (!compatible) {
    return {
      isCompatible: false,
      depsCompatible: [],
    };
  }
  return {
    isCompatible: compatible.every((item) => item.result),
    depsCompatible: compatible,
  };
}
export async function getPluginBasePath(packageName) {
  if (!packageName) {
    return;
  }
  const file = await fs.realpath(await requireResolve(packageName));
  try {
    const basePath = await fs.realpath(path.resolve(process.env.NODE_MODULES_PATH, packageName, 'src'));
    if (file.startsWith(basePath)) {
      return basePath;
    }
  } catch (error) {
    // skip
  }
  return path.dirname(path.dirname(file));
}
//# sourceMappingURL=utils.js.map
