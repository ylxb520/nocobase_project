/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export interface ViewParam {
  /** 视图唯一标识符，一般为某个 Model 实例的 uid */
  viewUid: string;
  /** 标签页唯一标识符 */
  tabUid?: string;
  /** 弹窗记录的 id */
  filterByTk?: string | Record<string, string | number>;
  /** source Id */
  sourceId?: string;
}
/**
 * 解析路径名为视图参数数组
 *
 * 支持解析包含多个视图的路径，每个视图可以包含 tab、filterByTk、sourceId 等参数
 *
 * @param pathname - 要解析的路径名，格式如 '/admin/xxx/view/xxx/tab/xxx'
 * @returns 视图参数数组，每个元素对应一个视图
 *
 * @example
 * ```typescript
 * parsePathnameToViewParams('/admin/xxx') // [{ viewUid: 'xxx' }]
 * parsePathnameToViewParams('/admin/xxx/tab/yyy') // [{ viewUid: 'xxx', tabUid: 'yyy' }]
 * parsePathnameToViewParams('/admin/xxx/view/yyy') // [{ viewUid: 'xxx' }, { viewUid: 'yyy' }]
 * ```
 */
export declare const parsePathnameToViewParams: (pathname: string) => ViewParam[];
