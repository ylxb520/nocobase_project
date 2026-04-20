/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { EditorRef } from '@nocobase/client';
export interface AICodingButtonProps {
  uid: string;
  scene: string;
  language: string;
  editorRef: EditorRef;
  setActive: (key: string, active: boolean) => void;
}
export declare const AICodingButton: React.FC<AICodingButtonProps>;
