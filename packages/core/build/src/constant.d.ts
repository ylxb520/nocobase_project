/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Package } from '@lerna/package';
export declare const globExcludeFiles: string[];
export declare const EsbuildSupportExts: string[];
export declare const ROOT_PATH: string;
export declare const NODE_MODULES: string;
export declare const PACKAGES_PATH: string;
export declare const PLUGINS_DIR: string[];
export declare const PRESETS_DIR: string;
export declare const PLUGIN_COMMERCIAL = "@nocobase/plugin-commercial";
export declare const PLUGIN_LICENSE = "@nocobase/plugin-license";
export declare const getPluginPackages: (packages: Package[]) => Package[];
export declare const getPresetsPackages: (packages: Package[]) => Package[];
export declare const CORE_APP: string;
export declare const CORE_CLIENT: string;
export declare const ESM_PACKAGES: string[];
export declare const CJS_EXCLUDE_PACKAGES: string[];
export declare const getCjsPackages: (packages: Package[]) => Package[];
export declare const tarIncludesFiles: string[];
export declare const TAR_OUTPUT_DIR: string;
