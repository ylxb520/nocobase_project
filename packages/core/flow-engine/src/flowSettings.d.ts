/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowEngine } from '.';
import type { FlowModel } from './models';
import { StepSettingsDialogProps, ToolbarItemConfig } from './types';
/**
 * 打开流程设置的参数接口
 */
export interface FlowSettingsOpenOptions {
  /** 目标模型实例（必填） */
  model: FlowModel;
  /** 是否打开预设（preset）步骤的配置 */
  preset?: boolean;
  /** 指定打开的单个流程 key（优先级高于 flowKeys） */
  flowKey?: string;
  /** 指定同时打开的多个流程 key（当 flowKey 存在时忽略） */
  flowKeys?: string[];
  /** 指定打开的步骤 key（配合 flowKey 使用） */
  stepKey?: string;
  /** 弹窗展现形式（drawer 或 dialog） */
  uiMode?:
    | 'select'
    | 'switch'
    | 'dialog'
    | 'drawer'
    | 'embed'
    | {
        type?: 'dialog' | 'drawer' | 'embed' | 'select' | 'switch';
        props?: {
          title?: string;
          width?: number;
          target?: any;
          onOpen?: () => void;
          onClose?: () => void;
          /**
           * 自定义弹窗底部内容
           *
           * 支持三种形式：
           * 1. `React.ReactNode` - 直接替换整个底部内容
           * 2. `Function` - 函数式自定义，接收原始底部内容和按钮组件，返回新的内容
           * 3. `null` - 隐藏底部内容
           *
           * @example
           * ```typescript
           * // 1. 直接替换底部内容
           * footer: <div>Custom Footer</div>
           *
           * // 2. 函数式自定义 - 在原有按钮基础上添加内容
           * footer: (originNode, { OkBtn, CancelBtn }) => (
           *   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
           *     <span>Additional info</span>
           *     {originNode}
           *   </div>
           * )
           *
           * // 3. 函数式自定义 - 完全重新组合按钮
           * footer: (originNode, { OkBtn, CancelBtn }) => (
           *   <Space>
           *     <CancelBtn title="Close" />
           *     <Button type="link">Help</Button>
           *     <OkBtn title="Apply" />
           *   </Space>
           * )
           *
           * // 4. 隐藏底部
           * footer: null
           * ```
           */
          footer?:
            | React.ReactNode
            | ((
                originNode: React.ReactNode,
                extra: {
                  OkBtn: React.FC;
                  CancelBtn: React.FC;
                },
              ) => React.ReactNode)
            | null;
          [key: string]: any;
        };
      };
  /** 点击取消按钮后触发的回调（关闭后调用） */
  onCancel?: () => void | Promise<void>;
  /** 配置保存成功后触发的回调 */
  onSaved?: () => void | Promise<void>;
}
export declare class FlowSettings {
  #private;
  components: Record<string, any>;
  scopes: Record<string, any>;
  private antdComponentsLoaded;
  enabled: boolean;
  toolbarItems: ToolbarItemConfig[];
  constructor(engine: FlowEngine);
  on(event: 'beforeOpen', callback: (...args: any[]) => void): void;
  off(event: 'beforeOpen', callback: (...args: any[]) => void): void;
  /**
   * 添加默认的工具栏项目
   * @private
   */
  private addDefaultToolbarItems;
  /**
   * 加载 FlowSettings 所需的资源。
   * @returns {Promise<void>}
   * @example
   * await flowSettings.load();
   */
  load(): Promise<void>;
  /**
   * 添加组件到 FlowSettings 的组件注册表中。
   * 这些组件可以在 flow step 的 uiSchema 中使用。
   * @param {Record<string, any>} components 要添加的组件对象
   * @returns {void}
   * @example
   * flowSettings.registerComponents({ MyComponent, AnotherComponent });
   */
  registerComponents(components: Record<string, any>): void;
  /**
   * 添加作用域到 FlowSettings 的作用域注册表中。
   * 这些作用域可以在 flow step 的 uiSchema 中使用。
   * @param {Record<string, any>} scopes 要添加的作用域对象
   * @returns {void}
   * @example
   * flowSettings.registerScopes({ useMyHook, myVariable, myFunction });
   */
  registerScopes(scopes: Record<string, any>): void;
  /**
   * 启用流程设置组件的显示
   * @example
   * flowSettings.enable();
   */
  enable(): void;
  forceEnable(): void;
  /**
   * 禁用流程设置组件的显示
   * @example
   * flowSettings.disable();
   */
  disable(): void;
  forceDisable(): void;
  /**
   * 添加扩展工具栏项目
   * @param {ToolbarItemConfig} config 项目配置
   * @example
   * // 添加一个复制图标组件
   * const CopyIcon = ({ model }) => {
   *   const handleCopy = () => {
   *     navigator.clipboard.writeText(model.uid);
   *   };
   *   return (
   *     <Tooltip title="复制">
   *       <CopyOutlined onClick={handleCopy} style={{ cursor: 'pointer', fontSize: 12 }} />
   *     </Tooltip>
   *   );
   * };
   *
   * flowSettings.addToolbarItem({
   *   key: 'copy',
   *   component: CopyIcon,
   *   sort: 10 // 数字越小越靠右
   * });
   *
   * // 添加下拉菜单项目组件
   * const MoreActionsIcon = ({ model }) => {
   *   const menuItems = [
   *     { key: 'action1', label: '操作1', onClick: () => console.log('操作1', model) },
   *     { key: 'action2', label: '操作2', onClick: () => console.log('操作2', model) }
   *   ];
   *   return (
   *     <Dropdown menu={{ items: menuItems }} trigger={['hover']}>
   *       <MoreOutlined style={{ cursor: 'pointer', fontSize: 12 }} />
   *     </Dropdown>
   *   );
   * };
   *
   * flowSettings.addToolbarItem({
   *   key: 'more-actions',
   *   component: MoreActionsIcon,
   *   visible: (model) => model.someCondition,
   *   sort: 20 // 数字越大越靠左
   * });
   */
  addToolbarItem(config: ToolbarItemConfig): void;
  /**
   * 批量添加工具栏项目
   * @param {ToolbarItemConfig[]} configs 项目配置数组
   * @example
   * flowSettings.addToolbarItems([
   *   { key: 'copy', component: CopyIcon, sort: 10 },
   *   { key: 'edit', component: EditIcon, sort: 20 }
   * ]);
   */
  addToolbarItems(configs: ToolbarItemConfig[]): void;
  /**
   * 移除工具栏项目
   * @param {string} key 项目的唯一标识
   * @example
   * flowSettings.removeToolbarItem('copy');
   */
  removeToolbarItem(key: string): void;
  /**
   * 获取所有工具栏项目配置
   * @returns {ToolbarItemConfig[]} 所有项目配置
   */
  getToolbarItems(): ToolbarItemConfig[];
  /**
   * 清空所有工具栏项目
   * @example
   * flowSettings.clearToolbarItems();
   */
  clearToolbarItems(): void;
  /**
   * 显示单个步骤的配置界面
   * @param {StepSettingsDialogProps} props 步骤设置对话框的属性
   * @returns {Promise<any>} 返回表单提交的值
   * @example
   * const result = await flowSettings.openStepSettingsDialog({
   *   model: myModel,
   *   flowKey: 'myFlow',
   *   stepKey: 'myStep',
   *   dialogWidth: 800,
   *   dialogTitle: '自定义标题'
   * });
   */
  openStepSettingsDialog(props: StepSettingsDialogProps): Promise<any>;
  /**
   * 渲染单个步骤的表单
   * @private
   * @param {any} uiSchema 步骤的 UI Schema
   * @param {any} initialValues 表单初始值（在此方法中不直接使用，而是通过 form 实例获取）
   * @param {any} flowEngine 流引擎实例，用于获取 scopes 和 components
   * @param {any} form 表单实例（从外部传入以便统一管理）
   * @returns {React.ReactElement} 渲染的表单元素
   */
  renderStepForm({
    uiSchema,
    initialValues,
    flowEngine,
    form,
    onFormValuesChange,
    key,
  }: {
    uiSchema: any;
    initialValues: any;
    flowEngine: any;
    form?: any;
    onFormValuesChange?: (form: any) => void;
    key?: string;
  }): React.ReactElement;
  /**
   * 打开流程设置入口（聚合渲染多个 flow 的可配置步骤）
   *
   * 行为约定：
   * - 必须提供 model 实例；用于解析 flow 定义、上下文与保存参数。
   * - 当同时提供 flowKey 与 flowKeys 时，以 flowKey 为准（只处理单个 flow）。
   * - 当提供 stepKey 时，应与某个 flowKey 组合使用；仅渲染该 flow 下命中的步骤。
   * - 当外部明确指定了 flowKey + stepKey 且仅匹配到一个步骤时，采用“单步直出”表单（不使用折叠面板）。
   * - 当未提供 stepKey，但最终仅匹配到一个步骤时，仍保持折叠面板的外观，以区别于上述“单步直出”样式。
   * - uiMode 控制展示容器：'dialog' 或 'drawer'，由 model.context.viewer 提供具体实现。
   *
   * 副作用：
   * - 打开对应的视图容器；提交时逐步校验与保存每个 step 的参数，调用 before/after hooks，并最终触发 model.save()。
   * - 通过 model.context.message 提示保存成功或错误信息。
   *
   * 参数：
   * - options.model: FlowModel 实例（必填）。
   * - options.preset?: 当为 true 时，仅渲染 flow 中标记了 preset=true 的步骤。
   * - options.flowKey?: 目标 flow 的 key。
   * - options.flowKeys?: 多个目标 flow 的 key 列表（当同时提供 flowKey 时被忽略）。
   * - options.stepKey?: 目标步骤的 key（通常与 flowKey 搭配使用）。
   * - options.uiMode?: 默认 'dialog'。
   * - options.onCancel?: 取消按钮点击后触发的回调（无参数）。
   * - options.onSaved?: 配置保存成功后触发的回调（无参数）。
   *
   * @param {FlowSettingsOpenOptions} options 打开选项
   * @returns {Promise<boolean>} 是否成功打开弹窗
   */
  open(options: FlowSettingsOpenOptions): Promise<boolean>;
}
