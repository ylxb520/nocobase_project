/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowModelContext } from '../flowContext';
import type { IModelComponentProps } from '../types';
import { FlowModel } from './flowModel';
/**
 * ForkFlowModel 作为 FlowModel 的独立实例：
 *  - 大部分属性在 fork 本地存储，实现真正的实例隔离
 *  - 只有特定的共享属性（如 stepParams、sortIndex）会同步到 master
 *  - 透传的函数中 this 指向 fork 实例，而非 master，确保正确的上下文
 *  - 使用 Object.create 创建临时上下文，确保 this.constructor 指向正确的类（避免异步竞态条件）
 *  - setter 方法中的 this 也指向 fork 实例，保持一致的上下文行为
 *  - 不会被注册到 FlowEngine.modelInstances 中，保持 uid → master 唯一性假设
 */
export declare class ForkFlowModel<TMaster extends FlowModel = FlowModel> {
  #private;
  /** 与 master 相同的 UID，用于日志调试 */
  readonly uid: string;
  /** 调试标识，便于在日志或断言中快速识别 */
  readonly isFork = true;
  /** 本地覆盖的 props，fork 层面的 UI/状态 */
  localProps: IModelComponentProps;
  /** master 引用 */
  private master;
  /** 是否已被释放 */
  private disposed;
  /** fork 在 master.forks 中的索引 */
  readonly forkId: string;
  /** 需要与 master 共享的属性列表 */
  private static readonly SHARED_PROPERTIES;
  /**
   * 配置需要与 master 共享的属性列表
   * @param properties 共享属性名称数组
   */
  static setSharedProperties(properties: string[]): void;
  /**
   * 获取当前配置的共享属性列表
   */
  static getSharedProperties(): string[];
  /**
   * fork 本地存储的属性，除了共享属性外的所有属性都存储在这里
   * 注意：此属性通过 Proxy 在 get/set 陷阱中被动态访问，IDE 可能无法检测到使用, 切勿删除！
   */
  private localProperties;
  constructor(master: TMaster, initialProps?: IModelComponentProps, forkId?: string);
  get context(): FlowModelContext;
  /**
   * 获取对象及其原型链上的属性描述符
   */
  private getPropertyDescriptor;
  /**
   * 修改局部 props，仅影响当前 fork
   */
  setProps(key: string | IModelComponentProps, value?: any): void;
  /**
   * 清理局部 props，仅影响当前 fork
   */
  clearProps(): {};
  /**
   * render 依旧使用 master 的方法，但合并后的 props 需要透传
   */
  render(): any;
  /**
   * 事件缓存的作用域标识（fork 专用）。
   */
  getFlowCacheScope(eventName: string): string;
  /**
   * 释放 fork：从 master.forks 中移除自身并断开引用
   */
  dispose(): void;
  /**
   * 获取合并后的 props（master + localProps，local 优先）
   */
  getProps(): IModelComponentProps;
  /**
   * 检查属性是否为共享属性
   */
  private isSharedProperty;
}
export type ForkFlowModel<TMaster extends FlowModel = FlowModel> = FlowModel;
