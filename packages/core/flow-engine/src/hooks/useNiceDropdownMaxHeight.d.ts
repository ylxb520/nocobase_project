/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * 通过鼠标的位置计算出最佳的 dropdown 的高度，以尽量避免出现滚动条
 * @param deps 类似于 useEffect 的第二个参数，如果不传则默认为 []
 */
export declare const useNiceDropdownMaxHeight: (deps?: any[]) => number;
