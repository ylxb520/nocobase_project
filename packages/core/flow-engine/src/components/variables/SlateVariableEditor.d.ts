/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { ReactEditor } from 'slate-react';
import type { VariableInputProps, VariableElement, VariableTriggerElement, ParagraphElement } from './types';
type CustomElement = VariableElement | VariableTriggerElement | ParagraphElement;
type CustomText = {
  text: string;
  bold?: boolean;
};
declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
export interface SlateVariableEditorProps extends Omit<VariableInputProps, 'showValueComponent'> {
  /**
   * 是否使用多行编辑器
   * @default false
   */
  multiline?: boolean;
  /**
   * 输入框占位符
   */
  placeholder?: string;
  /**
   * 样式
   */
  style?: React.CSSProperties;
}
/**
 * 基于 Slate.js 的智能变量编辑器
 *
 * 完美集成 Popover + FlowContextSelector 和 InlineVariableTag，
 * 提供专业的富文本编辑体验和精确的光标控制。
 */
export declare const SlateVariableEditor: React.FC<SlateVariableEditorProps>;
export {};
