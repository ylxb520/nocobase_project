/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowEngine } from './flowEngine';
/**
 * ViewScopedFlowEngine（视图作用域引擎）
 *
 * 设计目标：
 * - 仅在视图（dialog/drawer/embed）作用域内隔离“模型实例表”和“事件缓存”；
 * - 其余能力（动作/事件/模型类/资源/仓库/设置/日志/翻译等）全部直接代理到父引擎；
 * - 使用 Proxy 实现“最小代理”，保持与父引擎的全局一致性。
 *
 * 注意：
 * - 本地化的字段仅有：`_modelInstances`、`_applyFlowCache`、`executor`、`context`；
 * - 其它字段/方法均通过 Proxy 转发到父引擎；
 * - 这满足“同一 uid 在不同视图中互不污染（实例/缓存隔离）”与“共享全局注册/仓库”的诉求。
 */
export declare function createViewScopedEngine(parent: FlowEngine): FlowEngine;
