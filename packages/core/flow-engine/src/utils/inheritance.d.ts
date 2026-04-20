/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { ModelConstructor } from '../types';
/**
 * 检查一个类是否继承自指定的父类（支持多层继承）
 * @param {ModelConstructor} childClass 要检查的子类
 * @param {ModelConstructor} parentClass 父类
 * @returns {boolean} 如果子类继承自父类则返回 true
 */
export declare function isInheritedFrom(childClass: ModelConstructor, parentClass: ModelConstructor): boolean;
