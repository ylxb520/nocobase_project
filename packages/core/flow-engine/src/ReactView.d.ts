/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Root, RootOptions } from 'react-dom/client';
import { FlowEngine } from './flowEngine';
export declare class ReactView {
  private flowEngine;
  private refreshCallback;
  constructor(flowEngine: FlowEngine);
  createRoot(container: HTMLElement, options?: RootOptions): Root;
  refresh(): void;
  render(children: React.ReactNode | ((root: Root) => React.ReactNode), options?: any): HTMLSpanElement;
  onRefReady<T extends HTMLElement>(ref: React.RefObject<T>, cb: (el: T) => void, timeout?: number): void;
}
