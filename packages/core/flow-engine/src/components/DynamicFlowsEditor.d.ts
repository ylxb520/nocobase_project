/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
/**
 * 动态流编辑器（纯组件）
 * - 使用 Tabs 分隔多个 Flow
 * - 每个 Flow 下方显示：事件名输入框（编辑 flow.on）+ Steps 折叠面板
 * - 每个 Step 面板内部：一个 JSON 文本框编辑 defaultParams
 * - 支持新增/删除 Flow 与 Step；所有改动直接作用于传入的响应式 value
 */
export declare const DynamicFlowsEditor: React.JSX.Element;
