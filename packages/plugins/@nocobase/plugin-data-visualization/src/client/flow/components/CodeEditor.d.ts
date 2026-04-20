/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { CompletionSource } from '@codemirror/autocomplete';
export interface CodeEditorProps {
  language?: string;
  value?: string;
  onChange?: (value: string) => void;
  completions?: CompletionSource | CompletionSource[];
  rightExtra?: React.ReactNode;
}
export type CodeEditorHandle = {
  insertAtCursor: (text: string) => void;
  focus: () => void;
};
export declare const CodeEditor: React.ForwardRefExoticComponent<
  CodeEditorProps & React.RefAttributes<CodeEditorHandle>
>;
