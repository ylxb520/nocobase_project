/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * 解析模块 URL，将相对路径转换为完整的 CDN URL
 *
 * @param url - 模块地址（支持相对路径或完整 URL）
 * @param options - 可选配置
 * @param options.addSuffix - 是否添加 ESM_CDN_SUFFIX 后缀（如 `+esm`），默认为 `true`
 * @returns 解析后的完整 URL
 *
 * @example
 * ```ts
 * // 相对路径会被拼接上 CDN 前缀和后缀（默认添加）
 * // 如果使用 esm.sh（默认），不需要后缀
 * resolveModuleUrl('vue@3.4.0')
 * // => 'https://esm.sh/vue@3.4.0'
 *
 * // 如果使用 jsdelivr，需要配置 ESM_CDN_SUFFIX='/+esm'
 * // resolveModuleUrl('vue@3.4.0') => 'https://cdn.jsdelivr.net/npm/vue@3.4.0/+esm'
 *
 * // 不添加后缀（适用于 UMD 库或 CSS 文件）
 * resolveModuleUrl('vue@3.4.0', { addSuffix: false })
 * // => 'https://esm.sh/vue@3.4.0' (即使配置了 suffix 也不会添加)
 *
 * // 原始 URL（适用于 UMD 库）
 * resolveModuleUrl('lodash@4.17.21/lodash.js', { raw: true })
 * // => 'https://esm.sh/lodash@4.17.21/lodash.js?raw' (即使配置了 suffix 也不会添加)
 *
 * // 完整 URL 保持不变
 * resolveModuleUrl('https://cdn.jsdelivr.net/npm/vue@3.4.0')
 * // => 'https://cdn.jsdelivr.net/npm/vue@3.4.0'
 * ```
 */
export declare function resolveModuleUrl(
  url: string,
  options?: {
    addSuffix?: boolean;
    raw?: boolean;
  },
): string;
/**
 * 判断 URL 是否为 CSS 文件
 *
 * @param url - 文件 URL（支持带 query 和 hash，如 `example.css?v=123`）
 * @returns 如果是 CSS 文件返回 `true`，否则返回 `false`
 *
 * @example
 * ```ts
 * isCssFile('style.css') // => true
 * isCssFile('style.css?v=123') // => true
 * isCssFile('style.css#section') // => true
 * isCssFile('script.js') // => false
 * ```
 */
export declare function isCssFile(url: string): boolean;
