/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { Collection } from '../data-source';
import type { FlowContext, PropertyMetaFactory } from '../flowContext';
/**
 * 创建一个用于“对象类变量”（如 formValues / item）的 `resolveOnServer` 判定函数。
 * 仅当访问路径以“关联字段名”开头（且继续访问其子属性）时，返回 true 交由服务端解析；
 * 否则在前端解析即可。
 *
 * @param collectionAccessor 返回当前对象所在 collection
 * @param valueAccessor 可选，本地值访问器。若本地已存在目标子路径的值，则认为无需走后端，优先使用本地值。
 * @returns `(subPath) => boolean` 判断是否需要服务端解析
 */
export declare function createAssociationSubpathResolver(
  collectionAccessor: () => Collection | null,
  valueAccessor?: () => unknown,
): (subPath: string) => boolean;
/**
 * 构建“对象类变量”的 PropertyMetaFactory：
 * - 暴露集合字段结构（通过 createCollectionContextMeta）用于变量选择器；
 * - 提供 buildVariablesParams：基于对象当前值，收集所有“已选择的关联字段”
 *   以便服务端在 variables:resolve 时按需补全关联数据。
 *
 * @param collectionAccessor 获取集合对象，用于字段/元信息来源
 * @param title 变量组标题（用于 UI 展示）
 * @param valueAccessor 获取当前对象值（如 ctx.form.getFieldsValue() / ctx.item）
 * @returns PropertyMetaFactory
 */
export declare function createAssociationAwareObjectMetaFactory(
  collectionAccessor: () => Collection | null,
  title: string,
  valueAccessor: (ctx: FlowContext) => any,
): PropertyMetaFactory;
